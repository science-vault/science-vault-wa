from pathlib import Path
from lxml import html as LH
import json,re
root=Path(__file__).parent;out=root/'output';manual=json.load(open(root/'manual-overrides.json'));report=json.load(open(root/'native-conversion-progress.json'));maps=json.load(open(root/'diagram-mapping.json'));assets={d['assetFile']:d for group in maps.values() for d in group.values()}
applied=[]
for path in root.glob('practice-studio-mathematics-*.json'):
 if 'index' in path.name:continue
 original=json.load(open(path));current=json.load(open(out/path.name)) if (out/path.name).exists() else original
 for i,before in enumerate(original):
  if before['id'] not in manual:continue
  edit=manual[before['id']];q=dict(before);doc=LH.fromstring('<div>'+before['html']+'</div>');shared=''.join(LH.tostring(f,encoding='unicode') for f in doc.xpath('.//figure[.//img]')[:-1]);notes=''.join(LH.tostring(p,encoding='unicode') for p in doc.xpath('./p') if p.text_content().strip() and not p.text_content().strip().startswith('Choose the matching letter'))
  q['html']='<div class="studio-native-question">'+notes+shared+edit['html']+'</div>'
  if before.get('markingMode')=='automatic':
   assert len(edit.get('optionsHtml',[]))==4,before['id'];q['optionsHtml']=edit['optionsHtml'];q['options']=['A','B','C','D']
  q.update(editableText=True,questionFormat='native-text',responseLines=0,fontFamily='Arial',fontSizePt=12,conversionOrigin='original-docx-and-reviewed-source-transcription',manualSourceReview=True)
  parsed=LH.fromstring('<div>'+q['html']+''.join(q.get('optionsHtml',[]))+'</div>');q['figures']=len(parsed.xpath('.//img|.//svg'));q['text']=re.sub(r'\s+',' ',LH.fromstring('<div>'+q['html']+'</div>').text_content()).strip()
  source_assets=parsed.xpath('.//img/@src');derived=[assets[src] for src in source_assets if src in assets]
  if derived:q['nativeDiagramSources']=list({d['assetFile']:d for d in derived}.values())
  crops=[{'assetFile':im.get('src'),'crop':im.get('data-studio-crop')} for im in parsed.xpath('.//img[@data-studio-crop]')]
  original_shared=[(im.get('src'),im.get('data-studio-crop')) for f in doc.xpath('.//figure[.//img]')[:-1] for im in f.xpath('.//img')]
  crops=[c for c in crops if (c['assetFile'],c['crop']) not in original_shared]
  if crops:q['nativeSourceCrops']=crops
  for field in ['correctAnswer','marks','markingMode','typedAnswers','answerHtml','hash','markingKeyPoints']:assert q.get(field)==before.get(field),(q['id'],field)
  current[i]=q;applied.append(q['id'])
 if any(q['id'] in manual for q in original):(out/path.name).write_text(json.dumps(current,ensure_ascii=False,separators=(',',':')))
report['converted']=list(dict.fromkeys(report['converted']+applied));report['pending']=[p for p in report['pending'] if p['id'] not in applied];(root/'native-conversion-progress.json').write_text(json.dumps(report,indent=2));print('Reviewed manual conversions:',len(applied),'pending:',len(report['pending']))
