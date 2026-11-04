from pathlib import Path
import zipfile

PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT = PROJECT_ROOT / "project.zip"

EXCLUDE_DIRS = {
    "node_modules", ".git", "__pycache__", ".pytest_cache", "build", "dist",
    ".venv", "venv", ".next", "coverage", ".emergent", "memory", "test_reports",
}
EXCLUDE_FILES = {"project.zip", "test_credentials.md", "test_result.md"}


def should_exclude_file(path: Path) -> bool:
    return (
        path.name in EXCLUDE_FILES
        or path.name.endswith(".pyc")
        or path.name == ".env"
        or path.name.startswith(".env.")
    )

count = 0
with zipfile.ZipFile(OUTPUT, "w", zipfile.ZIP_DEFLATED) as zf:
    for root in PROJECT_ROOT.rglob("*"):
        if any(part in EXCLUDE_DIRS for part in root.relative_to(PROJECT_ROOT).parts):
            continue
        if root.is_file() and not should_exclude_file(root):
            zf.write(root, root.relative_to(PROJECT_ROOT))
            count += 1

size_mb = OUTPUT.stat().st_size / (1024 * 1024)
print(f"Created {OUTPUT} with {count} files ({size_mb:.2f} MB)")
