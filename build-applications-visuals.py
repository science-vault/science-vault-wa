"""Precise SVG teaching models, with named examples and scope limits."""
from pathlib import Path
import json,math,html
V={}
BLUE='#225da8';TEAL='#087f77';ORANGE='#b85213';INK='#172f45'
def text(x,y,s,size=17,color=INK):return f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}">{html.escape(str(s))}</text>'
def line(x,y,X,Y,color=INK,dash=False):return f'<line x1="{x}" y1="{y}" x2="{X}" y2="{Y}" stroke="{color}" stroke-width="3"'+(' stroke-dasharray="7 5"'if dash else '')+'/>'
def rect(x,y,w,h,fill='#e2f2ee',stroke=TEAL):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>'
def circle(x,y,r,fill='white',stroke=BLUE):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="3"/>'
def add(key,title,body,explain,limit='This is a named teaching example. Use the data in each written task for its calculation.'):
    V[key]=dict(title=title,svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" role="img" aria-label="{html.escape(title,quote=True)}"><rect width="640" height="400" fill="#fff"/>'+body+'</svg>',explain=explain,limit=limit)
def rows(key,title,data,explain):
    body=''
    for i,(a,b)in enumerate(data):
        y=40+i*65;body+=rect(25,y,590,55)+text(40,y+34,a,18)+text(350,y+34,b,18,BLUE)
    add(key,title,body,explain)
def axes(xlabel,ylabel):return line(65,330,590,330)+line(65,330,65,50)+text(400,385,xlabel,16)+text(80,28,ylabel,17)
def graph(key,title,points,xmax,ymax,explain,other=None):
    body=axes('Horizontal variable','Vertical variable');X=lambda x:65+510*x/xmax;Y=lambda y:330-260*y/ymax
    for i in range(6):body+=text(X(i*xmax/5)-8,357,round(i*xmax/5,2),14)+text(15,Y(i*ymax/5)+5,round(i*ymax/5,2),14)
    if other:body+='<polyline points="'+' '.join(f'{X(x)},{Y(y)}'for x,y in other)+'" fill="none" stroke="'+ORANGE+'" stroke-width="3"/>'
    body+='<polyline points="'+' '.join(f'{X(x)},{Y(y)}'for x,y in points)+'" fill="none" stroke="'+BLUE+'" stroke-width="3"/>'
    add(key,title,body,explain)

rows('pay','Separate the earnings components',[('Ordinary: 30 h × $24/h','$720'),('Overtime: 4 h × $36/h','$144'),('Fixed allowance','$25'),('Gross weekly pay','$889')],'Time-and-a-half changes the overtime rate to $36/h. Gross pay adds the three specified components before deductions.')
rows('budget','Weekly budget with an annual reserve',[('Weekly take-home income','$1000'),('Fixed + flexible expenses','$700'),('Annual bill $1040 ÷ 52','$20 per week'),('Planned saving / surplus','$150 / $130')],'All entries use one weekly basis. The reserve funds an irregular annual payment; savings is a planned allocation.')
rows('unit','Units control division and conversion',[('800 g = 0.8 kg','$4 ÷ 0.8 = $5/kg'),('1.2 kg pack at $5.40','$4.50/kg'),('AUD 100 × 0.65 foreign/AUD','65 foreign units'),('65 foreign ÷ 0.65','AUD 100')],'Price per standard quantity and currency-per-currency rates use labelled units. The two examples use separate supplied data.')
rows('percent','Multipliers preserve the reference base',[('Original price','$100'),('Increase by 10%: × 1.10','$110'),('Then decrease by 10%: × 0.90','$99'),('Overall multiplier / change','0.99 / −1%')],'The decrease uses the updated $110 base. Equal percentages in opposite directions do not cancel.')
rows('table','A labelled input–output table',[('Formula: s = 40t + t²','s in m; t in s'),('t = 0','s = 0'),('t = 1','s = 41'),('t = 2','s = 84')],'The square term makes successive output differences change. Tables show selected evaluations rather than proof about every input.')
body=text(30,35,'Rows = orders; columns = products X,Y')
body+=text(40,110,'Q =',24)+rect(100,70,160,140)+text(120,115,'3       2',24)+text(120,175,'1       4',24)
body+=text(280,145,'×',30)+rect(325,70,100,140)+text(345,115,'$8',24)+text(345,175,'$5',24)
body+=text(445,145,'=',28)+rect(490,70,115,140)+text(510,115,'$34',24)+text(510,175,'$28',24)
body+=text(40,280,'First row: 3 × $8 + 2 × $5 = $34')+text(40,320,'2×2 multiplied by 2×1 produces 2×1.')
add('matrix','Row-by-column multiplication',body,'Each order total is a sum of matching quantity–price products. Matrix order is rows by columns; the inner dimensions must agree.')
body=line(110,310,480,310,BLUE)+line(480,310,480,80,BLUE)+line(110,310,480,80,ORANGE)+rect(457,287,23,23,'white',BLUE)+text(280,350,'4 m')+text(500,210,'3 m')+text(235,160,'5 m')+text(128,293,'θ')+text(70,35,'Right triangle: 3² + 4² = 5²')
add('right','Right sides, ratios and perpendicular height',body,'For the left angle, opposite is 3 m, adjacent 4 m and hypotenuse 5 m. tan θ=3/4; the square marker identifies the required right angle.')
body=line(100,310,455,310,BLUE)+line(455,310,370,85,BLUE)+line(100,310,370,85,BLUE)+line(370,85,370,310,TEAL,True)+text(250,348,'base b')+text(395,210,'height h')+text(120,285,'C')+text(190,160,'side a')+text(70,35,'A = ½ b h = ½ a b sin C')
add('triangle','Included angle and perpendicular altitude',body,'The altitude is perpendicular to the chosen base. h=a sin C connects the sine-area rule with base × height / 2. Opposite side–angle matching is required for sine and cosine rules.')
body=rect(150,130,270,170,'#eef4fb',BLUE)+line(150,130,225,65,BLUE)+line(420,130,495,65,BLUE)+line(420,300,495,235,BLUE)+line(225,65,495,65,BLUE)+line(495,65,495,235,BLUE)+line(150,300,495,65,ORANGE)+line(150,300,495,235,TEAL,True)+text(230,342,'length l')+text(505,180,'h')+text(450,290,'w')+text(75,30,'Space diagonal² = l² + w² + h²')
add('space','Two linked right triangles in a prism',body,'The dashed base diagonal uses length and width. The orange space diagonal then combines that ground diagonal with perpendicular height. Perspective lines are illustrative; the rectangular-prism description supplies right angles.')
body=rect(80,100,430,220,'#e2f2ee',TEAL)+circle(295,210,70,'#dceafb',BLUE)+text(245,220,'pond r')+text(90,350,'Outer boundary plus inner pond boundary')+text(90,35,'Grass area = rectangle area − circle area')
add('area','Subtract a hole but count exposed boundaries',body,'The circle reduces the lawn area. If both boundaries need edging, add the rectangle perimeter and circle circumference. The drawing defines separate interior and boundary quantities.')
body=circle(230,220,130,'#f4f7fb','#90a6b8')+'<path d="M230 220 L360 220 A130 130 0 0 0 230 90 Z" fill="#dceafb" stroke="'+BLUE+'" stroke-width="3"/>'+text(270,190,'90°')+text(280,246,'r')+text(400,135,'Arc: ¼ × 2πr')+text(400,190,'Area: ¼ × πr²')+text(350,310,'Perimeter: arc + 2r')
add('sector','A quarter-circle sector',body,'A 90° sector is one quarter of a circle. The sector’s full perimeter adds both straight radii to the arc, while area uses the circle area fraction.')
body='<ellipse cx="170" cy="105" rx="80" ry="30" fill="#dceafb" stroke="'+BLUE+'" stroke-width="3"/>'+line(90,105,90,285,BLUE)+line(250,105,250,285,BLUE)+'<ellipse cx="170" cy="285" rx="80" ry="30" fill="#eef4fb" stroke="'+BLUE+'" stroke-width="3"/>'+text(100,345,'V = πr²h')+line(430,75,350,285,TEAL)+line(430,75,510,285,TEAL)+'<ellipse cx="430" cy="285" rx="80" ry="30" fill="#e2f2ee" stroke="'+TEAL+'" stroke-width="3"/>'+line(430,75,430,285,INK,True)+text(445,190,'h')+text(485,175,'l')+text(350,345,'V = ⅓πr²h')+text(50,35,'Height h is perpendicular; slant height l is different.')
add('solids','Cylinder and cone: volume versus surface',body,'Matching radius and perpendicular height give a cone one third the cylinder volume. A cone’s curved area uses its slant height, whereas its volume uses perpendicular height. These outlines are schematic, not measured views.')
body=rect(80,140,100,80)+rect(290,80,200,160)+text(75,280,'length factor 2')+text(280,280,'area factor 4')+text(75,335,'Similar solids: volume factor 2³ = 8')+text(75,35,'Scale every corresponding length by the same factor.')
add('similar','One linear factor, different geometric powers',body,'The larger rectangle doubles width and height, giving four times area. Similar three-dimensional solids with the same linear factor have eight times volume.')
body=text(35,30,'Separated bars: transport categories')
for x,h,label in [(110,110,'walk'),(260,165,'bus'),(410,90,'car')]:body+=rect(x,250-h,85,h,'#dceafb',BLUE)+text(x,282,label)
body+=line(65,250,570,250)+text(35,325,'Histogram: numerical intervals touch; area = frequency.')+text(35,365,'Unequal bin widths need frequency density for height.')
add('bars','Categorical bars and numerical histogram conventions',body,'The example category counts are 12,18,10; heights share a common count scale. Numerical histograms have touching interval bars, with density heights for unequal bin widths. This bar chart does not itself plot a numerical distribution.')
body=text(35,35,'Parallel modified box plots · travel time (minutes)')
for y,lo,q1,med,q3,hi,label in [(140,10,15,20,25,35,'A'),(250,12,18,25,32,40,'B')]:
    xx=lambda x:90+11*x
    body+=text(30,y+6,label)+line(xx(lo),y,xx(hi),y)+line(xx(lo),y-18,xx(lo),y+18)+line(xx(hi),y-18,xx(hi),y+18)+rect(xx(q1),y-25,xx(q3)-xx(q1),50)+line(xx(med),y-25,xx(med),y+25,BLUE)
body+=line(90,330,565,330)
for v in [0,10,20,30,40]:body+=text(90+11*v-5,355,v,15)
add('box','Compare median and IQR on the same scale',body,'A median is 20 minutes with IQR 10; B median is 25 with IQR 14. A has lower central time and a narrower middle half, while the ranges still overlap. Whiskers here are actual extrema; a modified plot would display flagged outliers separately.')
body=axes('z = (x − μ) / σ','Normal density')
pts=[(65+510*(z+3.5)/7,330-250*math.exp(-z*z/2))for z in [-3.5+i*7/200 for i in range(201)]]
body+='<polyline points="'+' '.join(f'{x},{y}'for x,y in pts)+'" fill="none" stroke="'+BLUE+'" stroke-width="4"/>'
for z in [-3,-2,-1,0,1,2,3]:body+=text(65+510*(z+3.5)/7-8,356,z,15)
body+=text(95,65,'Central ±1 SD ≈ 68%')+text(95,100,'Central ±2 SD ≈ 95%')
add('normal','Standard normal positions and central probability',body,'Horizontal positions are signed standard deviations. The curve is symmetric about z=0. Probability is area under the density, not the height of the curve. The density height is proportionally drawn without a numerical vertical scale.')
graph('linear','Fixed fee plus a constant rate',[(x,50+5*x)for x in range(11)],10,100,'The example is cost C=50+5h. Horizontal units are hours; vertical units dollars. The intercept is $50 and slope $5/hour. Use only h≥0 for this hire model.')
graph('piecewise','Continuous tariff with a change in rate',[(0,50),(10,100),(20,130)],20,150,'Example C=50+5x through x=10, then C=100+3(x−10). Both formulas give 100 at the join. Only excess usage receives the second rate.')
body=axes('Mass (kg)','Charge ($)')
for i,c in enumerate([10,15,20]):
    x1=90+150*i;x2=x1+150;y=320-10*c;body+=line(x1,y,x2,y,BLUE)+circle(x1,y,5,'white',BLUE)+circle(x2,y,5,BLUE,BLUE)+text(x1+50,y-15,f'${c}')
for i in range(4):body+=text(90+150*i,355,i,15)
add('step','Open lower bounds and closed upper bounds',body,'The example tariff is $10 for 0<m≤1, $15 for 1<m≤2 and $20 for 2<m≤3. Open circles exclude lower endpoints, filled circles include upper endpoints. At m=1 the price is $10.')
body=axes('Study hours x','Quiz score y');X=lambda x:65+x*100;Y=lambda y:330-y*24
for x,y in zip([1,2,3,4,5],[5,6,9,9,11]):body+=circle(X(x),Y(y),5,TEAL,TEAL)
body+=line(X(0),Y(3.5),X(5),Y(11),BLUE)+text(280,75,'ŷ = 3.5 + 1.5x')
for x in range(6):body+=text(X(x)-5,355,x,15)
for y in [0,5,10]:body+=text(25,Y(y)+5,y,15)
add('scatter','Paired observations and their fitted line',body,'The five pairs are (1,5),(2,6),(3,9),(4,9),(5,11). Least-squares prediction is ŷ=3.5+1.5x. The positive approximately linear pattern is an association; it does not establish cause.')
body=line(65,210,590,210)+line(65,330,65,45)+text(220,380,'Study hours x')+text(90,30,'Residual = observed − predicted')
for x,e in zip([1,2,3,4,5],[0,-.5,1,-.5,0]):body+=circle(65+100*x,210-100*e,6,BLUE,BLUE)+text(65+100*x-5,350,x,15)
for e in [-1,0,1]:body+=text(20,215-100*e,e,15)
add('residual','Check residual signs and remaining patterns',body,'Residuals for the scatter model are 0,−0.5,1,−0.5,0. The third observation is one score unit above the prediction. A systematic residual curve would challenge a linear model.')
body=axes('Step n','Balance uₙ');X=lambda x:65+60*x;Y=lambda y:330-y*1.4
for n in range(9):body+=circle(X(n),Y(100+10*n),4,BLUE,BLUE)+circle(X(n),Y(100*1.05**n),4,TEAL,TEAL)
body+=text(200,70,'Blue: 100 + 10n')+text(200,105,'Green: 100(1.05)ⁿ')
for n in [0,2,4,6,8]:body+=text(X(n),355,n,15)
for u in [0,100,200]:body+=text(15,Y(u)+5,u,15)
add('sequence','Discrete arithmetic and geometric terms',body,'Blue adds ten each step; green multiplies by 1.05. Terms are shown only at integer indices with u₀=100. Neither rule implies a continuous domain, and their long-term rates differ.')
body=axes('Quarter t','Sales');vals=[80,100,120,100,100,120,140,120];pts=[(65+65*i,330-1.6*v)for i,v in enumerate(vals)]
body+='<polyline points="'+' '.join(f'{x},{y}'for x,y in pts)+'" fill="none" stroke="'+BLUE+'" stroke-width="3"/>'
for i,(x,y)in enumerate(pts):body+=circle(x,y,4,BLUE,BLUE)+text(x-5,355,i+1,15)
body+=text(110,70,'Year means: 100 then 120')+text(110,100,'Q3 is highest in both years')
for v in [0,50,100,150]:body+=text(15,335-1.6*v,v,15)
add('series','Quarterly order, trend and seasonal pattern',body,'The named series is 80,100,120,100,100,120,140,120. Its year mean rises by 20; Q3 peaks suggest a quarterly pattern. Two cycles provide limited evidence for a stable long-term seasonal model.')
graph('finance','Interest-only growth versus regular repayments',[(n,12000*1.005**n)for n in range(25)],24,16000,'Both examples start at $12000 with monthly rate 0.5%. Blue retains interest without cash flows. Orange makes $550 payments at each month end. A payment model uses Bₙ₊₁=1.005Bₙ−550, not fixed-principal interest. The last scheduled payment is adjusted to the remaining payoff so the orange balance stops at zero.',[(n,max(0,12000*1.005**n-550*(1.005**n-1)/.005))for n in range(25)])
def network(key,planar=False):
    coords={'A':(110,200),'B':(310,80),'C':(310,310),'D':(520,200)};body=''
    for a,b,w in [('A','B',4),('A','C',7),('B','C',3),('B','D',8),('C','D',4)]:
        x,y=coords[a];X,Y=coords[b];body+=line(x,y,X,Y,BLUE)+text((x+X)/2+8,(y+Y)/2-10,w)
    for a,(x,y)in coords.items():body+=circle(x,y,22,'white',TEAL)+text(x-7,y+6,a,19)
    body+=text(65,35,'4 vertices · 5 edges · degrees 2,3,3,2')
    if planar:body+=text(65,380,'2 bounded faces + exterior face = 3; 4 − 5 + 3 = 2')
    add(key,'Connected weighted graph'+(' and its faces'if planar else ''),body,'The sample weights are travel costs. A–B–C–D totals 11; A–C–D also totals 11. All vertices connected with A–B,B–C,C–D form a minimum tree of cost 11. Degrees count links, not weights.'+(' This drawing has no crossing and includes the exterior face.'if planar else ''))
network('network');network('planar',True)
body=line(320,75,320,320,INK)+line(320,220,450,220,TEAL)+line(320,220,385,107,BLUE)+text(300,50,'N')+text(460,228,'E')+text(385,95,'bearing 030°')+text(332,185,'30°')+text(90,325,'East = d sin θ; north = d cos θ')+text(90,365,'Reverse bearing = (θ + 180°) mod 360°')
add('bearing','Clockwise bearing from north',body,'The ray lies 30° clockwise from north. Its east and north projections use sine and cosine respectively. Component signs determine the final quadrant when multiple legs are combined.')
body=text(35,30,'Activity-on-node · example durations in days')
nodes={'Start':(55,195),'A':(190,100),'B':(190,285),'C':(340,100),'D':(340,285),'E':(480,195),'Finish':(585,195)}
for a,b in [('Start','A'),('Start','B'),('A','C'),('A','D'),('B','D'),('C','E'),('D','E'),('E','Finish')]:
    x,y=nodes[a];X,Y=nodes[b];body+=line(x,y,X,Y,BLUE)
    dx=X-x;dy=Y-y;length=math.hypot(dx,dy);ux=dx/length;uy=dy/length;px=x+.65*dx;py=y+.65*dy
    body+=f'<polygon points="{px},{py} {px-10*ux+5*uy},{py-10*uy-5*ux} {px-10*ux-5*uy},{py-10*uy+5*ux}" fill="{BLUE}"/>'
for a,(x,y)in nodes.items():body+=rect(x-35,y-27,70,54,'white',TEAL)+text(x-25,y+5,a,15)
for a,d in [('A',4),('B',6),('C',6),('D',2),('E',3)]:x,y=nodes[a];body+=text(x-25,y+55,f'{d} days',14)
body+=text(55,380,'A–C–E = 13 days; B–D–E = 11 days')
add('project','Dependencies, concurrency and path duration',body,'A and B may start together. D waits for both; E waits for C and D. The example critical chain A–C–E takes 13 days. B and D share two days of total float. Links show dependencies; the node labels carry durations.')
body=text(35,30,'Directed arcs · arrowheads give direction')
coords={'S':(85,200),'A':(305,90),'B':(305,305),'T':(550,200)}
for a,b,c in [('S','A',8),('S','B',6),('A','T',6),('B','T',8),('A','B',2)]:
    x,y=coords[a];X,Y=coords[b];body+=line(x,y,X,Y,BLUE);dx=X-x;dy=Y-y;ln=math.hypot(dx,dy);px=x+dx*.7;py=y+dy*.7;ux=dx/ln;uy=dy/ln
    body+=f'<polygon points="{px},{py} {px-12*ux+6*uy},{py-12*uy-6*ux} {px-12*ux-6*uy},{py-12*uy+6*ux}" fill="{BLUE}"/>'+text((x+X)/2+10,(y+Y)/2,c)
for a,(x,y)in coords.items():body+=circle(x,y,22)+text(x-7,y+6,a)
body+=text(50,380,'Source cut capacity = 8 + 6 = 14')
add('flow','Arc capacities and conservation',body,'Send 6 on S–A–T, 6 on S–B–T and 2 on S–A–B–T. The total 14 equals source cut capacity 14, proving optimality. Capacities bound flows; they are not automatically actual flows.')
body=text(35,30,'One worker per job · minimise total original cost')
for i,(a,row)in enumerate(zip('ABC',[[9,2,7],[6,4,3],[5,8,1]])):
    body+=text(80,115+i*65,a,22)
    for j,c in enumerate(row):body+=rect(150+j*110,75+i*65,100,55,'#e2f2ee'if (i,j)in[(0,1),(1,0),(2,2)]else'white')+text(185+j*110,111+i*65,c,22)
for j,label in enumerate('XYZ'):body+=text(180+j*110,60,label,22)
body+=text(55,340,'A→Y, B→X, C→Z; cost 2 + 6 + 1 = 9')
add('assignment','A one-to-one minimum assignment',body,'Highlighted entries use distinct rows and columns. They total 9 in the original cost matrix. Independent row minima would assign job Z to both B and C, which is infeasible.')
assert len(V)==30
Path(__file__).with_name('applications-visuals.js').write_text('/* Precise teaching examples; generated by build-applications-visuals.py. */\nwindow.ApplicationsVisuals='+json.dumps(V,ensure_ascii=False,separators=(',',':'))+';\n')
print({'models':len(V)})
