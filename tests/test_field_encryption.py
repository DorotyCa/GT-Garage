import asyncio
from pathlib import Path
import sys

from cryptography.fernet import Fernet

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))

from field_encryption import (  # noqa: E402
    BOOKING_ENCRYPTED_FIELDS,
    ENCRYPTION_VERSION,
    ENCRYPTION_VERSION_FIELD,
    ENCRYPTED_VALUE_PREFIX,
    decrypt_field,
    decrypt_fields,
    encrypt_field,
    encrypt_fields,
)
import generate_field_encryption_key  # noqa: E402
from migrate_sensitive_data import migrate_collection  # noqa: E402


def test_encrypts_and_decrypts_field_without_storing_plaintext(monkeypatch):
    monkeypatch.setenv("FIELD_ENCRYPTION_KEY", Fernet.generate_key().decode("ascii"))
    plaintext = "client@example.com"

    encrypted = encrypt_field(plaintext)

    assert encrypted.startswith(ENCRYPTED_VALUE_PREFIX)
    assert plaintext not in encrypted
    assert decrypt_field(encrypted) == plaintext


def test_encrypts_only_selected_document_fields(monkeypatch):
    monkeypatch.setenv("FIELD_ENCRYPTION_KEY", Fernet.generate_key().decode("ascii"))
    source = {"email": "client@example.com", "message": "Service question"}

    encrypted = encrypt_fields(source, BOOKING_ENCRYPTED_FIELDS)
    decrypted = decrypt_fields(encrypted, BOOKING_ENCRYPTED_FIELDS)

    assert encrypted["email"] != source["email"]
    assert encrypted["message"] == source["message"]
    assert encrypted[ENCRYPTION_VERSION_FIELD] == ENCRYPTION_VERSION
    assert decrypted["email"] == source["email"]
    assert decrypted["message"] == source["message"]


def test_encrypts_plaintext_that_looks_like_an_encryption_marker(monkeypatch):
    monkeypatch.setenv("FIELD_ENCRYPTION_KEY", Fernet.generate_key().decode("ascii"))
    plaintext = f"{ENCRYPTED_VALUE_PREFIX}user-supplied-text"

    encrypted = encrypt_field(plaintext)

    assert encrypted != plaintext
    assert decrypt_field(encrypted) == plaintext


def test_legacy_plaintext_and_empty_optional_values_remain_readable():
    assert decrypt_field("legacy@example.com") == "legacy@example.com"
    assert decrypt_field("") == ""
    assert decrypt_field(None) is None


def test_legacy_plaintext_with_ciphertext_prefix_is_not_misidentified():
    plaintext = f"{ENCRYPTED_VALUE_PREFIX}legacy-user-input"

    assert decrypt_fields({"email": plaintext}, ("email",))["email"] == plaintext


def test_key_generator_writes_key_without_printing_it(monkeypatch, tmp_path, capsys):
    env_path = tmp_path / ".env"
    monkeypatch.setattr(generate_field_encryption_key, "ENV_PATH", env_path)
    monkeypatch.delenv("FIELD_ENCRYPTION_KEY", raising=False)

    generate_field_encryption_key.main([])

    key = env_path.read_text(encoding="utf-8").split("=", 1)[1].strip()
    output = capsys.readouterr().out
    assert Fernet(key.encode("ascii"))
    assert key not in output
    assert "key value was not displayed" in output


def test_key_generator_rotates_existing_key_without_printing_it(monkeypatch, tmp_path, capsys):
    env_path = tmp_path / ".env"
    old_key = Fernet.generate_key().decode("ascii")
    env_path.write_text(f"OTHER_SETTING=keep-me\nFIELD_ENCRYPTION_KEY={old_key}\n", encoding="utf-8")
    monkeypatch.setattr(generate_field_encryption_key, "ENV_PATH", env_path)
    monkeypatch.delenv("FIELD_ENCRYPTION_KEY", raising=False)

    generate_field_encryption_key.main(["--rotate"])

    content = env_path.read_text(encoding="utf-8")
    new_key = content.split("FIELD_ENCRYPTION_KEY=", 1)[1].splitlines()[0]
    output = capsys.readouterr().out
    assert "OTHER_SETTING=keep-me" in content
    assert Fernet(new_key.encode("ascii"))
    assert new_key != old_key
    assert old_key not in output
    assert new_key not in output


def test_booking_migration_renames_plate_and_is_resumable(monkeypatch):
    monkeypatch.setenv("FIELD_ENCRYPTION_KEY", Fernet.generate_key().decode("ascii"))
    collection = _FakeCollection(
        "bookings",
        [{
            "_id": "booking-1",
            "vehicle_make": "Volkswagen",
            "vehicle_model": "Golf",
            "vehicle_year": "2018",
            "mileage": "SB 23 ABC",
            "email": "client@example.com",
            "phone": "+40123456789",
        }],
    )
    fields = (
        "vehicle_make",
        "vehicle_model",
        "vehicle_plate",
        "vehicle_year",
        "email",
        "phone",
    )

    dry_run_count = asyncio.run(migrate_collection(collection, fields, False))
    assert dry_run_count == 1
    assert collection.documents[0]["mileage"] == "SB 23 ABC"

    applied_count = asyncio.run(migrate_collection(collection, fields, True))
    assert applied_count == 1
    migrated = collection.documents[0]
    decrypted = decrypt_fields(migrated, fields)
    assert "mileage" not in migrated
    assert decrypted["vehicle_plate"] == "SB 23 ABC"
    assert migrated["email"] != "client@example.com"

    assert asyncio.run(migrate_collection(collection, fields, True)) == 0


class _FakeCollection:
    def __init__(self, name, documents):
        self.name = name
        self.documents = [dict(document) for document in documents]

    def find(self, _query, projection):
        documents = [
            {
                key: value
                for key, value in document.items()
                if projection.get(key) == 1
            }
            for document in self.documents
        ]
        return _FakeCursor(documents)

    async def update_one(self, query, update):
        document = next(doc for doc in self.documents if doc["_id"] == query["_id"])
        document.update(update.get("$set", {}))
        for field in update.get("$unset", {}):
            document.pop(field, None)


class _FakeCursor:
    def __init__(self, documents):
        self.documents = documents
        self.index = 0

    def __aiter__(self):
        return self

    async def __anext__(self):
        if self.index >= len(self.documents):
            raise StopAsyncIteration
        document = self.documents[self.index]
        self.index += 1
        return document


def test_wrong_key_fails_instead_of_returning_ciphertext_or_garbage(monkeypatch):
    monkeypatch.setenv("FIELD_ENCRYPTION_KEY", Fernet.generate_key().decode("ascii"))
    encrypted = encrypt_field("client@example.com")
    monkeypatch.setenv("FIELD_ENCRYPTION_KEY", Fernet.generate_key().decode("ascii"))

    try:
        decrypt_field(encrypted)
    except ValueError as error:
        assert "verify the encryption key" in str(error)
    else:
        raise AssertionError("A value encrypted with a different key must not decrypt.")
