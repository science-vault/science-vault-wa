from pathlib import Path
import re,json,subprocess
SOURCES={'chem':'Year 10 Chemistry End of Topic Test (Draft 2)','bio':'Yr 10 Topic test 2017 Questions sheet','earth':'Earth topic test 2015','phys':'Y10 PhysicsTest2017','mid':'Year 10 Physical Sciences Mid Topic Test 2017','sem1':'Yr 10 Exam, Sem 1, 2017','sem2':'Y10P1Exam2017Sem2'}
for p in Path('work/pdf').glob('*.pdf'):subprocess.run(['pdftotext','-layout',str(p),'work/text/'+p.stem+'.txt'])
all=[]
for slug,name in SOURCES.items():
 rows=[];current=None;section='A'
 for line in Path('work/text/'+name+'.txt').read_text().splitlines():
  if slug=='sem1' and 'Year 10 Exam Semester 1, 2016' in line:break
  if slug=='sem2' and line.strip()=='Movement Formulae':break
  if re.match(r'Section A',line.strip()):section='A'
  if 'Part B Short Answer' in line or 'SECTION B:' in line or re.match(r'Section B\s',line.strip()):section='ExtB' if slug=='earth' and len(rows)>19 else 'B'
  if re.match(r'Section C.*Problem',line.strip()):section='C'
  if re.match(r'Section C.*Comprehension',line.strip()):section='D';current={'key':slug+'-D1','number':1,'section':'D','lines':[]};rows.append(current)
  m=re.match(r'^\s*(\d{1,2})\.(?:\s+(.*))?$',line)
  if m:
   n=int(m[1])
   if slug=='sem2' and section=='B' and n in [1,2] and current and current['number']==14:current['lines'].append(line);continue
   if slug=='earth' and n==1 and rows:section='ExtA'
   key=f'{slug}-{section}{n}'
   if any(r['key']==key for r in rows):key+='x'
   current={'key':key,'number':n,'section':section,'lines':[m[2] or '']};rows.append(current)
  elif current:current['lines'].append(line)
 for r in rows:r['source']=name;r['text']='\n'.join(r.pop('lines')).strip();all.append(r)
 print(slug,len(rows))
Path('work/parsed.json').write_text(json.dumps(all,ensure_ascii=False,indent=2))
