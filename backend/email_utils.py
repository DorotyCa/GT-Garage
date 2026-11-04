import os
import re
import ipaddress
import logging
import httpx
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
OWNER_EMAIL = os.environ.get("OWNER_EMAIL")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    if resp.status_code >= 400:
        try:
            code = resp.json().get("code", "")
        except ValueError:
            code = ""
        if code in ("insufficient_credits", "integration_disabled", "daily_limit_reached"):
            logger.warning(f"Email paused: {code} ({resp.status_code})")
        else:
            logger.error(f"Email send failed: {resp.status_code} {resp.text}")
        return None
    return resp.json().get("id")


def _wrap(title: str, body: str) -> str:
    return (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="background:#090A0C;padding:32px 0">'
        '<tr><td align="center">'
        '<table role="presentation" width="560" cellpadding="0" cellspacing="0" '
        'style="background:#121418;border:1px solid #2A2F38;font-family:Arial,sans-serif">'
        f'<tr><td style="padding:24px 32px;border-bottom:1px solid #2A2F38">'
        f'<span style="font-size:11px;letter-spacing:3px;color:#FF3333;text-transform:uppercase">/// {escape(EMAIL_FROM_NAME)}</span>'
        f'<h1 style="margin:8px 0 0;font-size:22px;color:#F1F5F9;text-transform:uppercase">{escape(title)}</h1>'
        '</td></tr>'
        f'<tr><td style="padding:28px 32px;color:#94A3B8;font-size:14px;line-height:1.7">{body}</td></tr>'
        f'<tr><td style="padding:20px 32px;border-top:1px solid #2A2F38;font-size:11px;color:#64748B">'
        f'Trimis de {escape(EMAIL_FROM_NAME)}. Nu îți vom cere niciodată parola sau datele cardului prin e-mail.'
        '</td></tr>'
        '</table></td></tr></table>'
    )


def _row(label: str, value: str) -> str:
    return (
        f'<tr><td style="padding:8px 0;color:#64748B;font-size:12px;text-transform:uppercase;'
        f'letter-spacing:1px;width:130px;vertical-align:top">{escape(label)}</td>'
        f'<td style="padding:8px 0;color:#F1F5F9;font-size:14px">{value}</td></tr>'
    )


def _detail_table(rows: list[tuple[str, str]]) -> str:
    inner = "".join(_row(l, v) for l, v in rows)
    return (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        f'style="background:#181B20;border:1px solid #2A2F38;padding:16px 20px;margin:20px 0">{inner}</table>'
    )


async def notify_booking(booking: dict) -> None:
    rows = [
        ("Serviciu", escape(booking["service_name"])),
        ("Data și ora", f'{escape(booking["date"])} la {escape(booking["time_slot"])}'),
        ("Mașină", escape(f'{booking["vehicle_make"]} {booking["vehicle_model"]} ({booking["vehicle_year"]})')),
        ("Număr de referință", escape(booking["reference"])),
    ]
    try:
        await send_email(
            to=booking["email"],
            subject=f'Programare confirmată — {booking["reference"]}',
            html=_wrap(
                "Programarea ta este confirmată",
                f'<p>Bună, {escape(booking["name"])},</p>'
                f'<p>Programarea ta la {escape(EMAIL_FROM_NAME)} a fost rezervată. '
                f'Te rugăm să ajungi cu 10 minute mai devreme și să aduci carnetul de service, dacă îl ai.</p>'
                + _detail_table(rows)
                + '<p>Dorești să schimbi ora programării? Răspunde la acest e-mail sau sună la atelier.</p>',
            ),
        )
    except Exception:
        logger.exception("Booking confirmation email failed")
    if OWNER_EMAIL:
        try:
            owner_rows = rows + [
                ("Client", escape(booking["name"])),
                ("E-mail", escape(booking["email"])),
                ("Telefon", escape(booking["phone"])),
            ]
            if booking.get("notes"):
                owner_rows.append(("Note", escape(booking["notes"])))
            await send_email(
                to=OWNER_EMAIL,
                subject=f'Programare nouă: {booking["service_name"]} — {booking["date"]} {booking["time_slot"]}',
                html=_wrap("Programare nouă", "<p>Un client tocmai a făcut o programare.</p>" + _detail_table(owner_rows)),
            )
        except Exception:
            logger.exception("Owner booking notification failed")


async def notify_enquiry(enquiry: dict) -> None:
    if not OWNER_EMAIL:
        return
    rows = [
        ("Nume", escape(enquiry["name"])),
        ("E-mail", escape(enquiry["email"])),
    ]
    if enquiry.get("phone"):
        rows.append(("Telefon", escape(enquiry["phone"])))
    if enquiry.get("vehicle"):
        rows.append(("Mașină", escape(enquiry["vehicle"])))
    body = (
        "<p>A sosit un mesaj nou prin formularul de contact al site-ului.</p>"
        + _detail_table(rows)
        + f'<p style="color:#F1F5F9">{escape(enquiry["message"])}</p>'
    )
    try:
        await send_email(
            to=OWNER_EMAIL,
            subject=f'Mesaj nou de la {enquiry["name"]}',
            html=_wrap("Mesaj nou", body),
        )
    except Exception:
        logger.exception("Owner enquiry notification failed")
