from pathlib import Path
import fitz,json
from PIL import Image,ImageDraw
from parse import SOURCES
# Coordinates are fractions of original page dimensions; crop diagrams only.
CROPS={
'bio-mitosis':('bio',2,.10,.10,.86,.37),
'bio-embryos':('bio',3,.285,.068,.78,.275),
'bio-crosses':('bio',3,.10,.425,.80,.675),
'bio-lice':('bio',4,.12,.18,.85,.42),
'bio-finches':('bio',5,.18,.17,.72,.31),
'bio-fossil':('bio',5,.32,.46,.68,.605),
'bio-stages':('bio',6,.09,.13,.77,.212),
'bio-pedigree':('bio',6,.16,.36,.79,.54),
'bio-mice':('bio',7,.305,.06,.695,.245),
'earth-galaxies':('earth',2,.08,.53,.88,.65),
'earth-deepfield':('earth',3,.255,.108,.763,.38),
'earth-solar':('earth',5,.08,.61,.88,.73),
'earth-hr':('earth',7,.53,.43,.94,.65),
'earth-comet':('earth',8,.27,.10,.73,.28),
'earth-spectrum':('earth',9,.15,.14,.88,.41),
'chem-sugar':('chem',3,.14,.82,.437,.935),
'chem-table':('chem',4,.15,.42,.818,.558),
'phys-swing':('phys',2,.09,.52,.49,.69),
'phys-displacement':('phys',4,.12,.08,.77,.36),
'phys-speed':('phys',5,.095,.41,.435,.64),
'phys-toboggan':('phys',8,.52,.04,.89,.24),
'mid-map':('mid',3,.05,.11,.51,.60),
'mid-tape':('mid',4,.11,.345,.665,.43),
'mid-tape2':('mid',4,.10,.795,.56,.85),
'mid-swimmer':('mid',6,.06,.73,.37,.88),
'sem1-forces':('sem1',6,.10,.07,.79,.31),
'sem1-velocity':('sem1',11,.12,.107,.867,.412),
'sem1-bike':('sem1',12,.18,.09,.69,.20),
'sem2-position':('sem2',2,.548,.17,.966,.535),
'sem2-mice':('sem2',5,.09,.435,.50,.65),
'sem2-limbs':('sem2',6,.35,.435,.97,.65),
'sem2-dimples':('sem2',10,.13,.455,.69,.645),
}
out=Path('output/assets/practice-science-year10');out.mkdir(parents=True,exist_ok=True)
thumbs=[]
for name,(slug,num,x0,y0,x1,y1) in CROPS.items():
 page=fitz.open('work/pdf/'+SOURCES[slug]+'.pdf')[num-1];w,h=page.rect.width,page.rect.height
 pix=page.get_pixmap(matrix=fitz.Matrix(2,2),clip=fitz.Rect(x0*w,y0*h,x1*w,y1*h));im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples);im.save(out/(name+'.png'),optimize=True)
 im.thumbnail((360,230));thumbs.append((name,im.copy()))
contact=Image.new('RGB',(1200,280*((len(thumbs)+2)//3)),'#ddd');d=ImageDraw.Draw(contact)
for i,(name,im) in enumerate(thumbs):x=i%3*400;y=i//3*280;contact.paste(im,(x,y+25));d.text((x+8,y+5),name,fill='black')
contact.save('work/diagrams.jpg')
