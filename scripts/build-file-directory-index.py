#!/usr/bin/env python3
"""Build a static, public-safe list of repository file paths for admin browsing."""
import json
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
paths = subprocess.check_output(["git", "ls-files", "-z"], cwd=ROOT).decode("utf-8").split("\0")
extensions = {".ppt", ".pptx", ".pps", ".ppsx", ".pdf", ".doc", ".docx", ".xls", ".xlsx"}
files = [
    {"path": path, "type": "blob"}
    for path in paths
    if path and pathlib.PurePosixPath(path).suffix.lower() in extensions
    and not path.startswith(".git/")
]
# Sort by path rather than comparing dicts.
files.sort(key=lambda entry: entry["path"].casefold())
(ROOT / "file-directory-index.json").write_text(
    json.dumps({"version": 1, "files": files}, ensure_ascii=False, separators=(",", ":")),
    encoding="utf-8",
)
print(f"Indexed {len(files)} resource files")
