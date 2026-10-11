#!/usr/bin/env python3
"""Rebuild resource-manifest.json from tracked repository resources.
Run in a Git checkout. No external network requests.
"""
import json
import pathlib
import subprocess

paths=subprocess.check_output(["git","ls-files","-z","--","resources/"]).decode("utf-8").split("\0")
items=[]
for name in paths:
    if not name or pathlib.PurePosixPath(name).suffix.lower() not in {".pdf",".doc",".docx",".ppt",".pptx",".xls",".xlsx",".csv",".txt",".mp4"}:
        continue
    # PowerPoints have their own existing manifest.
    if pathlib.PurePosixPath(name).suffix.lower() in {".ppt",".pptx"}:
        continue
    p=pathlib.Path(name)
    if p.is_file():
        items.append({"path":name,"size":p.stat().st_size})
items.sort(key=lambda x:x["path"].casefold())
pathlib.Path("resource-manifest.json").write_text(json.dumps(items,ensure_ascii=False,separators=(",",":"))+"\n",encoding="utf-8")
print(f"Indexed {len(items)} non-PowerPoint resources")
