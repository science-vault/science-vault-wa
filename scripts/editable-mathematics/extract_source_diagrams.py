import sys
if len(sys.argv) not in [2,3]:raise SystemExit('Usage: python '+sys.argv[0]+' STAGING_DIRECTORY [SUBJECT_SLUG]')
from pathlib import Path
from zipfile import ZipFile
from lxml import etree
import hashlib,json,re,subprocess,copy,shutil,os
import sys
slug=sys.argv[2] if len(sys.argv)>2 else 'area'
root=Path(sys.argv[1]);folder=root/('isolated-'+slug);raw=folder/'raw';svgs=folder/'svg';pub=root/'diagram-assets';raw.mkdir(parents=True,exist_ok=True);svgs.mkdir(exist_ok=True);pub.mkdir(exist_ok=True)
source=root/'prepared'/('practice-studio-mathematics-'+slug+'.docx');z=ZipFile(source);doc=etree.fromstring(z.read('word/document.xml'));R='{http://schemas.openxmlformats.org/officeDocument/2006/relationships}';rels={e.get('Id'):e.get('Target') for e in etree.fromstring(z.read('word/_rels/document.xml.rels'))};records=[]
for e in doc.xpath('//*[local-name()="pict" or local-name()="object"]'):
 if e.xpath('ancestor::*[local-name()="object"]'):continue
 ole=e.xpath('.//*[local-name()="OLEObject"]')
 if ole and any(a.get('ProgID') not in ['FXDraw3.Document','FG3.Document','FXStat.V1'] for a in ole):continue
 imgs=e.xpath('.//*[local-name()="imagedata"]')
 if len(imgs)!=1:continue
 im=imgs[0];shape=im.getparent();style=shape.get('style','');w=re.search(r'width:([\d.]+)pt',style);h=re.search(r'height:([\d.]+)pt',style)
 if not w or not h:continue
 if any('crop' in a.lower() for a in im.attrib):continue
 rid=im.get(R+'id');target=rels.get(rid,'')
 if Path(target).suffix.lower() not in ['.wmf','.emf']:continue
 data=z.read('word/'+target);sha=hashlib.sha256(data).hexdigest();stem='native-'+slug+'-'+sha[:16];inputfile=raw/(stem+Path(target).suffix.lower());inputfile.write_bytes(data)
 records.append({'shapeId':shape.get('id'),'relationshipId':rid,'sourceMedia':target,'sourceMediaSHA256':sha,'stem':stem,'widthPt':float(w[1]),'heightPt':float(h[1])})
inputs=sorted(set(str(p) for p in raw.iterdir()));cmd=[os.environ.get('SOFFICE') or shutil.which('soffice') or 'soffice','-env:UserInstallation=file:///tmp/lo-isolated-diagrams','--headless','--convert-to','svg','--outdir',str(svgs)]+inputs
subprocess.run(cmd,check=True,stdout=open(folder/'conversion.log','w'),stderr=subprocess.STDOUT)
assets={};mapping={};errors=[]
for rec in records:
 try:
  path=svgs/(rec['stem']+'.svg');tree=etree.parse(str(path));svg=tree.getroot()
  for node in list(svg.xpath('//*[local-name()="script" or local-name()="metadata"]')):node.getparent().remove(node)
  for node in svg.iter():
   if etree.QName(node).localname=='foreignObject':raise ValueError('ForeignObject is not supported')
   for attr in list(node.attrib):
    if etree.QName(attr).localname.lower().startswith('on'):del node.attrib[attr]
    elif etree.QName(attr).localname=='href' and not node.attrib[attr].startswith(('#','data:')):raise ValueError('External SVG reference')
    elif etree.QName(attr).localname=='font-family' and 'Times' in node.attrib[attr]:node.attrib[attr]='Arial'
  boxes=svg.xpath('//*[local-name()="rect" and @class="BoundingBox"]');box=max(boxes,key=lambda b:float(b.get('width','0'))*float(b.get('height','0')))
  x,y,w,h=[float(box.get(k)) for k in ['x','y','width','height']];assert w>0 and h>0
  assert abs((w/h)/(rec['widthPt']/rec['heightPt'])-1)<.02,'Preview aspect ratio does not match original Word diagram'
  padding=100.;vx,vy,vw,vh=x-padding,y-padding,w+2*padding,h+2*padding
  svg.set('viewBox',f'{vx:g} {vy:g} {vw:g} {vh:g}');svg.set('width','2400px');svg.set('height',f'{2400*vh/vw:.3f}px');svg.set('preserveAspectRatio','xMidYMid meet')
  output=pub/(rec['stem']+'.svg');output.write_bytes(etree.tostring(svg,xml_declaration=True,encoding='utf-8'))
  rec.update({'altText':'Original question diagram','assetFile':'assets/practice-mathematics/'+output.name,'displayWidthPx':rec['widthPt']*96/72*vw/w,'displayHeightPx':rec['heightPt']*96/72*vh/h,'assetViewBox':[vx,vy,vw,vh]})
  mapping[rec['shapeId']]=rec;assets[output.name]=rec['sourceMediaSHA256']
 except Exception as exc:errors.append({'shapeId':rec['shapeId'],'reason':str(exc)})
existing=json.loads((root/'diagram-mapping.json').read_text()) if (root/'diagram-mapping.json').exists() else {};existing[source.name]=mapping;(root/'diagram-mapping.json').write_text(json.dumps(existing,indent=2));(folder/'report.json').write_text(json.dumps({'mapped':len(mapping),'assets':assets,'errors':errors},indent=2));print('Mapped diagrams:',len(mapping),'unique assets:',len(assets),'errors:',errors)
