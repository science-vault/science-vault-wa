import json,copy
from lxml import html
from pathlib import Path
def m(n):
 tag=n.tag.split('}')[-1];c=list(n);v=''.join(m(x) for x in c) if c else n.text or ''
 if tag=='mfrac':return '('+m(c[0])+')/('+m(c[1])+')'
 if tag in ['msup','msub']:return '('+m(c[0])+')'+('^' if tag=='msup' else '_')+'('+m(c[1])+')'
 if tag=='msqrt':return 'sqrt('+v+')'
 if tag=='mroot':return 'root'+m(c[1])+'('+m(c[0])+')'
 if tag in ['msubsup','munderover']:return m(c[0])+'_{'+m(c[1])+'}^{'+m(c[2])+'}'
 if tag=='mspace':return ' '
 if tag=='mtr':return '['+','.join(m(x) for x in c)+']'
 return v
if __name__=='__main__':
 for d in json.loads((Path(__file__).parent/'extracted.json').read_text()):
  if not d['source'].startswith('12 Methods'):continue
  print('\n###',d['source'])
  for q in d['questions']:
   h=html.fragment_fromstring(q['html'],create_parent='div')
   for n in h.xpath('.//math'):
    n.text=' $'+m(n)+'$ ';[n.remove(c) for c in list(n)]
   print(q['number'],q['marks'],' '.join(h.itertext()).replace('\n',' '))
