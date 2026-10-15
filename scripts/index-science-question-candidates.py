#!/usr/bin/env python3
"""Build an UNVERIFIED source-review queue, never a published question bank.

Consumes the SHA-verified corpus from prepare/convert-science-source-corpus.py.
Every distinct inventory source remains in the queue, including sources with no
recognised numbering, protected files, keys and practical/assignment material.
Numbered spans are navigation hints only: no answers, marks or eligibility are
inferred. Source diagrams, mathematics and boundaries require original-file review.
"""
import argparse, hashlib, json, re
from collections import Counter, defaultdict
from pathlib import Path
from xml.etree import ElementTree as ET
W='{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'

def numbering_formats(xml):
    if not xml:return {}
    try:root=ET.fromstring(xml)
    except ET.ParseError:return {}
    abstracts={}
    for a in root.findall(W+'abstractNum'):
        levels={}
        for level in a.findall(W+'lvl'):
            fmt=level.find(W+'numFmt');start=level.find(W+'start')
            levels[level.get(W+'ilvl','0')]={'format':fmt.get(W+'val') if fmt is not None else None,'start':int(start.get(W+'val','1')) if start is not None else 1}
        abstracts[a.get(W+'abstractNumId')]=levels
    result={}
    for n in root.findall(W+'num'):
        aid=n.find(W+'abstractNumId')
        if aid is not None:result[n.get(W+'numId')]=abstracts.get(aid.get(W+'val'),{})
    return result

def native_candidates(doc):
    blocks=doc.get('blocks',[]);formats=numbering_formats(doc.get('numberingXml'));anchors=[];counts=Counter()
    for i,b in enumerate(blocks):
        text=b.get('text','');num=b.get('numbering');reason=None;label=None
        if num:
            try:
                nr=ET.fromstring(num);nid=nr.find(W+'numId');level=nr.find(W+'ilvl');nid=nid.get(W+'val') if nid is not None else None;level=level.get(W+'val','0') if level is not None else '0';spec=formats.get(nid,{}).get(level,{})
                if level=='0' and spec.get('format') in ('decimal','decimalZero'):
                    counts[nid]+=1;label=str(spec.get('start',1)+counts[nid]-1);reason='top-level decimal numbering (restart/overrides require review)'
            except ET.ParseError:pass
        match=re.match(r'^\s*(?:(?:Question|Q)\s*(\d{1,3})\s*[:.)]?|([0-9]{1,3})[.)]\s+)\s*(\S.*)',text,re.I)
        if match:label=match.group(1) or match.group(2);reason='typed question-number prefix'
        if reason:anchors.append((i,label,reason))
    result=[]
    for j,(start,label,reason) in enumerate(anchors):
        end=anchors[j+1][0] if j+1<len(anchors) else len(blocks)
        segment=blocks[start:end];encoded=json.dumps(segment,ensure_ascii=False,sort_keys=True).encode()
        result.append({'printedNumberHint':label,'anchor':reason,'blockStart':start,'blockEndExclusive':end,'preview':blocks[start].get('text','')[:240],'segmentSha256':hashlib.sha256(encoded).hexdigest(),'containsTable':any(b.get('kind')=='table' for b in segment),'imageRelations':sorted({x for b in segment for x in b.get('imageRelations',[])})})
    return result

def page_candidates(doc):
    # Match question prefixes only at line boundaries; isolated numbers stay
    # unassigned rather than being mistaken for reliable question boundaries.
    pages=doc.get('ocrPages') or doc.get('pages') or []
    if not isinstance(pages,list):pages=[]
    result=[]
    for fallback,p in enumerate(pages,1):
        if not isinstance(p,dict):continue
        text=p.get('text') or p.get('ocrText') or '';page=p.get('page',fallback)
        for line_no,line in enumerate(text.splitlines(),1):
            m=re.match(r'^\s*(?:(?:Question|Q)\s*(\d{1,3})\s*[:.)]?|([0-9]{1,3})[.)]\s+)\s*(\S.*)',line,re.I)
            if m:result.append({'printedNumberHint':m.group(1) or m.group(2),'page':page,'line':line_no,'preview':line[:240],'anchor':'page text/OCR prefix; continuations unsegmented'})
    return result

def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--inventory',type=Path,required=True);ap.add_argument('--corpus',type=Path,required=True);ap.add_argument('--output',type=Path,required=True);args=ap.parse_args()
    inventory=json.loads(args.inventory.read_text());files=inventory.get('files',[]) if isinstance(inventory,dict) else inventory;groups=defaultdict(list)
    for f in files:groups[f['sha']].append(f)
    args.output.mkdir(parents=True,exist_ok=True);queue=[];kinds=Counter();total=0
    for sha,aliases in sorted(groups.items()):
        path=args.corpus/'corpus'/(sha+'.json');doc=json.loads(path.read_text()) if path.exists() else {};kind=doc.get('kind','unavailable');kinds[kind]+=1
        candidates=native_candidates(doc) if kind=='docx' else page_candidates(doc)
        total+=len(candidates);source={'sha':sha,'paths':[f['path'] for f in aliases],'kind':kind,'inventoryStatuses':sorted({f.get('status','pending') for f in aliases}),'candidateAnchors':candidates,'candidateCount':len(candidates),'verificationStatus':'unverified — never add to bank counts','requiresOriginalVisualReview':True,'requiresMarkingKeyReview':True,'reviewWholeDocument':not bool(candidates),'caveats':['Numbered instructions, keys and answer grids may also produce anchors.','No question, subpart, mark, diagram or formula is considered verified by this index.','No source with zero anchors is dropped; inspect unnumbered assignments and practical tasks.']}
        if kind=='docx':source['preambleBlocksBeforeFirstAnchor']=candidates[0]['blockStart'] if candidates else len(doc.get('blocks',[]));source['nativeMathAndDrawingReviewRequired']=True
        (args.output/(sha+'.json')).write_text(json.dumps(source,ensure_ascii=False,separators=(',',':'))+'\n');queue.append({k:source[k] for k in ['sha','paths','kind','inventoryStatuses','candidateCount','reviewWholeDocument']})
    summary={'distinctSources':len(queue),'inventoryPaths':sum(len(v) for v in groups.values()),'candidateAnchorsUnverified':total,'sourcesWithAnchors':sum(bool(q['candidateCount']) for q in queue),'wholeDocumentReviewRequired':sum(q['reviewWholeDocument'] for q in queue),'kinds':dict(kinds),'warning':'Staging/navigation only. These are NOT verified questions or completed imports.','sources':queue}
    (args.output/'review-queue.json').write_text(json.dumps(summary,ensure_ascii=False,separators=(',',':'))+'\n');print(json.dumps({k:v for k,v in summary.items() if k!='sources'},indent=2))
if __name__=='__main__':main()
