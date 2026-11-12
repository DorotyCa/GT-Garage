import argparse
import asyncio
import os
from pathlib import Path

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

from field_encryption import (
    BOOKING_ENCRYPTED_FIELDS,
    ENCRYPTION_VERSION,
    ENCRYPTION_VERSION_FIELD,
    ENQUIRY_ENCRYPTED_FIELDS,
    decrypt_field,
    decrypt_fields,
    encrypt_field,
    encrypt_fields,
    validate_encryption_key,
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")


async def migrate_collection(collection, fields, apply_changes: bool) -> int:
    projection = {"_id": 1, **{field: 1 for field in fields}}
    projection[ENCRYPTION_VERSION_FIELD] = 1
    if collection.name == "bookings":
        projection["mileage"] = 1

    changed_count = 0
    async for document in collection.find({}, projection):
        version = document.get(ENCRYPTION_VERSION_FIELD)
        if version is not None and version != ENCRYPTION_VERSION:
            raise ValueError("The collection contains an unsupported field-encryption version.")
        if version == ENCRYPTION_VERSION:
            decrypted = decrypt_fields(document, fields)
            if collection.name != "bookings" or "mileage" not in document:
                continue
            plate = decrypted.get("vehicle_plate")
            if (plate is None or plate == ""):
                plate = decrypt_field(document["mileage"])
            changed_count += 1
            if apply_changes:
                await collection.update_one(
                    {"_id": document["_id"]},
                    {
                        "$set": {"vehicle_plate": encrypt_field(plate)},
                        "$unset": {"mileage": ""},
                    },
                )
            continue

        candidate = dict(document)
        if collection.name == "bookings":
            plate = candidate.get("vehicle_plate")
            if (plate is None or plate == "") and "mileage" in candidate:
                candidate["vehicle_plate"] = candidate["mileage"]
            candidate.pop("mileage", None)

        encrypted = encrypt_fields(candidate, fields)
        updates = {
            field: encrypted[field]
            for field in fields
            if field in encrypted and encrypted[field] != document.get(field)
        }
        updates[ENCRYPTION_VERSION_FIELD] = ENCRYPTION_VERSION
        unset = {"mileage": ""} if "mileage" in document else {}
        if not updates and not unset:
            continue

        changed_count += 1
        if apply_changes:
            update = {}
            if updates:
                update["$set"] = updates
            if unset:
                update["$unset"] = unset
            await collection.update_one({"_id": document["_id"]}, update)

    return changed_count


async def run_migration(apply_changes: bool) -> None:
    validate_encryption_key()
    mongo_url = os.environ.get("MONGO_URL")
    database_name = os.environ.get("DB_NAME")
    if not mongo_url or not database_name:
        raise RuntimeError("MONGO_URL and DB_NAME must be configured.")

    client = AsyncIOMotorClient(mongo_url)
    try:
        database = client[database_name]
        bookings_count = await migrate_collection(
            database.bookings, BOOKING_ENCRYPTED_FIELDS, apply_changes
        )
        enquiries_count = await migrate_collection(
            database.enquiries, ENQUIRY_ENCRYPTED_FIELDS, apply_changes
        )
    finally:
        client.close()

    action = "Updated" if apply_changes else "Would update"
    print(f"{action} {bookings_count} booking documents and {enquiries_count} enquiry documents.")
    if not apply_changes:
        print("Dry run only. Back up the database, then rerun with --apply to write changes.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Encrypt sensitive fields in MongoDB.")
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Write the migration. Without this flag the script only reports affected document counts.",
    )
    args = parser.parse_args()
    asyncio.run(run_migration(args.apply))


if __name__ == "__main__":
    main()
