from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import time
import uuid
import logging
from datetime import datetime, timezone, timedelta
from typing import Literal, Optional
from zoneinfo import ZoneInfo

import bcrypt
import jwt
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, BackgroundTasks

from email_utils import notify_booking, notify_enquiry
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field, field_validator

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"
COOKIE_SAMESITE = os.getenv("COOKIE_SAMESITE", "lax").lower()
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() in {"1", "true", "yes"}
if COOKIE_SAMESITE not in {"lax", "strict", "none"}:
    raise ValueError("COOKIE_SAMESITE must be 'lax', 'strict', or 'none'.")
if COOKIE_SAMESITE == "none" and not COOKIE_SECURE:
    raise ValueError("COOKIE_SECURE must be true when COOKIE_SAMESITE is 'none'.")

TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"]
BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled"]
LOCAL_TIMEZONE = ZoneInfo("Europe/Bucharest")


def parse_booking_date(value: str):
    try:
        booking_date = datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Data programării nu este validă.")
    if booking_date.isoformat() != value:
        raise HTTPException(status_code=400, detail="Data programării nu este validă.")
    if booking_date < datetime.now(LOCAL_TIMEZONE).date():
        raise HTTPException(status_code=400, detail="Data programării nu poate fi în trecut.")
    if booking_date.weekday() == 6:
        raise HTTPException(status_code=400, detail="Duminica nu se fac programări.")
    return booking_date


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=15), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, user_id: str, email: str):
    access = create_access_token(user_id, email)
    refresh = create_refresh_token(user_id)
    response.set_cookie(
        key="access_token",
        value=access,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=900,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=604800,
        path="/",
    )


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Nu ești autentificat.")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Tip de token invalid.")
        subject = payload.get("sub")
        if not isinstance(subject, str) or not ObjectId.is_valid(subject):
            raise HTTPException(status_code=401, detail="Token invalid.")
        user = await db.users.find_one({"_id": ObjectId(subject)})
        if not user:
            raise HTTPException(status_code=401, detail="Utilizatorul nu a fost găsit.")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sesiunea a expirat.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalid.")


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Nu ai permisiunea de administrator.")
    return user


def parse_object_id(value: str, detail: str) -> ObjectId:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=404, detail=detail)


def serialize(doc: dict) -> dict:
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    return doc


class LoginInput(BaseModel):
    email: EmailStr
    password: str = Field(min_length=12, max_length=72)

    @field_validator("password")
    @classmethod
    def validate_password_bytes(cls, password: str) -> str:
        if len(password.encode("utf-8")) > 72:
            raise ValueError("Parola nu poate depăși 72 de octeți.")
        return password


class SiteEntryInput(BaseModel):
    email: EmailStr


class BookingCreate(BaseModel):
    service_id: str
    service_name: str
    date: str
    time_slot: str
    vehicle_make: str
    vehicle_model: str
    vehicle_year: str
    mileage: Optional[str] = ""
    notes: Optional[str] = ""
    name: str
    email: EmailStr
    phone: str


class AvailabilityBlockInput(BaseModel):
    date: str
    full_day: bool = False
    slots: list[str] = Field(default_factory=list)


class EnquiryCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    vehicle: Optional[str] = ""
    message: str


class StatusUpdate(BaseModel):
    status: str


class ReadUpdate(BaseModel):
    read: bool


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    tagline: Optional[str] = None
    price_from: Optional[float] = None
    duration_min: Optional[int] = None
    duration_unit: Optional[Literal["minutes", "hours"]] = None
    active: Optional[bool] = None
    description: Optional[str] = None


class ServiceCreate(BaseModel):
    name: str
    tagline: str = "Serviciu profesional"
    price_from: float = 0
    duration_min: int = 30
    duration_unit: Literal["minutes", "hours"] = "minutes"
    active: bool = True
    slug: str


DEFAULT_SERVICES = [
    {"slug": "ecu-tuning", "name": "ECU Diagnostics & Tuning", "tagline": "Stage 1–2 calibration", "description": "Dealer-level diagnostics and bespoke ECU remapping. We read, log and calibrate every parameter for sharper throttle response and reliable power gains.", "price_from": 249, "duration_min": 120, "active": True, "image": "https://images.unsplash.com/photo-1597986085138-7731f2566f5f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjV8MHwxfHNlYXJjaHw0fHxjYXIlMjBlbmdpbmUlMjBtZWNoYW5pYyUyMGNsb3NlJTIwdXAlMjBkZXRhaWx8ZW58MHx8fHwxNzkzMzA2OTM1fDA&ixlib=rb-4.1.0&q=85"},
    {"slug": "engine", "name": "Master Engine Overhaul", "tagline": "Full mechanical rebuild", "description": "Complete strip-down and rebuild by master technicians. Machining, timing, gaskets and tolerances restored to factory specification — or beyond.", "price_from": 1890, "duration_min": 480, "active": True, "image": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjV8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbmdpbmUlMjBtZWNoYW5pYyUyMGNsb3NlJTIwdXAlMjBkZXRhaWx8ZW58MHx8fHwxNzkzMzA2OTM1fDA&ixlib=rb-4.1.0&q=85"},
    {"slug": "brakes", "name": "Braking & Suspension", "tagline": "High-performance control", "description": "Big-brake conversions, braided lines, coilover setup and corner weighting. Stopping power and handling tuned for road or track.", "price_from": 640, "duration_min": 180, "active": True, "image": "https://images.unsplash.com/photo-1708805283017-c662be2c7a44?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4Nj66NzV8MHwxfHNlYXJjaHw0fHxjYXIlMjBkZXRhaWxpbmclMjBwb2xpc2glMjBjZXJhbWljJTIwY29hdGluZyUyMHdvcmtzaG9wfGVufDB8fHx8MTc5MzMwNjkzNXww&ixlib=rb-4.1.0&q=85"},
    {"slug": "detailing", "name": "Bespoke Ceramic Detailing", "tagline": "Atelier-grade finish", "description": "Multi-stage paint correction and 9H ceramic coating applied by hand in our climate-controlled detailing bay.", "price_from": 490, "duration_min": 360, "active": True, "image": "https://images.unsplash.com/photo-1708805282695-ef186db20192?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4Nj66NzV8MHwxfHNlYXJjaHwxfHxjYXIlMjBkZXRhaWxpbmclMjBwb2xpc2glMjBjZXJhbWljJTIwY29hdGluZyUyMHdvcmtzaG9wfGVufDB8fHx8MTc5MzMwNjkzNXww&ixlib=rb-4.1.0&q=85"},
    {"slug": "alignment", "name": "Alignment & Tires", "tagline": "Precision geometry", "description": "Laser-guided wheel alignment, road-force balancing and premium tire fitting for a perfectly planted ride.", "price_from": 180, "duration_min": 90, "active": True, "image": "https://images.unsplash.com/photo-1645400379459-f6fd3d963fd4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHw0fHxzcG9ydHMlMjBjYXIlMjBkYXJrJTIwZ2FyYWdlJTIwc3BvdGxpZ2h0JTIwbHV4dXJ5fGVufDB8fHx8MTc5MzMwNjkzNXww&ixlib=rb-4.1.0&q=85"},
]


SERVICE_COPY = {
    "ecu-tuning": {
        "name": "Diagnoză și calibrare ECU",
        "tagline": "Calibrare Stage 1–2",
        "description": "Diagnoză la nivel de reprezentanță și remapare ECU personalizată. Citim, înregistrăm și calibrăm fiecare parametru pentru un răspuns mai prompt al accelerației și câștiguri de putere fiabile.",
    },
    "engine": {
        "name": "Recondiționare completă a motorului",
        "tagline": "Reparație mecanică completă",
        "description": "Demontare completă și reconstrucție realizate de tehnicieni specializați. Prelucrăm componentele, reglăm distribuția, înlocuim garniturile și readucem toleranțele la specificațiile din fabrică sau le depășim.",
    },
    "brakes": {
        "name": "Frâne și suspensie",
        "tagline": "Control de înaltă performanță",
        "description": "Conversii la sisteme de frânare supradimensionate, conducte împletite, reglaj coilover și echilibrarea greutății pe roți. Optimizăm frânarea și manevrabilitatea pentru șosea sau circuit.",
    },
    "detailing": {
        "name": "Detailing ceramic personalizat",
        "tagline": "Finisaj la standard de atelier",
        "description": "Corecție a vopselei în mai multe etape și aplicare manuală a unui strat ceramic 9H, în spațiul nostru de detailing cu climatizare controlată.",
    },
    "alignment": {
        "name": "Geometria roților și anvelope",
        "tagline": "Geometrie de precizie",
        "description": "Reglajul geometriei roților cu laser, echilibrare cu măsurarea forțelor și montare de anvelope premium pentru o ținută de drum impecabilă.",
    },
}

for service in DEFAULT_SERVICES:
    service.update(SERVICE_COPY[service["slug"]])


@api_router.get("/")
async def root():
    return {"message": "GT-Garage API running"}


@api_router.post("/auth/login")
async def login(input: LoginInput, request: Request, response: Response):
    email = input.email.lower()
    client_host = request.client.host if request.client else "unknown"
    identifier = f"{client_host}:{email}"
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("count", 0) >= 5 and (time.time() - attempt.get("ts", 0)) < 900:
        raise HTTPException(status_code=429, detail="Prea multe încercări nereușite. Încearcă din nou peste 15 minute.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(input.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"ts": time.time()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Adresa de e-mail sau parola sunt incorecte.")
    await db.login_attempts.delete_one({"identifier": identifier})
    set_auth_cookies(response, str(user["_id"]), email)
    return {"id": str(user["_id"]), "email": email, "name": user.get("name", "Admin"), "role": user.get("role", "user")}


@api_router.post("/auth/site-entry")
async def site_entry(input: SiteEntryInput):
    user = await db.users.find_one({"email": input.email.lower(), "role": "admin"}, {"_id": 1})
    return {"requires_password": user is not None}


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie(
        "access_token",
        path="/",
        secure=COOKIE_SECURE,
        httponly=True,
        samesite=COOKIE_SAMESITE,
    )
    response.delete_cookie(
        "refresh_token",
        path="/",
        secure=COOKIE_SECURE,
        httponly=True,
        samesite=COOKIE_SAMESITE,
    )
    return {"message": "Logged out"}


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return {"id": user["_id"], "email": user["email"], "name": user.get("name", "Admin"), "role": user.get("role", "user")}


@api_router.post("/auth/refresh")
async def refresh_auth(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Sesiunea a expirat.")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sesiunea a expirat.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalid.")
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Tip de token invalid.")
    subject = payload.get("sub")
    if not isinstance(subject, str) or not ObjectId.is_valid(subject):
        raise HTTPException(status_code=401, detail="Token invalid.")
    user = await db.users.find_one({"_id": ObjectId(subject)})
    if not user:
        raise HTTPException(status_code=401, detail="Utilizatorul nu a fost găsit.")
    user_id = str(user["_id"])
    email = user["email"]
    set_auth_cookies(response, user_id, email)
    return {"id": user_id, "email": email, "name": user.get("name", "Admin"), "role": user.get("role", "user")}


@api_router.get("/services")
async def list_services():
    services = await db.services.find({"active": True}).sort("price_from", -1).to_list(100)
    return [serialize(s) for s in services]


@api_router.get("/bookings/availability")
async def booking_availability(date: str):
    parse_booking_date(date)
    booked = await db.bookings.find(
        {"date": date, "status": {"$in": ["pending", "confirmed"]}}, {"time_slot": 1, "_id": 0}
    ).to_list(100)
    block = await db.availability_blocks.find_one({"date": date}, {"_id": 0})
    blocked_slots = TIME_SLOTS if block and block.get("full_day") else (block or {}).get("slots", [])
    return {
        "date": date,
        "slots": TIME_SLOTS,
        "booked_slots": [b["time_slot"] for b in booked],
        "blocked_slots": blocked_slots,
        "unavailable": bool(block and block.get("full_day")),
    }


@api_router.post("/bookings")
async def create_booking(input: BookingCreate, background_tasks: BackgroundTasks):
    parse_booking_date(input.date)
    if input.time_slot not in TIME_SLOTS:
        raise HTTPException(status_code=400, detail="Intervalul orar selectat nu este valid.")
    block = await db.availability_blocks.find_one(
        {"date": input.date, "$or": [{"full_day": True}, {"slots": input.time_slot}]}
    )
    if block:
        raise HTTPException(status_code=409, detail="Intervalul selectat nu mai este disponibil.")
    doc = input.model_dump()
    doc["reference"] = "TQ-" + uuid.uuid4().hex[:6].upper()
    doc["status"] = "pending"
    doc["created_at"] = datetime.now(timezone.utc)
    result = await db.bookings.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    background_tasks.add_task(notify_booking, {**doc, "created_at": doc["created_at"].isoformat()})
    return doc


@api_router.post("/enquiries")
async def create_enquiry(input: EnquiryCreate, background_tasks: BackgroundTasks):
    doc = input.model_dump()
    doc["read"] = False
    doc["created_at"] = datetime.now(timezone.utc)
    result = await db.enquiries.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    background_tasks.add_task(notify_enquiry, {**doc, "created_at": doc["created_at"].isoformat()})
    return doc


@api_router.get("/admin/stats")
async def admin_stats(user: dict = Depends(require_admin)):
    return {
        "pending_bookings": await db.bookings.count_documents({"status": "pending"}),
        "total_bookings": await db.bookings.count_documents({}),
        "unread_enquiries": await db.enquiries.count_documents({"read": False}),
        "active_services": await db.services.count_documents({"active": True}),
    }


@api_router.get("/admin/bookings")
async def admin_bookings(user: dict = Depends(require_admin)):
    bookings = await db.bookings.find().sort("created_at", -1).to_list(500)
    return [serialize(b) for b in bookings]


@api_router.get("/admin/availability")
async def admin_availability(user: dict = Depends(require_admin)):
    blocks = await db.availability_blocks.find().sort("date", 1).to_list(500)
    return [serialize(block) for block in blocks]


@api_router.post("/admin/availability")
async def save_availability_block(input: AvailabilityBlockInput, user: dict = Depends(require_admin)):
    parse_booking_date(input.date)
    if input.full_day:
        slots = []
    else:
        slots = list(dict.fromkeys(input.slots))
        if not slots:
            raise HTTPException(status_code=400, detail="Selectează cel puțin un interval orar.")
        if any(slot not in TIME_SLOTS for slot in slots):
            raise HTTPException(status_code=400, detail="Unul dintre intervalele orare selectate nu este valid.")

    block = await db.availability_blocks.find_one_and_update(
        {"date": input.date},
        {"$set": {
            "date": input.date,
            "full_day": input.full_day,
            "slots": slots,
            "updated_at": datetime.now(timezone.utc),
        }, "$setOnInsert": {"created_at": datetime.now(timezone.utc)}},
        upsert=True,
        return_document=True,
    )
    return serialize(block)


@api_router.delete("/admin/availability/{block_id}")
async def delete_availability_block(block_id: str, user: dict = Depends(require_admin)):
    result = await db.availability_blocks.delete_one(
        {"_id": parse_object_id(block_id, "Indisponibilitatea nu a fost găsită.")}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Indisponibilitatea nu a fost găsită.")
    return {"id": block_id}


@api_router.patch("/admin/bookings/{booking_id}")
async def update_booking(booking_id: str, input: StatusUpdate, user: dict = Depends(require_admin)):
    if input.status not in BOOKING_STATUSES:
        raise HTTPException(status_code=400, detail="Starea selectată nu este validă.")
    result = await db.bookings.update_one(
        {"_id": parse_object_id(booking_id, "Programarea nu a fost găsită.")},
        {"$set": {"status": input.status}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Programarea nu a fost găsită.")
    return {"id": booking_id, "status": input.status}


@api_router.get("/admin/enquiries")
async def admin_enquiries(user: dict = Depends(require_admin)):
    enquiries = await db.enquiries.find().sort("created_at", -1).to_list(500)
    return [serialize(e) for e in enquiries]


@api_router.patch("/admin/enquiries/{enquiry_id}")
async def update_enquiry(enquiry_id: str, input: ReadUpdate, user: dict = Depends(require_admin)):
    result = await db.enquiries.update_one(
        {"_id": parse_object_id(enquiry_id, "Mesajul nu a fost găsit.")},
        {"$set": {"read": input.read}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Mesajul nu a fost găsit.")
    return {"id": enquiry_id, "read": input.read}


@api_router.get("/admin/services")
async def admin_services(user: dict = Depends(require_admin)):
    services = await db.services.find().sort("price_from", -1).to_list(100)
    return [serialize(s) for s in services]


@api_router.patch("/admin/services/{service_id}")
async def update_service(service_id: str, input: ServiceUpdate, user: dict = Depends(require_admin)):
    update = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update:
        raise HTTPException(status_code=400, detail="Nu există modificări de salvat.")
    result = await db.services.update_one(
        {"_id": parse_object_id(service_id, "Serviciul nu a fost găsit.")},
        {"$set": update},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Serviciul nu a fost găsit.")
    return {"id": service_id, **update}


@api_router.post("/admin/services")
async def create_service(input: ServiceCreate, user: dict = Depends(require_admin)):
    service = input.model_dump()
    if await db.services.find_one({"slug": service["slug"]}):
        raise HTTPException(status_code=409, detail="Există deja un serviciu cu acest identificator.")
    service["created_at"] = datetime.now(timezone.utc)
    result = await db.services.insert_one(service)
    service["id"] = str(result.inserted_id)
    service.pop("_id", None)
    return service


@api_router.delete("/admin/services/{service_id}")
async def delete_service(service_id: str, user: dict = Depends(require_admin)):
    result = await db.services.delete_one(
        {"_id": parse_object_id(service_id, "Serviciul nu a fost găsit.")}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Serviciul nu a fost găsit.")
    return {"message": "Serviciu șters cu succes"}


async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "office.gtsibiu@gmail.com").strip().lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "")
    password_bytes = admin_password.encode("utf-8")
    if len(password_bytes) < 12 or len(password_bytes) > 72:
        raise RuntimeError("ADMIN_PASSWORD trebuie configurată cu o parolă de 12–72 de octeți.")

    existing = await db.users.find_one({"email": admin_email})
    if existing:
        await db.users.update_one(
            {"_id": existing["_id"]},
            {"$set": {"role": "admin", "password_hash": hash_password(admin_password)}},
        )
        return

    legacy_admin = await db.users.find_one({"role": "admin", "name": "Admin"})
    if legacy_admin:
        await db.users.update_one(
            {"_id": legacy_admin["_id"]},
            {"$set": {
                "email": admin_email,
                "role": "admin",
                "password_hash": hash_password(admin_password),
            }},
        )
        return

    await db.users.insert_one({
        "email": admin_email,
        "password_hash": hash_password(admin_password),
        "name": "Admin",
        "role": "admin",
        "created_at": datetime.now(timezone.utc),
    })


async def seed_services():
    if await db.services.count_documents({}) == 0:
        await db.services.insert_many([dict(s, created_at=datetime.now(timezone.utc)) for s in DEFAULT_SERVICES])
        return

    for service in DEFAULT_SERVICES:
        stored_service = await db.services.find_one_and_update(
            {"slug": service["slug"]},
            {"$set": {key: service[key] for key in ("name", "tagline", "description")}},
            return_document=True,
        )
        if stored_service:
            await db.bookings.update_many(
                {"service_id": str(stored_service["_id"])},
                {"$set": {"service_name": service["name"]}},
            )


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.availability_blocks.create_index("date", unique=True)
    await seed_admin()
    await seed_services()


app.include_router(api_router)

configured_origins = {
    origin.strip().rstrip("/")
    for origin in os.getenv("CORS_ORIGINS", "").split(",")
    if origin.strip() and origin.strip() != "*"
}
configured_origins.update(
    {"http://localhost:3000", "http://127.0.0.1:3000", "https://frontend-dx1nmhkvs-404-brain-not-found2.vercel.app"}
)
frontend_url = os.getenv("FRONTEND_URL", "").strip().rstrip("/")
if frontend_url:
    configured_origins.add(frontend_url)
if "*" in os.getenv("CORS_ORIGINS", ""):
    logger.warning("Ignoring wildcard CORS_ORIGINS because credentialed CORS requires explicit origins.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=sorted(configured_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()