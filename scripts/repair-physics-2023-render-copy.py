"""Prepare a temporary Word render copy; never overwrite the source repository DOCX.

LibreOffice drops bare rectangle DrawingML shapes in this source. Express those
same rectangles as roundRect with a zero corner adjustment. Keep dimensions,
anchor coordinates and fills. Unwrap DrawingML choices and resolve theme colours.
Usage: python repair-physics-2023-render-copy.py ORIGINAL.docx TEMP_COPY.docx
"""
from pathlib import Path
import sys, zipfile
from lxml import etree

source, target = map(Path,sys.argv[1:3])
assert source.resolve()!=target.resolve()
ns={'a':'http://schemas.openxmlformats.org/drawingml/2006/main',
    'wps':'http://schemas.microsoft.com/office/word/2010/wordprocessingShape',
    'mc':'http://schemas.openxmlformats.org/markup-compatibility/2006'}
with zipfile.ZipFile(source) as z:
    root=etree.fromstring(z.read('word/document.xml'))
    for alternate in root.xpath('//mc:AlternateContent',namespaces=ns):
        choice=alternate.find('{'+ns['mc']+'}Choice')
        if choice is not None:
            parent=alternate.getparent();position=parent.index(alternate)
            for child in list(choice):parent.insert(position,child);position+=1
            parent.remove(alternate)
    colours={'bg1':'FFFFFF','tx1':'000000','bg2':'D9D9D9','lt1':'FFFFFF',
             'dk1':'000000','lt2':'D9D9D9','dk2':'000000'}
    for colour in root.xpath('//a:schemeClr',namespaces=ns):
        if colour.get('val') in colours:
            colour.tag='{'+ns['a']+'}srgbClr';colour.set('val',colours[colour.get('val')])
    repaired=0
    for shape in root.xpath('//wps:wsp',namespaces=ns):
        geometry=shape.find('.//{'+ns['a']+'}prstGeom')
        if geometry is not None and geometry.get('prst')=='rect' and shape.find('{'+ns['wps']+'}txbx') is None:
            geometry.set('prst','roundRect')
            adjustments=geometry.find('{'+ns['a']+'}avLst')
            if adjustments is None:adjustments=etree.SubElement(geometry,'{'+ns['a']+'}avLst')
            adjustments.clear();etree.SubElement(adjustments,'{'+ns['a']+'}gd',name='adj',fmla='val 0')
            repaired+=1
    with zipfile.ZipFile(target,'w',compression=zipfile.ZIP_DEFLATED) as out:
        for name in z.namelist():out.writestr(name,etree.tostring(root) if name=='word/document.xml' else z.read(name))
    print(f'Preserved rectangle dimensions and anchors; repaired {repaired} shapes in temporary copy.')
