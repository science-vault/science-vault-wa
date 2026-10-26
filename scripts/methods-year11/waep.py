import math
from solutions import sol,SOL,AUTO,N,X,S,C
Q={}
def add(n,marks,body,rows,fields):Q[n]={'number':n,'marks':marks,'markdown':body};key='waep20-u1-'+str(n);sol(key,rows);AUTO[key]=fields
add(1,5,r'''The point $M(-2,5)$ is the midpoint of $A(-6,3)$ and B.

(a) Determine B. (2 marks)

(b) Determine the equation of the line through $C(4,-1)$ perpendicular to AM. (3 marks)''',r'''
(a)|2|The midpoint equations give $x=2,y=7$ (1 each), hence $B=(2,7)$.
(b)|3|$m_{AM}=1/2$ (1), perpendicular slope $-2$ (1), and line $y=-2x+7$ (1).
''',[C('(a) B',[2,7]),X('(b) line, y=','-2*x+7')])
add(2,4,r'''The expansion of $(x+1)^{11}$ is $x^{11}+11x^{10}+55x^9+165x^8+330x^7+462x^6+462x^5+330x^4+165x^3+55x^2+11x+1$.

(a) Determine the number of combinations of 7 objects from 11 distinct objects. (1 mark)

(b) The first four terms of $(x+1)^{12}$ are $x^{12}+px^{11}+qx^{10}+rx^9$.

(i) State the number of terms in the complete expansion. (1 mark)

(ii) Determine p, q, r. (2 marks)''',r'''
(a)|1|$\binom{11}{7}=330$.
(b)(i)|1|13 terms.
(b)(ii)|2|Pascal's rule gives $p=12,q=66,r=220$. Two correct (1), all three correct (1).
''',[N('(a) combinations',330),N('(b)(i) terms',13),C('(b)(ii) p, q, r',[12,66,220])])
add(3,5,r'''Let $f(x)=4x^2-4x+5$ and $g(x)=2x^2-8x+6$.

(a) Determine both discriminants. (2 marks)

(b) State, with justification, which function has no zeros and determine all zeros of the other. (3 marks)''',r'''
(a)|2|$\Delta_f=-64$, $\Delta_g=16$ (1 each).
(b)|3|f has no real zeros since its discriminant is negative (1). Factor $g=2(x-1)(x-3)$ (1), giving zeros 1 and 3 (1).
''',[N('(a) discriminant f',-64),N('(a) discriminant g',16),S('(b) zeros of g',[1,3])])
add(4,7,r'''(a) Sketch $y^2=x$. (2 marks)

(b) Sketch $(x+1)^2+(y-1)^2=4$. (3 marks)

(c) Explain whether y is a function of x in (a). (2 marks)''',r'''
(a)|2|Vertex $(0,0)$ (1), right-opening parabola symmetric about the x-axis with branches $\pm\sqrt x$ (1).
(b)|3|Centre $(-1,1)$ (1), radius 2 (1), smooth circle (1).
(c)|2|Not a function of x (1); for $x>0$ a vertical line meets the graph twice (1).
''',[])
add(5,8,r'''(a) Using degrees, $f(x)=2-2\sin(3x)$.

(i) State the amplitude. (1 mark)

(ii) State the period in degrees. (1 mark)

(iii) Sketch for $0\le x\le180^\circ$. (3 marks)

(b) Solve $2\cos(x-15^\circ)=\sqrt3$ for $0\le x\le360^\circ$. (3 marks)''',r'''
(a)(i)|1|Amplitude 2.
(a)(ii)|1|Period $360/3=120^\circ$.
(a)(iii)|3|Midline crossings $(0,2),(60,2),(120,2),(180,2)$ (1); minima $(30,0),(150,0)$ and maximum $(90,4)$ (1); smooth sinusoid (1).
(b)|3|$\cos(x-15^\circ)=\sqrt3/2$ (1), giving $x=45^\circ,345^\circ$ (1 each).
''',[N('(a)(i) amplitude',2),N('(a)(ii) degrees',120),S('(b) degrees',[45,345])])
add(6,7,r'''(a) V is inversely proportional to t, and V=10 when t=3.6.

(i) Explain how V changes as positive t increases. (1 mark)

(ii) Determine t when V=3. (2 marks)

(b) Part of $y=a/(x+2)$ is shown.

[FIGURE]

(i) Determine a. (1 mark)

(ii) Draw the remainder of the graph. (3 marks)''',r'''
(a)(i)|1|V decreases as positive t increases.
(a)(ii)|2|$Vt=36$ (1), hence $t=12$ (1).
(b)(i)|1|The supplied point $(-1,2)$ gives $a=2$.
(b)(ii)|3|Asymptotes $x=-2,y=0$ (1); points $(0,1),(-4,-1)$ (1); two smooth branches (1).
''',[N('(a)(ii) t',12),N('(b)(i) a',2)])
add(7,8,r'''Solve for x:

(a) $x^2+20x-21=0$. (2 marks)

(b) $(x-1)^2-4=2x-3$. (3 marks)

(c) $x^3-2x^2-11x+12=0$. (3 marks)''',r'''
(a)|2|Factor $(x-1)(x+21)$ (1), giving $x=1,-21$ (1).
(b)|3|Expand to $x^2-4x=0$ (1), factor $x(x-4)$ (1), giving $x=0,4$ (1).
(c)|3|Find factor $x-1$ (1), factor completely to $(x-1)(x+3)(x-4)$ (1), giving $x=-3,1,4$ (1).
''',[S('(a) roots',[-21,1]),S('(b) roots',[0,4]),S('(c) roots',[-3,1,4])])
add(8,8,r'''(a) Determine the exact value of $\cos103^\circ\cos58^\circ+\sin103^\circ\sin58^\circ$. (2 marks)

(b) Determine all possible values of $\tan\theta$ when $\sin\theta=2/3$. (3 marks)

(c) Determine the exact value of $\sin75^\circ$. (3 marks)''',r'''
(a)|2|Use $\cos(A-B)$ (1), giving $\cos45^\circ=\sqrt2/2$ (1).
(b)|3|Right-triangle adjacent magnitude $\sqrt{3^2-2^2}=\sqrt5$ (1). Quadrants I and II give $\pm2/\sqrt5$ (1 each).
(c)|3|Use $\sin(30^\circ+45^\circ)$ (1), substitute exact values (1), giving $(\sqrt6+\sqrt2)/4$ (1).
''',[N('(a) exact value','sqrt(2)/2'),S('(b) values',['-2/sqrt(5)','2/sqrt(5)']),N('(c) exact value','(sqrt(6)+sqrt(2))/4')])
add(9,5,r'''Shape AOBCDA joins sector BOC of a circle centred at O to sector DOA of another circle also centred at O. AB is a straight line of length 65 cm, arc AD is 12 cm, and $\angle AOD=0.32$ radians.

[FIGURE]

(a) Determine OA. (2 marks)

(b) Determine the area of the shape. (3 marks)''',r'''
(a)|2|$12=0.32R$ (1), so $OA=37.5$ cm (1).
(b)|3|Area DOA $=225$ cm² (1). Other radius $27.5$ and angle $\pi-0.32$ (1). Total $225+27.5^2(\pi-0.32)/2\approx1291.914722$ cm² (1).
''',[N('(a) OA, cm',37.5),N('(b) area, cm²',1291.9147221386,.5)])
add(10,8,r'''A particle's height in metres at time t seconds is $h(t)=68.75+15t-5t^2$, $0\le t\le5.5$.

(a) Determine h at (i) t=0, (ii) t=4.5. (1 mark each)

(b) Determine the maximum height and time reached. (2 marks)

(c) Determine the times at height 75 m. (2 marks)

(d) State the range on the given domain. (2 marks)''',r'''
(a)|2|$h(0)=68.75$, $h(4.5)=35$ (1 each).
(b)|2|Vertex time $t=1.5$ s (1), maximum height 80 m (1).
(c)|2|Solve $h(t)=75$ to get $t=0.5,2.5$ s (1 each).
(d)|2|Check endpoints and maximum: $0\le h\le80$ (1 per included bound).
''',[N('(a)(i) height, m',68.75),N('(a)(ii) height, m',35),N('(b) height, m',80),N('(b) time, s',1.5),S('(c) times, s',[.5,2.5]),C('(d) range bounds',[0,80])])
add(11,6,r'''$P(X)=0.2$, $P(Y)=0.5$, $P(Y\mid X)=0.1$.

Determine the probability (a) both occur (2 marks); (b) at least one occurs (2 marks); (c) neither occurs (1 mark); (d) X occurs given Y occurred (1 mark).''',r'''
(a)|2|Use conditional probability (1): $P(X\cap Y)=0.2(0.1)=0.02$ (1).
(b)|2|Union rule (1): $0.2+0.5-0.02=0.68$ (1).
(c)|1|$1-0.68=0.32$.
(d)|1|$0.02/0.5=0.04$.
''',[N('(a)',.02),N('(b)',.68),N('(c)',.32),N('(d)',.04)])
add(12,8,r'''A Ferris-wheel seat's height in metres at time t minutes is $h=21.5-18.5\cos(\pi t/6+\pi/3)$.

(a) Determine the initial height. (1 mark)

(b) Graph for $0\le t\le24$ minutes. (4 marks)

(c)(i) Determine the maximum height. (1 mark)

(c)(ii) Determine when it first reaches height 4 m, to the nearest second. (2 marks)''',r'''
(a)|1|$h(0)=12.25$ m.
(b)|4|Period 12 min, midline 21.5, amplitude 18.5. Maxima $(4,40),(16,40)$ (1), minima $(10,3),(22,3)$ (1), initial height and midline crossings (1), smooth curve over the domain (1).
(c)(i)|1|Maximum 40 m.
(c)(ii)|2|Solve $\cos(\pi t/6+\pi/3)=17.5/18.5$. First time $t\approx9.36918$ min (1), or 562 s = 9 min 22 s (1).
''',[N('(a) height, m',12.25),N('(c)(i) height, m',40),N('(c)(ii) time in seconds',562,0)])
add(13,6,r'''$f(x)=x^2+bx+c$ has turning point $(2,-7)$.

(a) State its symmetry axis. (1 mark)

(b) Determine b and c. (3 marks)

(c) Translate 3 units left and 2 units up; determine the new equation. (2 marks)''',r'''
(a)|1|$x=2$.
(b)|3|$f=(x-2)^2-7$ (1), so $b=-4,c=-3$ (1 each).
(c)|2|New vertex $(-1,-5)$ (1), new equation $y=(x+1)^2-5$ (1).
''',[N('(a) axis x=',2),N('(b) b',-4),N('(b) c',-3),X('(c) curve, y=','(x+1)^2-5')])
add(14,9,r'''A sample has 173 people. D means having a driver's licence, S means wearing spectacles. $n(D)=140,n(S)=53,n(S\cap\overline D)=10$.

(a) Determine (i) $n(\overline S)$ (ii) $n(D\cap S)$. (1 mark each)

(b) Find the probability (i) a person has no licence (2 marks), (ii) wears spectacles given having a licence (2 marks).

(c) Does the sample indicate possible independence of S and D? Justify. (3 marks)''',r'''
(a)|2|$173-53=120$ and $53-10=43$ (1 each).
(b)(i)|2|$33/173\approx0.190751$: numerator (1), denominator (1).
(b)(ii)|2|$43/140\approx0.307143$: numerator (1), conditioning denominator (1).
(c)|3|$P(S)=53/173\approx0.306358$ (1); compare to 0.307143 (1). The close sample proportions are consistent with possible independence, but do not prove population independence (1).
''',[N('(a)(i)',120),N('(a)(ii)',43),N('(b)(i)','33/173',.0005),N('(b)(ii)','43/140',.0005)])
add(15,8,r'''A cubic passes through $(0,4),(-2,0),(2,0),(0.5,0)$.

(a) Determine its expanded equation. (4 marks)

(b) Sketch it, showing all turning-point coordinates. (4 marks)''',r'''
(a)|4|Use $y=a(x+2)(x-2)(x-0.5)$ (1), substitute $(0,4)$ (1), find $a=2$ (1), expand to $y=2x^3-x^2-8x+4$ (1).
(b)|4|Roots -2,0.5,2 and y-intercept 4 (1); local maximum $(-1,9)$ (1), minimum $(4/3,-100/27)$ (1), smooth positive-leading cubic (1).
''',[X('(a) cubic, y=','2*x^3-x^2-8*x+4'),C('(b) maximum',[-1,9]),C('(b) minimum',['4/3','-100/27'],.005)])
add(16,7,r'''Bag A has 6 red and 4 blue counters; bag B has 3 red and 5 blue.

(a) Draw twice from A with replacement. Find the probability the second is blue. (1 mark)

(b) Draw twice from B without replacement. Find the probability the second is red. (3 marks)

(c) Draw from A, note its colour and transfer it to B. Draw from B. Find the probability both draws have the same colour. (3 marks)''',r'''
(a)|1|$4/10=2/5$.
(b)|3|Use a tree or total probability (1): $(3/8)(2/7)+(5/8)(3/7)$ (1) $=3/8$ (1).
(c)|3|Use RR and BB branches (1): $(6/10)(4/9)+(4/10)(6/9)$ (1) $=8/15$ (1).
''',[N('(a)','2/5',.0005),N('(b)','3/8',.0005),N('(c)','8/15',.0005)])
add(17,8,r'''The graph of $f(x)=\sqrt{x+a}+b$ is shown.

[FIGURE]

(a) Determine a and b. (2 marks)

(b) Draw $y=-2f(x)$. (3 marks)

(c) Draw $y=f(2x)$. (3 marks)''',r'''
(a)|2|Endpoint $(-9,-4)$ gives $a=9,b=-4$ (1 each).
(b)|3|Endpoint $(-9,8)$ (1), points $(0,2),(7,0)$ (1), smooth decreasing root curve (1).
(c)|3|Endpoint $(-4.5,-4)$ (1), points $(0,-1),(3.5,0)$ (1), smooth increasing root curve (1).
''',[N('(a) a',9),N('(a) b',-4)])
add(18,9,r'''Alf, Bess and Cleo attend a work social with probabilities $P(A)=0.7,P(B)=0.55,P(C)=0.85$, and $P(A\cap B)=0.45$.

(a) Find $P(A\cup B)$. (2 marks)

(b) Describe $(A\cap\overline B)\cup(\overline A\cap B)$ in context and find its probability. (3 marks)

(c) Are A and B mutually exclusive? Justify. (1 mark)

(d) Cleo's attendance is independent of everyone else's. Find the probability none attend. (3 marks)''',r'''
(a)|2|Union rule (1): $0.7+0.55-0.45=0.8$ (1).
(b)|3|Exactly one of Alf and Bess attends (1); separate probabilities 0.25 and 0.1 (1), total 0.35 (1).
(c)|1|No, since their intersection has probability 0.45, not zero.
(d)|3|Neither Alf nor Bess has probability 0.2 (1). Use independence of C (1) to get $0.2(0.15)=0.03$ (1).
''',[N('(a)',.8),N('(b)',.35),N('(d)',.03)])
add(19,8,r'''The graph of $y=a+b\sin(x-c)$ is shown; a,b,c are positive.

[FIGURE]

(a) Determine a,b,c, with $c<\pi$. (3 marks)

(b) On the same axes draw $y=a+(b/2)\sin(x+c)$. (3 marks)

(c) Solve $b\sin(x-c)=(b/2)\sin(x+c)$ for $-\pi\le x\le\pi$. (2 marks)''',r'''
(a)|3|$a=1.5,b=3,c=\pi/6$ (1 each).
(b)|3|Maxima at $x=-5\pi/3,\pi/3$, height 3 (1); minima at $x=-2\pi/3,4\pi/3$, height 0 (1); smooth sinusoid (1).
(c)|2|The equation simplifies to $\tan x=\sqrt3$; solutions $-2\pi/3,\pi/3$ (1 each).
''',[N('(a) a',1.5),N('(a) b',3),N('(a) c','pi/6'),S('(c) radians',['-2*pi/3','pi/3'])])
add(20,8,r'''(a) In triangle PQR, $\angle PQR=26^\circ$, $\angle PRQ=122^\circ$, PQ=57 cm. Determine its area. (4 marks)

(b) Triangle ABC has area 96 cm², $\angle ACB=30^\circ$ and $2BC=3AC$, as shown. Determine AB. (4 marks)

[FIGURE]''',r'''
(a)|4|Sketch a triangle with third angle $32^\circ$ (1). Sine rule gives $PR=57\sin26^\circ/\sin122^\circ$ (1), approximately 29.46 cm (1). Area $=57(PR)\sin32^\circ/2\approx445$ cm² (1).
(b)|4|Set $AC=2x,BC=3x$. Area equation gives $3x^2\sin30^\circ=96$ (1), hence $x=8$ (1). Apply the cosine rule (1), giving $AB=\sqrt{16^2+24^2-2(16)(24)\cos30^\circ}\approx12.92$ cm (1).
''',[N('(a) area, cm²',.5*57*(57*math.sin(math.radians(26))/math.sin(math.radians(122)))*math.sin(math.radians(32)),.5),N('(b) AB, cm',math.sqrt(16**2+24**2-2*16*24*math.cos(math.pi/6)),.005)])
add(21,8,r'''Choose a squad of 6 cyclists from 17 applicants: 3 Tasmanians, 6 from WA and the rest from Queensland.

(a) How many different squads? (2 marks)

(b) How many squads (i) include all Tasmanians (2 marks), (ii) have equal numbers from each state (2 marks), (iii) have at least 5 Queenslanders (2 marks)?''',r'''
(a)|2|$\binom{17}{6}=12376$: model (1), result (1).
(b)(i)|2|$\binom33\binom{14}{3}=364$: method (1), result (1).
(b)(ii)|2|$\binom32\binom62\binom82=1260$: method (1), result (1).
(b)(iii)|2|$\binom85\binom91+\binom86\binom90=532$: method (1), result (1).
''',[N('(a)',12376),N('(b)(i)',364),N('(b)(ii)',1260),N('(b)(iii)',532)])
