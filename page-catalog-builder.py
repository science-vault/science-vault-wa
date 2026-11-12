"""Update root content-page gates and the admin catalogue before Pages deployment."""
from pathlib import Path
import re,json,sys
root=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path(__file__).resolve().parent
public={'account.html','privacy.html','terms.html','copyright.html','admin-access.html','firebase-setup.html','index.html'}
student={'nerve-impulses-lesson.html','labelling.html','leaderboard.html','avatar.html','interactive-lab.html','learning-quest.html','quiz-battle.html','geography-atar.html','index.html','student-area.html','topic-hub.html','topic-hubs.html','student-quiz.html','learning-area.html','syllabus.html','about.html','contact.html','student-classes.html'}
labels={'nerve-impulses-lesson.html':'Action potentials · sample lesson','labelling.html':'Labelling Studio','update-history.html':'Update history','practice-studio-sources.html':'Practice Studio upload register','leaderboard.html':'Class and subject leaderboard','avatar.html':'My avatar and costumes','admin-reports.html':'Error reports (Admin)','interactive-lab.html':'Interactive Lab','learning-quest.html':'Learning Quest','quiz-battle.html':'Quiz Battle','index.html':'Home','teacher-area.html':'Teacher area','student-area.html':'Student area','student-quiz.html':'Practice Mode · Practice Studio','pdf-preview.html':'PDF preview','OPEN-RESOURCE-MANAGER.html':'Resource manager launcher'}
teacher={'update-history.html','assessment-builders.html','assessment-builder.html','upper-school-assessment-builder.html','practice-studio-sources.html','assessment-question-browser.html','questions.html','my-resources.html','OPEN-RESOURCE-MANAGER.html','teacher-area.html'}
pages=[]
for path in sorted(root.glob('*.html')):
 name=path.name
 # Refresh shared navigation everywhere, including the public home page.
 text=path.read_text()
 if name not in {'firebase-setup.html','admin-access.html'}:
  shell='<script defer src="site-shell.js?v=2026.11.09-label1"></script>'
  if re.search(r'<script\b[^>]*src=["\'][^"\']*site-shell\.js[^"\']*["\'][^>]*>\s*</script>',text,re.I):
   text=re.sub(r'<script\b[^>]*src=["\'][^"\']*site-shell\.js[^"\']*["\'][^>]*>\s*</script>',lambda m:shell,text,flags=re.I)
  else:
   text=re.sub(r'</head>',shell+'</head>',text,count=1,flags=re.I)
  for stylesheet in ['site-refresh.css','vault-theme.css']:
   if stylesheet not in text:
    text=re.sub(r'</head>','<link rel="stylesheet" href="'+stylesheet+'?v=2026.11.09-label1"></head>',text,count=1,flags=re.I)
  # Place the shared visual system last so legacy page styles use the same controls and palette.
  text=re.sub(r'<link\b[^>]*href=["\'][^"\']*platform-design\.css[^"\']*["\'][^>]*>', '', text, flags=re.I)
  text=re.sub(r'</head>','<link rel="stylesheet" href="platform-design.css?v=2026.11.09-label1"></head>',text,count=1,flags=re.I)
  path.write_text(text)
 if name in public or name in {'assessment-question-browser.html','practice-question-bank.html','questions.html'}:continue
 text=path.read_text()
 title=re.search(r'<title>(.*?)</title>',text,re.S|re.I)
 label=labels.get(name,re.split(r'\s*[|–—]\s*',title.group(1) if title else name)[0].strip())
 group='Classes and progress' if name in {'teacher-classes.html','student-classes.html'} else 'Teacher tools' if name in teacher else 'Practice' if name in {'student-quiz.html','quiz-battle.html'} else 'Learning and general pages' if name in student else 'Resources and course pages'
 pages.append({'id':name,'label':label,'group':'Administration' if name=='admin-reports.html' else 'Progress' if name in {'leaderboard.html','avatar.html'} else 'Discovery and adventure' if name in {'interactive-lab.html','learning-quest.html'} else group,'studentDefault':name in student,'teacherDefault':name in {'labelling.html','update-history.html','leaderboard.html','interactive-lab.html','learning-quest.html','quiz-battle.html','geography-atar.html','teacher-area.html','topic-hub.html','topic-hubs.html','assessment-builders.html','assessment-builder.html','upper-school-assessment-builder.html','practice-studio-sources.html','teacher-classes.html'}})
 if not re.search(r'<script\b[^>]*src=["\'][^"\']*access-bootstrap\.js',text,re.I):
  text=re.sub(r'<head([^>]*)>',lambda m:m.group(0)+'<script src="access-bootstrap.js?v=2026.10.9-classes"></script>',text,count=1,flags=re.I)
 if 'id="accessNoScript"' not in text:
  notice='<noscript id="accessNoScript"><style>body>*:not(#accessNoScript){display:none!important}#accessNoScript{display:block!important;padding:40px;font:16px/1.6 Arial}</style><h1>JavaScript is required</h1><p>Enable JavaScript to log in and check your page access.</p><a href="privacy.html">Privacy information</a></noscript>'
  text=re.sub(r'<body([^>]*)>',lambda m:m.group(0)+notice,text,count=1,flags=re.I)
 path.write_text(text)
pages.append({'id':'index.html','label':'Public home page','group':'Public pages','public':True,'studentDefault':True,'teacherDefault':True})
pages.sort(key=lambda p:(p['group'],p['label']))
(root/'page-catalog.mjs').write_text('// Generated by page-catalog-builder.py. Login, legal and admin screens use separate rules.\nexport const PAGES='+json.dumps(pages,ensure_ascii=False,indent=2)+';\n')
print(f'Updated {len(pages)} content-page gates and access catalogue.')












