import sys
if len(sys.argv)!=2:raise SystemExit('Usage: python '+sys.argv[0]+' STAGING_DIRECTORY')
from pathlib import Path
import json
r=Path(sys.argv[1]);out=r/'output';updates={}
for p in out.glob('practice-studio-mathematics-*.json'):
 if '-index' in p.name:continue
 for q in json.loads(p.read_text()):
  if q.get('editableText'):updates[q['id']]=q
for p in r.glob('*-index.json'):
 a=json.loads(p.read_text());changed=False
 for i,q in enumerate(a):
  if q['id'] in updates:a[i]={k:v for k,v in updates[q['id']].items() if k not in ['html','answerHtml','optionsHtml']};changed=True
 if changed or (out/p.name).exists():(out/p.name).write_text(json.dumps(a,ensure_ascii=False,separators=(',',':')))
report=json.loads((r/'native-conversion-progress.json').read_text());report['format']={'font':'Arial','fontSizePt':12,'automaticAnswerLines':False};report['subjects']={'Mathematics':{'total':1128,'convertedThisBatch':len(updates),'convertedTotal':len(updates),'wholeQuestionImagesRemaining':len(report['pending']),'existingTextQuestionsToReview':500},'Mathematics Methods':{'total':278,'status':'queued'},'Physics':{'total':352,'status':'queued'},'Chemistry':{'total':353,'status':'queued'},'Human Biology':{'total':601,'status':'queued'}}
review_path=r/'all-subject-review.json'
if review_path.exists():
 review=json.loads(review_path.read_text());report['formatReview']=review;report['reviewedTotal']=review['total'];report['complete']=not report['pending'] and all(x['reviewed']==x['total'] for x in review['subjects'].values())
 for subject,stats in review['subjects'].items():
  report['subjects'].setdefault(subject,{}).update(stats,status='complete' if stats['reviewed']==stats['total'] else 'in-progress')
 if report['complete']:
  report['subjects']['Mathematics'].update(existingTextQuestionsToReview=0,existingTextQuestionsReviewed=500)
(out/'practice-studio-editable-progress.json').write_text(json.dumps(report,indent=2))
print('Metadata synchronized:',len(updates))
