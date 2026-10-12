"""Compile hand-authored Physics lesson boundaries and additional teaching content."""
import json
from pathlib import Path
root=Path(__file__).resolve().parent.parent
specs={}; current=None
for line in (root/'physics-focused-authoring.txt').read_text().splitlines():
 if not line or line.startswith('#'): continue
 if line.startswith('@'):
  current=line[1:]; specs[current]=[]; continue
 title,start,theory,question,points,claim=line.split('|')
 parts=points.split('~')
 assert len(parts)==3, title
 specs[current].append(dict(title=title,start=int(start),theory=theory,question=question,points=parts,claim=claim))
assert len(specs)==44 and all(len(v)==3 for v in specs.values())
extras=json.loads((root/'physics-extra-authoring.json').read_text())
assert len(extras)==10 and len({x['id'] for x in extras})==10
for e in extras:
 assert len(e['theory'])==3 and len(e['exam']['points'])==3
data=dict(version='2026.10.12-depth',specs=specs,extras=extras)
(root/'physics-focused-content.js').write_text('/* Authored source: physics-focused-authoring.txt and physics-extra-authoring.json. */\nwindow.PhysicsFocusedContent='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n')
print('Built 132 focused sequences and 10 additional lessons.')
