import os
from collections.abc import Iterable, Mapping
from typing import Any

from cryptography.fernet import Fernet, InvalidToken

FIELD_ENCRYPTION_KEY_ENV = "FIELD_ENCRYPTION_KEY"
ENCRYPTED_VALUE_PREFIX = "fernet:v1:"
ENCRYPTION_VERSION_FIELD = "_field_encryption_version"
ENCRYPTION_VERSION = 1

BOOKING_ENCRYPTED_FIELDS = (
    "vehicle_make",
    "vehicle_model",
    "vehicle_plate",
    "vehicle_year",
    "email",
    "phone",
)
ENQUIRY_ENCRYPTED_FIELDS = ("email", "phone")


def _get_fernet() -> Fernet:
    key = os.environ.get(FIELD_ENCRYPTION_KEY_ENV)
    if not key:
        raise RuntimeError(f"{FIELD_ENCRYPTION_KEY_ENV} must be configured.")
    try:
        return Fernet(key.encode("ascii"))
    except (UnicodeEncodeError, ValueError):
        raise RuntimeError(f"{FIELD_ENCRYPTION_KEY_ENV} is not a valid Fernet key.") from None


def validate_encryption_key() -> None:
    _get_fernet()


def encrypt_field(value: str | None) -> str | None:
    if value is None or value == "":
        return value
    if not isinstance(value, str):
        raise TypeError("Encrypted fields must contain strings or None.")
    token = _get_fernet().encrypt(value.encode("utf-8")).decode("ascii")
    return f"{ENCRYPTED_VALUE_PREFIX}{token}"


def decrypt_field(value: str | None) -> str | None:
    if value is None or value == "":
        return value
    if not isinstance(value, str):
        raise TypeError("Encrypted fields must contain strings or None.")
    if not value.startswith(ENCRYPTED_VALUE_PREFIX):
        return value
    token = value[len(ENCRYPTED_VALUE_PREFIX):]
    try:
        return _get_fernet().decrypt(token.encode("ascii")).decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError, InvalidToken):
        raise ValueError("An encrypted field cannot be decrypted; verify the encryption key.") from None


def encrypt_fields(document: Mapping[str, Any], fields: Iterable[str]) -> dict[str, Any]:
    result = dict(document)
    for field in fields:
        if field in result:
            result[field] = encrypt_field(result[field])
    result[ENCRYPTION_VERSION_FIELD] = ENCRYPTION_VERSION
    return result


def decrypt_fields(document: Mapping[str, Any], fields: Iterable[str]) -> dict[str, Any]:
    result = dict(document)
    version = result.get(ENCRYPTION_VERSION_FIELD)
    if version is None:
        return result
    if version != ENCRYPTION_VERSION:
        raise ValueError("The document uses an unsupported field-encryption version.")
    for field in fields:
        value = result.get(field)
        if value not in (None, "") and (
            not isinstance(value, str) or not value.startswith(ENCRYPTED_VALUE_PREFIX)
        ):
            raise ValueError("A field marked as encrypted is stored as plaintext.")
    for field in fields:
        if field in result:
            result[field] = decrypt_field(result[field])
    return result
