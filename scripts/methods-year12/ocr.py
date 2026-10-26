from pathlib import Path
import fitz,concurrent.futures,subprocess,io,json
from PIL import Image
R=Path(__file__).parent;out=R/'ocr';out.mkdir(exist_ok=True)
names=['2021 Methods 12 Sem 1 Exam.pdf','Soln Exam Sem 1 Methods.pdf','Calc Free Soln 12 Meth 2021.pdf','Calc Assumed Soln 12 Meth 2021.pdf']
jobs=[]
for name in names:
 d=fitz.open(R.parent/'upload'/name)
 for i,page in enumerate(d):
  if name=='Soln Exam Sem 1 Methods.pdf':rects=[fitz.Rect(x,y,x+page.rect.width/2,y+page.rect.height/2) for y in [0,page.rect.height/2] for x in [0,page.rect.width/2]]
  elif name=='2021 Methods 12 Sem 1 Exam.pdf':rects=[fitz.Rect(x,0,x+page.rect.width/2,page.rect.height) for x in [0,page.rect.width/2]]
  else:rects=[page.rect]
  for j,rect in enumerate(rects):
   p=out/(name[:-4]+f'-p{i+1:02}-{j+1}.png')
   if not p.exists():page.get_pixmap(matrix=fitz.Matrix(2.5,2.5),clip=rect,alpha=False).save(p)
   jobs.append((name,i,j,p))
def run(job):
 name,i,j,p=job;t=p.with_suffix('.txt')
 if not t.exists():subprocess.run(['tesseract',str(p),str(p.with_suffix('')),'--psm','3'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,check=True)
 return {'file':name,'page':i+1,'panel':j+1,'text':t.read_text(),'image':str(p)}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:r=list(pool.map(run,jobs))
(R/'ocr.json').write_text(json.dumps(r));print('OCR',len(r),'logical pages')
