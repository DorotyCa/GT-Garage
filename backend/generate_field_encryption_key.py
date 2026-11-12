import argparse
import os
from pathlib import Path
import tempfile

from cryptography.fernet import Fernet

KEY_NAME = "FIELD_ENCRYPTION_KEY"
ENV_PATH = Path(__file__).with_name(".env")


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Generate a local field-encryption key.")
    parser.add_argument(
        "--rotate",
        action="store_true",
        help="Replace the existing local key. Use only if no data is encrypted with it.",
    )
    args = parser.parse_args(argv)

    if KEY_NAME in os.environ:
        raise SystemExit(
            f"{KEY_NAME} is set in the process environment; refusing to write a different local key."
        )

    existing = ENV_PATH.read_text(encoding="utf-8") if ENV_PATH.exists() else ""
    lines = existing.splitlines()
    key_lines = []
    for index, line in enumerate(lines):
        name, separator, _ = line.partition("=")
        if separator and name.strip() == KEY_NAME:
            key_lines.append(index)

    if len(key_lines) > 1:
        raise SystemExit(f"Multiple {KEY_NAME} entries exist in backend/.env; refusing to modify it.")
    if key_lines and not args.rotate:
        raise SystemExit(f"{KEY_NAME} is already present in backend/.env; refusing to replace it.")

    key = Fernet.generate_key().decode("ascii")
    entry = f"{KEY_NAME}={key}"
    if key_lines:
        lines[key_lines[0]] = entry
    else:
        lines.append(entry)

    ENV_PATH.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            newline="\n",
            dir=ENV_PATH.parent,
            prefix=".env.",
            suffix=".tmp",
            delete=False,
        ) as env_file:
            temporary_path = Path(env_file.name)
            env_file.write("\n".join(lines) + "\n")
            env_file.flush()
            os.fsync(env_file.fileno())
        os.replace(temporary_path, ENV_PATH)
    finally:
        if temporary_path and temporary_path.exists():
            temporary_path.unlink()

    action = "Rotated" if key_lines else "Generated"
    print(f"{action} {KEY_NAME} in backend/.env. The key value was not displayed.")


if __name__ == "__main__":
    main()
