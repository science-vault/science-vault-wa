"""Import reviewed PDF paper/key pairs, retaining selectable text and source graphics.

The manifest supplies source repository paths, year, units, expected count and PDFs.
Numbers must be consecutive and paper/key totals must agree. Disagreements are held.
SVG text stays selectable; native image bytes and all vector drawings are retained.
The original response lines and blank graph grids are part of the question layout.
"""
from pathlib import Path
import argparse, base64, hashlib, html, json, re
import fitz
from lxml import etree
from PIL import Image, ImageChops, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SVG = 'http://www.w3.org/2000/svg'
XLINK = 'http://www.w3.org/1999/xlink'

def administrative(text):
    return bool(re.match(r'^(?:End of Section|This page .*blank intentionally|See next page|Question\s+\d+\s+continued)', text, re.I))

def trim_section(page, rect):
    """Remove empty boundary slices and unrelated blank-page notices, preserving ink.

    Working space between a prompt and its answer line remains in the same section.
    Blank graph grids remain because their vector strokes participate in this check.
    """
    pix = page.get_pixmap(clip=rect, alpha=False)
    im = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
    draw = ImageDraw.Draw(im)
    for text, box in source_lines(page):
        if administrative(text):
            draw.rectangle((box.x0-rect.x0-2, box.y0-rect.y0-2,
                            box.x1-rect.x0+2, box.y1-rect.y0+2), fill='white')
    mask = ImageChops.difference(im, Image.new('RGB', im.size, 'white')).convert('L').point(lambda v:255 if v>35 else 0)
    ink = mask.getbbox()
    if ink is None or ink[3]-ink[1] < 5: return None
    return fitz.Rect(rect.x0, max(rect.y0, rect.y0+ink[1]-8), rect.x1,
                     min(rect.y1, rect.y0+ink[3]+8))

def source_lines(page):
    return [(''.join(s['text'] for s in line['spans']).strip(), fitz.Rect(line['bbox']))
            for block in page.get_text('dict')['blocks'] for line in block.get('lines', [])]

def boundaries(doc, expected_count):
    starts, stop, section = [], None, 'Short Response'
    for pi, page in enumerate(doc):
        lines = source_lines(page)
        for text, box in lines:
            if re.match(r'^Section\s+(?:Two|2)', text, re.I): section = 'Problem Solving'
            if re.match(r'^Section\s+(?:Three|3)', text, re.I): section = 'Comprehension'
            match = re.fullmatch(r'Question\s+(\d+)', text)
            if match and int(match[1]) == len(starts) + 1:
                marks = [re.fullmatch(r'\((\d+)\s*marks?\)', t) for t, b in lines if abs(b.y0 - box.y0) < 8]
                marks = [int(m[1]) for m in marks if m]
                if len(marks) == 1:
                    starts.append(dict(page=pi, top=box.y0 - 3, bodyTop=box.y1 + 7,
                                       number=int(match[1]), marks=marks[0], type=section))
            if len(starts) == expected_count and re.fullmatch(r'End of (?:Questions|Examination)', text, re.I):
                stop = (pi, box.y0); break
        if stop: break
    if [s['number'] for s in starts] != list(range(1, expected_count + 1)):
        raise ValueError(f'Question boundaries do not match expected count {expected_count}: {starts}')
    if stop is None:
        raise ValueError('No explicit end-of-questions marker; review final question boundary.')
    result = []
    for i, start in enumerate(starts):
        ep, ey = (starts[i+1]['page'], starts[i+1]['top']) if i + 1 < len(starts) else stop
        pieces = []
        for pi in range(start['page'], ep + 1):
            page = doc[pi]
            top = start['bodyTop'] if pi == start['page'] else 54
            bottom = ey - 4 if pi == ep else page.rect.height - 48
            for text, box in source_lines(page):
                if top < box.y0 < bottom and re.match(r'^Section\s+(?:Two|Three|2|3)\b', text, re.I): bottom = box.y0 - 5
            if bottom > top + 5:
                rect = trim_section(page, fitz.Rect(34, top, page.rect.width - 34, bottom))
                if rect: pieces.append((pi, rect))
        result.append({**start, 'pieces': pieces})
    return result

def position(text, span):
    matrix = [float(v) for v in re.findall(r'[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?', text.get('transform', 'matrix(1 0 0 1 0 0)'))]
    if len(matrix) != 6: raise ValueError('Unrecognised SVG text transform')
    x = float(span.get('x', '0').split()[0]); y = float(span.get('y', '0').split()[0])
    a, b, c, d, e, f = matrix
    return a*x+c*y+e, b*x+d*y+f

def section_svg(page, rect, prefix, assets, image_registry):
    root = etree.fromstring(page.get_svg_image(text_as_path=False).encode())
    root.set('viewBox', ' '.join(str(v) for v in [rect.x0, rect.y0, rect.width, rect.height]))
    root.set('width', str(rect.width)); root.set('height', str(rect.height))
    root.set('class', 'physics-source-svg'); root.set('role', 'group')
    root.set('aria-label', 'Source question section with selectable text and original figures')
    excluded = [box for wording, box in source_lines(page) if administrative(wording)]
    for text in root.findall('.//{%s}text' % SVG):
        for span in list(text):
            if span.text: span.text = span.text.replace('\uf0b7', '•')
            x, y = position(text, span)
            wording = ''.join(span.itertext()).strip()
            if not (rect.y0 <= y <= rect.y1 and rect.x0 <= x <= rect.x1) or administrative(wording) or any(box.x0-2 <= x <= box.x1+2 and box.y0-2 <= y <= box.y1+2 for box in excluded):
                text.remove(span)
        if not len(text): text.getparent().remove(text)
    # IDs are document-global when several source SVGs share an assessment page.
    ids = {e.get('id'): prefix + '-' + e.get('id') for e in root.iter() if e.get('id')}
    for element in root.iter():
        for attr, value in list(element.attrib.items()):
            if attr == 'id': element.set(attr, ids[value]); continue
            value = re.sub(r'url\(#([^)]*)\)', lambda m: 'url(#'+ids.get(m[1], m[1])+')', value)
            if value.startswith('#'): value = '#'+ids.get(value[1:], value[1:])
            element.set(attr, value)
        if element.tag == '{%s}image' % SVG:
            key = '{%s}href' % XLINK
            href = element.get(key, element.get('href', ''))
            if href.startswith('data:image/'):
                kind, encoded = href.split(',', 1); binary = base64.b64decode(encoded)
                suffix = '.jpg' if 'jpeg' in kind else '.png'
                digest = hashlib.sha256(binary).hexdigest()[:24]
                path = assets / (digest + suffix)
                if not path.exists(): path.write_bytes(binary)
                relative = str(path.relative_to(ROOT)); image_registry.add(relative)
                element.set(key, relative)
    return etree.tostring(root, encoding='unicode')

def content(doc, question, prefix, assets, images):
    sections, text, page_refs = [], [], []
    for i, (pi, rect) in enumerate(question['pieces']):
        page = doc[pi]
        sections.append(section_svg(page, rect, f'{prefix}-{i}', assets, images))
        text.append(page.get_text(clip=rect))
        page_refs.append({'page':pi+1, 'rect':list(rect)})
    return '<div class="physics-source-layout">'+''.join(sections)+'</div>', '\n'.join(text), page_refs

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('manifest', type=Path)
    parser.add_argument('work_directory', type=Path)
    args = parser.parse_args(); manifest = json.loads(args.manifest.read_text())
    batch = manifest['batch']; assets = ROOT / 'assets/physics/exam-import' / batch
    assets.mkdir(parents=True, exist_ok=True)
    records, held, images = [], [], set()
    for pair in manifest['pairs']:
        paper = fitz.open(args.work_directory / pair['paperPdf']); key = fitz.open(args.work_directory / pair['keyPdf'])
        questions = boundaries(paper, pair['expectedCount']); answers = boundaries(key, pair['expectedCount'])
        for q, k in zip(questions, answers):
            if q['marks'] != k['marks']:
                held.append({'paper':pair['sourceFile'], 'key':pair['sourceKeyFile'], 'question':q['number'],
                             'paperMarks':q['marks'], 'keyMarks':k['marks'], 'reason':'Paper/key total marks disagree'})
                continue
            identifier = f"PHY-REPO-{pair['examYear']}-Y{pair['year']}-U{pair['units']}-Q{q['number']:02d}"
            body, searchable, pages = content(paper, q, identifier+'-q', assets, images)
            answer, _, key_pages = content(key, k, identifier+'-k', assets, images)
            records.append({'id':identifier,'area':'Science','course':'Physics','pathway':'ATAR','year':pair['year'],
                'unit':f"Units {pair['units'][0]} & {pair['units'][-1]} ({pair['examYear']} source)",
                'syllabusVersion':f"source-{pair['examYear']}",'topic':pair.get('topics',{}).get(str(q['number']),'Source exam — topic mapping pending'),
                'type':q['type'],'difficulty':'Unclassified','marks':q['marks'],'question':body,'answer':answer,
                'searchText':searchable,'sourceFile':pair['sourceFile'],'sourceKeyFile':pair['sourceKeyFile'],
                'sourceQuestionNumber':q['number'],'sourcePages':pages,'sourceKeyPages':key_pages,
                'examYear':pair['examYear'],'sourceSyllabusYear':pair['examYear'],'sourcePublisher':pair.get('publisher','Source repository'),
                'importBatch':batch,'markingMode':'manual','responseLines':0,'parts':[],
                'questionFormat':'selectable-source-svg','reviewStatus':'Paper/key numbers and total marks agree; source layout retained; current syllabus and structured subpart marking pending'})
    output = ROOT / manifest['outputScript']
    script = """// Reviewed source paper/key pairs; source syllabus and manual marking.
(function(){const bank=window.UpperSchoolQuestionBank=window.UpperSchoolQuestionBank||[];
const seen=new Set(bank.map(q=>q.id));const records="""+json.dumps(records,ensure_ascii=False,separators=(',',':'))+""";
for(const q of records)if(!seen.has(q.id)){bank.push(q);seen.add(q.id)}
if(window.UpperSchoolSyllabusVersions)for(const q of records){const key='Science|Physics|ATAR|'+q.year;const versions=window.UpperSchoolSyllabusVersions[key]||(window.UpperSchoolSyllabusVersions[key]=[{id:'current',label:'Current SCSA syllabus',applicable2026:true}]);if(!versions.some(v=>v.id===q.syllabusVersion))versions.push({id:q.syllabusVersion,label:q.examYear+' source exams (historical syllabus)'})}
if(typeof document!=='undefined'&&!document.getElementById('physics-source-svg-style')){const style=document.createElement('style');style.id='physics-source-svg-style';style.textContent='.physics-source-svg{display:block;width:100%;height:auto;overflow:hidden;margin:8px auto 18px;background:white;user-select:text}.physics-source-svg text{user-select:text;font-family:Arial,sans-serif}.physics-source-layout{max-width:800px;margin:auto}@media print{.physics-source-svg{break-inside:avoid;page-break-inside:avoid}.qhead{break-after:avoid}}';document.head.appendChild(style)}
})();\n"""
    output.write_text(script)
    report={'batch':batch,'publishedQuestionCandidates':len(records),'heldQuestions':held,'nativeImages':sorted(images),
            'records':[{'id':q['id'],'marks':q['marks'],'sourcePages':q['sourcePages'],'sourceKeyPages':q['sourceKeyPages']} for q in records]}
    (args.work_directory / (batch+'-report.json')).write_text(json.dumps(report,indent=2))
    print(json.dumps({'questions':len(records),'held':held,'nativeImages':len(images),'scriptBytes':output.stat().st_size}))

if __name__ == '__main__': main()
