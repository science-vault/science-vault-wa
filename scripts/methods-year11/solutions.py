import math
SOL={};AUTO={}
def N(label,value,tol=1e-9):return dict(label=label,kind='number',expected=str(value),tolerance=tol)
def X(label,value,var='x'):return dict(label=label,kind='expression',expected=value,variable=var,tolerance=1e-8)
def S(label,values,tol=1e-8):return dict(label=label,kind='set',expected=list(map(str,values)),tolerance=tol)
def C(label,values,tol=1e-8):return dict(label=label,kind='tuple',expected=list(map(str,values)),tolerance=tol)
def sol(key,rows):
 SOL[key]=[(a,int(b),c) for a,b,c in [line.split('|',2) for line in rows.strip().split('\n')]]
sol('willo22-u12-1',r'''
(a)|2|Expand to $3x^2-13x-10$ (1); differentiate to obtain $6x-13$ (1).
(b)|2|$f'(x)=7x^6+12x^3-7$ (1); $f'(-1)=-12$ (1).
(c)|2|$A'(t)=-7/3+4t/5-t^2/5$ (1); $A'(3)=-26/15$ cm²/s (1).
''')
sol('willo22-u12-2',r'''
(a)|2|$x^3+6x^2+12x+8$: first two terms (1), remaining terms (1).
(b)|2|$x^2+2x=x^2-2x+4$ (1), so $x=1$ with a nonzero denominator (1).
(c)|3|Complete the square: $x^2+(y+4)^2=16$ (1); centre $(0,-4)$ (1), radius 4 (1).
''')
sol('willo22-u12-3',r'''
(a)|3|$\cos^2(x/2)=3/4$ (1). On $0\le x/2\le\pi$, $x/2=\pi/6,5\pi/6$ (1). Thus $x=\pi/3,5\pi/3$ (1).
(b)(i)|2|Amplitude 2 (1), period $720^\circ$ or $4\pi$ radians (1).
(b)(ii)|3|Using degrees, plot $(0,3),(180,5),(360,3),(540,1),(720,3)$. Award midline crossings (1), extrema (1), smooth sinusoid over the full domain (1).
(b)(iii)|1|Range $1\le y\le5$.
''')
sol('willo22-u12-4',r'''
(a)|2|$9^{0.5-2}=9^{-3/2}$ (1) $=1/27$ (1).
(b)|2|$(8\times10^{-3})^2/(1.6\times10^{-2})$ (1) $=4\times10^{-3}$ (1).
(c)|3|The two sides are $10^{2x}$ (1) and $10^{-1/2}$ (1), so $x=-1/4$ (1).
''')
sol('willo22-u12-5',r'''
(a)|3|$h=3t^4-6t^2-t+C$ (1). Use $h(2)=30$ to get $C=8$ (1), then $h(1)=4$ (1).
(b)|4|From roots 0,10, write $h=kt(10-t)$ (1). The vertex $(5,125)$ gives $k=5$ (1). Velocity is $50-10t$ (1), so speed at 3.8 s is 12 m/s (1).
''')
sol('willo22-u12-6',r'''
(a)|4|$f=x^2/4-3x+8$ (1), $f'=x/2-3$ (1). At $x=0$, point $(0,8)$ and slope $-3$ (1). Tangent $y=-3x+8$ (1).
(b)|3|At $x=2$, slope is $-2$, so the perpendicular slope is $1/2$ (1). Solve $x/2-3=1/2$ to get $P=(7,-3/4)$ (1). Tangent $y=x/2-17/4$ (1).
''')
sol('willo22-u12-7',r'''
(a)|3|$f(-2)=-8+6+2=0$ (1). Divide to get $(x+2)(x^2-2x+1)$ (1), hence $(x+2)(x-1)^2$ (1).
(b)|3|$f'=3x^2-3=0$ (1). The stationary points are $(-1,4)$ and $(1,0)$ (1 each).
(c)|3|Cross at $(-2,0)$ and pass through $(0,2)$ (1); maximum $(-1,4)$ and minimum touching at $(1,0)$ (1); smooth positive-leading cubic with correct end behaviour (1).
''')
sol('willo22-u12-8',r'''
(a)|3|$a=180(0.8b+0.1)=45(3.8b+0.1)$ (1). Solve $b=0.5$ (1), $a=90$ (1).
(b)|2|The decreasing function has $T(4.8)=36$ and $T(0.3)=360$, so $36\le T\le360$ hours (1 per bound).
(c)|3|Plot endpoints $(0.3,360),(4.8,36)$ (1), supplied points $(0.8,180),(3.8,45)$ (1), and a smooth decreasing curve with labelled axes (1).
''')
sol('willo22-u12-9',r'''
(a)(i)|2|Use $\binom{32}{5}$ (1) $=201376$ (1).
(a)(ii)|2|There are $32-9-12=11$ impressionist prints (1); $\binom{11}{4}=330$ (1).
(b)(i)|3|Favourable choices $\binom{23}{3}$ (1), total choices $\binom{32}{3}$ (1), probability $1771/4960\approx0.357056$ (1).
(b)(ii)|1|Complement $1-1771/4960=3189/4960\approx0.642944$.
''')
sol('willo22-u12-10',r'''
(a)|3|$P=(-3,125/64),Q=(2,16/25)$ (1); draw their chord (1). Slope $=(16/25-125/64)/5=-2101/8000$ (1).
(b)(i)|2|$[0.8^{-2.5}-0.8^{-3}]/0.5$ (1) $\approx-0.412394$ (1).
(b)(ii)|1|$[0.8^{-2.9}-0.8^{-3}]/0.1\approx-0.431001$.
(c)|2|For $h=0.01,0.001,0.0001$, slopes are approximately $-0.435341,-0.435779,-0.435822$ (1). The limiting slope is $-0.436$ to 3 d.p. (1).
''')
sol('willo22-u12-11',r'''
(a)|2|Individual sport has probability 0.22 (1); $0.22(0.45)=0.099$ (1).
(b)|3|Team and further treatment: $0.78(0.65)=0.507$ (1); individual and further: $0.22(0.55)=0.121$ (1); sum 0.628 (1).
(c)|2|Use $P(I\cup N)=P(I)+P(T\cap N)$ (1), giving $0.22+0.273=0.493$ (1).
(d)|2|$P(T\mid N)=0.273/(0.273+0.099)$ (1) $=91/124\approx0.733871$ (1).
''')
sol('willo22-u12-12',r'''
(a)(i)|2|$u_{34}=15+33(4)$ (1) $=147$ seats (1).
(a)(ii)|3|The last 16 rows are 19–34, with $u_{19}=87$ (1). Sum $=16(87+147)/2$ (1) $=1872$ seats (1).
(b)|3|$r=63/18=7/2$ (1), first term $a=4$ (1); sum $4+14+49=67$ (1).
''')
sol('willo22-u12-13',r'''
(a)|2|$S_{16}=8(2a+15d)=432$ (1), hence $2a+15d=54$ (1).
(b)|3|$S_{76}=38(2a+75d)=684$, hence $2a+75d=18$ (1). Solve $d=-0.6,a=31.5$ (1). Then $S_{53}=842.7$ (1).
(c)|4|$S_n=-0.3n^2+31.8n$, so $p=-0.3,q=31.8$ (1 each). $dS/dn=-0.6n+31.8=0$ gives $n=53$ (1). The second derivative is $-0.6<0$ and 53 is an integer, establishing the maximum (1).
''')
sol('willo22-u12-14',r'''
(a)|2|$108^\circ=3\pi/5$ radians (1); arc length $=15(3\pi/5)=9\pi$ cm (1).
(b)|2|Area $=46^2[3\pi/10-\sin(3\pi/10)]/2$ (1) $\approx141.201528$ cm² (1).
(c)|5|Let the sides be $4k,5k,8k$. Cosine rule gives $\cos\theta=-23/40$ (1), hence $\sin\theta=\sqrt{1071}/40$ (1). Area gives $\sqrt{1071}k^2/4=190$ (1), so $k^2=760/\sqrt{1071}$ (1). Shortest side $=4\sqrt{760/\sqrt{1071}}\approx19.276111$ cm (1).
''')
sol('willo22-u12-15',r'''
(a)(i)|2|Translate the supplied graph 3 units right: intercept $(0,1)$ and point $(3,3)$ (1); increasing smooth exponential with horizontal asymptote $y=0$ and label (1).
(a)(ii)|2|Translate the supplied graph 3 units down: intercept $(0,0)$ and point $(-3,-2)$ (1); increasing smooth exponential with asymptote $y=-3$ and label (1).
(b)|3|The supplied point gives $a^3=3$, so $a^x=3a^x-3$ (1). Thus $a^x=3/2$ (1), and $x=3\ln(3/2)/\ln3\approx1.107211$ (1).
''')
sol('willo22-u12-16',r'''
(a)|2|Check the vertex $f(-1)=12$ and endpoints $f(-3)=4,f(2)=-6$. Global maximum 12 (1), minimum -6 (1).
(b)|2|Discriminant $6^2-4(-1)(-9)=0$ (1); one repeated real root at $x=3$ (1).
(c)|5|Symmetry gives $b=-2a$ (1); $c=-21$ (1). Substitute $(-2,11)$ to get $a=4,b=-8$ (1). Solve $4x^2-8x-21=0$ (1), giving $x=-3/2,7/2$ (1).
''')
sol('willo22-u12-17',r'''
(a)|2|Height $=156-4x$ (1); $V=x(3x)(156-4x)=468x^2-12x^3$ on $0<x<39$ (1).
(b)|3|$V'=936x-36x^2$ (1); stationary maximum at $x=26$, justified by sign or second derivative (1). Height $=52$ cm (1).
(c)|3|Surface area $=2[3x^2+4x(156-4x)]=1248x-26x^2$ (1). Differentiate to find maximum at $x=24$, with negative second derivative (1). Maximum surface area $=14976$ cm² (1). This optimises surface area independently of volume.
''')
sol('willo22-u12-18',r'''
(a)|1|Mutual exclusion gives $P(A\cap B)=0$, so $b=0.22$.
(b)|2|$P(A\cap B)=0.6b$, hence $0.4b=0.22$ (1), giving $b=0.55$ (1).
(c)|2|Union probability is $0.45+0.22=0.67$. Then $P(A\cap\overline B)=0.3(0.67)=0.201$ (1), so $b=(0.45-0.201)+0.22=0.469$ (1).
(d)|3|Independence gives $P(A\cap B)=0.45b$ (1), so $0.55b=0.22$ (1), giving $b=0.4$ (1).
''')
sol('willo22-u12-19',r'''
(a)|3|$A_{n+1}=1.04A_n$ establishes a geometric sequence (1). $A_{110}=8000(1.04)^{110}$ (1) $=\$598077.29$ (1).
(b)|1|The next deposit follows the year's interest: $B_1=8000(1.04)+8000=\$16320$.
(c)|3|The stated $B_0,B_1$ convention gives $B_n=8000[1+1.04+\cdots+1.04^n]$ (1), hence $B_n=8000(1.04^{n+1}-1)/0.04$ (1). $B_{110}=\$15350009.47$ (1), including the time-110 deposit under that convention.
''')
