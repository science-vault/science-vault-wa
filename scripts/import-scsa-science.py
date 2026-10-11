#!/usr/bin/env python3
"""Build the Year 7–10 mapper from SCSA's official downloadable JSON."""
import json,re,html,pathlib,urllib.request
URL="https://k10outline.scsa.wa.edu.au/__data/assets/file/0008/1270394/science.json"
SOURCE="https://k10outline.scsa.wa.edu.au/home/wa-curriculum/learning-areas/science/p-10-science-curriculum/pre-primary-to-year-10-science-syllabus"
def clean(s):
    s=re.sub(r"<[^>]+>"," ",s or "")
    return " ".join(html.unescape(s).split())
with urllib.request.urlopen(URL,timeout=40) as response:
    data=json.load(response)
entries=[]
for level in data:
    year=str(level.get("year",""))
    if year not in {"7","8","9","10"}:continue
    for strand in level.get("strands",[]):
        for sub in strand.get("subStrands",[]):
            for item in sub.get("textContents",[]):
                code=item.get("wa_code","").strip()
                if not code:continue
                entries.append({"area":"Science","subject":"Science","year":int(year),
                  "code":code,"majorStrand":strand.get("strand_name",""),
                  "strand":sub.get("header",""),"statement":clean(item.get("markdown","")),
                  "source":SOURCE,"resources":[{"type":"Official SCSA","title":"View syllabus","url":SOURCE}]})
assert all(any(e["year"]==y for e in entries) for y in (7,8,9,10)), "Missing year group in SCSA export"
pathlib.Path("science-curriculum-2026.json").write_text(json.dumps(entries,ensure_ascii=False,indent=2)+"\n")
print("Exported",len(entries),"official SCSA entries")
