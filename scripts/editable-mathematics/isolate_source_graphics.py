from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
from lxml import etree
from copy import deepcopy
import hashlib,json,re,subprocess,fitz,base64,os,shutil
root=Path(__file__).parent;folder=root/'isolated-word';inputs=folder/'inputs';pdfs=folder/'pdfs';assets=root/'diagram-assets'
for d in [inputs,pdfs,assets]:d.mkdir(parents=True,exist_ok=True)
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'};W='{'+ns['w']+'}';CV='{urn:learning-vault:conversion}'
maps=json.load(open(root/'diagram-mapping.json'));records=[]
primitive={'shapes':{8,9,25},'fractions':{1,5},'ratio-and-rates':{1,3,4},'decimals':{1}}
for source in (root/'prepared').glob('*.docx'):
 slug=source.stem.replace('practice-studio-mathematics-','')
 with ZipFile(source) as z:data={n:z.read(n) for n in z.namelist()}
 doc=etree.fromstring(data['word/document.xml']);mapping=maps.get(source.name,{})
 for node in doc.xpath('//w:pict[not(ancestor::w:object)]|//w:object|//w:drawing',namespaces=ns):
  if node.xpath('ancestor::w:object|ancestor::w:drawing',namespaces=ns):continue
  node.attrib.pop(CV+'diagram',None)
  ole=node.xpath('.//*[local-name()="OLEObject"]')
  if ole and any(o.get('ProgID') not in ['FXDraw3.Document','FG3.Document','FXStat.V1'] for o in ole):continue
  images=node.xpath('.//*[local-name()="imagedata"]')
  if len(images)==1 and images[0].getparent().get('id') in mapping:continue
  rows=node.xpath('ancestor::w:tr',namespaces=ns);num=''.join(rows[-1].xpath('./w:tc[1]//w:t/text()',namespaces=ns)).strip() if rows else ''
  number=re.fullmatch(r'(\d+)\.',num)
  if not images and not (number and int(number[1]) in primitive.get(slug,set())):continue
  if not images and len(node)==1 and etree.QName(node[0]).localname=='rect':continue
  raw=etree.tostring(node);sha=hashlib.sha256(raw).hexdigest();key='isolated-v2-'+sha[:20];name='native-'+slug+'-'+key;target=inputs/(name+'.docx')
  work=deepcopy(doc);body=work.find(W+'body');section=deepcopy(body.find(W+'sectPr'))
  for ref in section.xpath('./w:headerReference|./w:footerReference',namespaces=ns):section.remove(ref)
  body.clear();para=etree.SubElement(body,W+'p');run=etree.SubElement(para,W+'r');picture=deepcopy(node)
  for child in picture:
   if etree.QName(child).localname=='shapetype':continue
   if child.get('style'):
    style=re.sub(r'(?:margin-left|margin-top):[^;]+;?','',child.get('style'));child.set('style',style+';margin-left:0pt;margin-top:0pt')
  # Word shape types can be declared in a different question on the original page.
  originals=etree.fromstring(ZipFile(root/'sources'/source.name).read('word/document.xml'))
  present={e.get('id') for e in picture.xpath('.//*[local-name()="shapetype"]')}
  for definition in originals.xpath('//*[local-name()="shapetype"]'):
   if definition.get('id') not in present:picture.insert(0,deepcopy(definition));present.add(definition.get('id'))
  run.append(picture);body.append(section);payload=dict(data);payload['word/document.xml']=etree.tostring(work)
  if not target.exists():
   with ZipFile(target,'w',ZIP_DEFLATED) as out:
    for n,b in payload.items():out.writestr(n,b)
  node.set(CV+'diagram',key);records.append({'source':source.name,'question':num,'key':key,'sourceGraphicSHA256':sha,'name':name})
 data['word/document.xml']=etree.tostring(doc)
 with ZipFile(source,'w',ZIP_DEFLATED) as out:
  for n,b in data.items():out.writestr(n,b)
pending=[str(inputs/(r['name']+'.docx')) for r in records if not (pdfs/(r['name']+'.pdf')).exists()]
if pending:
 subprocess.run([os.environ.get('SOFFICE') or shutil.which('soffice') or 'soffice','-env:UserInstallation=file:///tmp/lo-isolated-native-word','--headless','--convert-to','pdf','--outdir',str(pdfs)]+pending,check=True,stdout=open(folder/'conversion.log','w'),stderr=subprocess.STDOUT)
errors=[]
for r in records:
 try:
  doc=fitz.open(pdfs/(r['name']+'.pdf'));assert len(doc)==1,'Graphic crosses pages'
  boxes=[fitz.Rect(b[1]) for b in doc[0].get_bboxlog() if not b[0].startswith('ignore')]
  assert boxes,'No visible graphic'
  bounds=boxes[0]
  for b in boxes[1:]:bounds|=b
  bounds=(bounds+(-2,-2,2,2))&doc[0].rect;assert bounds.width>2 and bounds.height>2
  cropped=fitz.open();page=cropped.new_page(width=bounds.width,height=bounds.height);page.show_pdf_page(page.rect,doc,0,clip=bounds)
  svg=etree.fromstring(page.get_svg_image(text_as_path=False).encode())
  for e in svg.iter():
   if etree.QName(e).localname in ['script','foreignObject']:raise ValueError('Unsupported SVG content')
   for a in list(e.attrib):
    if etree.QName(a).localname.lower().startswith('on'):del e.attrib[a]
    elif etree.QName(a).localname=='font-family':e.attrib[a]='Arial'
    elif etree.QName(a).localname=='href' and not e.attrib[a].startswith(('#','data:')):raise ValueError('External reference')
  # Composite legacy VML previews through the source PDF renderer so masks,
  # hatch patterns and linked bitmap fills remain exactly as in Word.
  pix=doc[0].get_pixmap(matrix=fitz.Matrix(4,4),clip=bounds,alpha=False)
  svg=etree.fromstring(('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+str(bounds.width)+' '+str(bounds.height)+'"><image width="'+str(bounds.width)+'" height="'+str(bounds.height)+'" preserveAspectRatio="none" href="data:image/png;base64,'+base64.b64encode(pix.tobytes('png')).decode()+'"/></svg>').encode())
  svg.set('width','2400px');svg.set('height',str(2400*bounds.height/bounds.width)+'px')
  output=assets/(r['name']+'.svg');output.write_bytes(etree.tostring(svg,xml_declaration=True,encoding='utf-8'))
  item={**r,'shapeId':r['key'],'sourceMediaSHA256':r['sourceGraphicSHA256'],'assetFile':'assets/practice-mathematics/'+output.name,'displayWidthPx':bounds.width*96/72,'displayHeightPx':bounds.height*96/72,'altText':'Original question diagram','assetViewBox':[0,0,bounds.width,bounds.height]}
  maps.setdefault(r['source'],{})[r['key']]=item
 except Exception as exc:errors.append({**r,'error':str(exc)})
(root/'diagram-mapping.json').write_text(json.dumps(maps,indent=2));(folder/'recovery.json').write_text(json.dumps({'records':records,'errors':errors},indent=2));print('Isolated original graphics:',len(records)-len(errors),'errors:',errors)
