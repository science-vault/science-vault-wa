from pathlib import Path
from PIL import Image,ImageChops,ImageStat
import json,fitz,base64,hashlib
from lxml import etree
root=Path(__file__).parent;maps=json.load(open(root/'diagram-mapping.json'));items=[d for g in maps.values() for d in g.values() if d.get('key','').startswith('isolated-v2-')];differences=[]
for item in items:
 source=fitz.open(root/'isolated-word/pdfs'/(item['name']+'.pdf'));boxes=[fitz.Rect(b[1]) for b in source[0].get_bboxlog() if not b[0].startswith('ignore')];rect=boxes[0]
 for box in boxes[1:]:rect|=box
 rect=(rect+(-2,-2,2,2))&source[0].rect;pix=source[0].get_pixmap(matrix=fitz.Matrix(2,2),clip=rect,alpha=False);expected=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
 asset=root/'diagram-assets'/Path(item['assetFile']).name;xml=etree.parse(str(asset)).getroot();images=xml.xpath('./*[local-name()="image"]');assert len(images)==1;encoded=images[0].get('href');assert encoded.startswith('data:image/png;base64,');expected_png=source[0].get_pixmap(matrix=fitz.Matrix(4,4),clip=rect,alpha=False).tobytes('png');assert hashlib.sha256(base64.b64decode(encoded.split(',',1)[1])).digest()==hashlib.sha256(expected_png).digest(),item['assetFile'];svg=fitz.open(asset);pdf=fitz.open('pdf',svg.convert_to_pdf());pix=pdf[0].get_pixmap(matrix=fitz.Matrix(expected.width/pdf[0].rect.width,expected.height/pdf[0].rect.height),alpha=False);actual=Image.frombytes('RGB',[pix.width,pix.height],pix.samples).resize(expected.size)
 difference=sum(ImageStat.Stat(ImageChops.difference(expected,actual)).mean)/3;differences.append((difference,item['assetFile']))
report={'verified':len(items),'sourcePixelHashesMatch':True,'worstMeanPixelDifference':max(x[0] for x in differences),'worst':sorted(differences,reverse=True)[:8]};(root/'diagram-roundtrip-review.json').write_text(json.dumps(report,indent=2));print('PASS:',len(items),'isolated diagrams preserve the exact original rendered pixels; resampling difference',round(report['worstMeanPixelDifference'],2))
