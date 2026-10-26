# Native text and MathML source; figures are cropped separately from the supplied PDFs.
Q={}
def add(code,n,marks,body,pages,figs=[]):Q[code+'-'+str(n)]={'number':n,'marks':marks,'markdown':body,'pages':pages,'figs':figs}
add('waep23-u3',1,8,r'''The probability function for the random variable $X$ is
$$P(X=x)=\begin{cases}k^2-k+x,&x=0\\5k^2x,&x=1\\0,&\text{otherwise}.\end{cases}$$
(a) Determine the value of the constant $k$. (4 marks)

(b) Determine the mean and variance of $X$. (2 marks)

(c) The random variable $Y=3X+1$. Determine the mean and variance of $Y$. (2 marks)''',[4])
add('waep23-u3',2,7,r'''The curve $y=17-3x-x^2$ is shown, with a bounding rectangle and two inscribed rectangles of equal width. The shaded region is bounded by the curve, the $x$-axis, the $y$-axis and the line $x=2$.

[FIGURE]

(a) Use areas of rectangles to explain why the area of the shaded region must be between 20 and 34 square units. (4 marks)

(b) Determine the area of the shaded region. (3 marks)''',[5],[(5,(320,65,550,260))])
add('waep23-u3',3,7,r'''(a) Determine $f'(x)$ when $f(x)=\frac{4+\cos x}{4+\sin(3x)}$. There is no need to simplify the derivative. (2 marks)

(b) Let $y=\cos x$, so that when $x=150^\circ$, $y\approx-0.8660$. Given that $1^\circ\approx0.017$ radians, use the increments formula to determine an approximate value for $\cos(151^\circ)$. (5 marks)''',[6])
add('waep23-u3',4,9,r'''The function $f(x)$ is defined for $x>\frac53$, has derivative $f'(x)=\frac6{(3x-5)^2}$, and passes through the point $(3,1)$.

(a) Determine the rate of change of $f'(x)$ when $x=2$. (3 marks)

(b) Determine $f(x)$. (4 marks)

(c) Determine $\frac{d}{dt}\int_t^2(f'(x)-2x)\,dx$. (2 marks)''',[7])
add('waep23-u3',5,8,r'''The graph of $y=e^{4x}\sin(4x)$ is shown.

[FIGURE]

(a) Determine the $x$-coordinate of point $P$, the first local maximum of the curve as $x$ increases from 0. (4 marks)

(b) Determine the value of $\frac{d^2y}{dx^2}$ when $x=\frac{7\pi}2$ and hence describe the concavity of the curve at this point. (4 marks)''',[8],[(8,(320,65,550,265))])
add('waep23-u3',6,7,r'''A 7 cm length of thin straight wire is bent once and laid on a level surface to form side $KL$ and diagonal $LN$ of rectangle $KLMN$. Let the length of $KL=x$.

[FIGURE]

(a) Show that the area of the rectangle is $x\sqrt{49-14x}$ cm². (3 marks)

(b) Determine the maximum possible area of the rectangle. (4 marks)''',[9],[(9,(310,100,550,280))])
add('waep23-u3',7,6,r'''The graph of the linear function $y=f(x)$ is shown. Another function is defined as $A(t)=\int_2^t f(x)\,dx$.

[FIGURE]

(a) Using the graph of $y=f(x)$, or otherwise, evaluate $A(2)$ and $A(6)$. (2 marks)

(b) Sketch the graph of $y=A(t)$ on axes. (4 marks)''',[10],[(10,(280,65,550,270))])
add('waep23-u3',8,6,r'''A bag is filled with 26 tokens numbered with the integers $1,2,3,\ldots,25,26$, but otherwise identical. Let the random variable $X$ be the number on a token drawn at random from the bag.

(a) Explain why $X$ has a uniform distribution. (1 mark)

(b) Determine the expected value of $X$. (1 mark)

Let the random variable $Y$ take the value 0 when $X<20$ and the value 1 otherwise.

(c) State the particular name given to two-outcome random variables such as $Y$. (1 mark)

(d) Determine $P(Y=0)$. (1 mark)

(e) Three tokens are drawn at random from the bag with each being replaced before the next is taken. Determine the probability that exactly one of the tokens is marked with a number less than 20. (2 marks)''',[3])
add('waep23-u3',9,9,r'''A particle is moving in a straight line with acceleration $a=5e^{-0.2t}$ cm/s² after $t$ seconds. When $t=0$ it has a displacement of 2.5 m and a velocity of $-15$ cm/s.

(a) Determine the acceleration of the particle at the instant at which it comes to rest. (4 marks)

(b) Determine an expression for the displacement of the particle in terms of $t$. (2 marks)

(c) Determine the velocity of the particle when it again has a displacement of 2.5 m. (3 marks)''',[4])
add('waep23-u3',10,8,r'''The graph of $y=f(x)$ is shown below.

[FIGURE]

Evaluate each of the following.

(a) $\int_{-3}^4 f(x)\,dx$. (2 marks)

(b) $\int_{-2}^{-3}4f(x)\,dx$. (2 marks)

(c) $\int_{-1}^5(f(x)-3)\,dx$. (2 marks)

(d) $\int_1^6 f'(x)\,dx$. (2 marks)''',[5],[(5,(80,85,540,290))])
add('waep23-u3',11,10,r'''A random sample of 150 households within a large town revealed that 48 households owned a cat, 60 owned a dog and 27 owned both a cat and a dog. You may assume that point estimates of probabilities derived from this sample are reliable and representative of the whole town.

(a) For households within the town, determine the probability that

(i) a randomly selected household owns neither a cat nor a dog. (2 marks)

(ii) in a random sample of 5 households, exactly 3 will not own a dog. (2 marks)

(iii) in a random sample of 9 households that own a dog, at least 2 will own a cat. (3 marks)

(b) If another random sample of 276 households was drawn from within the town, determine the mean and standard deviation of the probability distribution that models the number of households that own either a cat or a dog in the sample. (3 marks)''',[6,7])
add('waep23-u3',12,11,r'''A vertical cross section through the highest point of an inselberg, a mountain range that rises above a surrounding level plain, is shown below.

[FIGURE]

The height of the plain and the inselberg above sea level $h$, in kilometres, is given by
$$h(x)=\begin{cases}\frac1{20}\left(6\cos\frac{7x}2-6x^2+33x-28\right),&a\le x\le b\\0.22,&\text{otherwise},\end{cases}$$
where $x$ is the horizontal displacement in kilometres from an arbitrary origin.

(a) Determine $a$ and $b$, the $x$ displacements where the inselberg meets the surrounding plain. (2 marks)

(b) Use calculus to determine the cross-sectional area of the inselberg shaded in the figure. (3 marks)

(c) Use calculus to (i) determine the maximum height of the inselberg above the surrounding plain (4 marks); (ii) verify that the stationary point representing its highest part is a maximum (2 marks).''',[8,9],[(8,(80,90,540,270))])
add('waep23-u3',13,5,r'''A hire company has a fleet of $n$ scooters in a city. On any given day, the probability that one of their scooters needs a repair is independent with a constant value of $p$. The daily number $X$ needing a repair has a mean of 31.68 and standard deviation 5.28.

(a) Determine $n$ and $p$. (3 marks)

(b) The daily repair cost $C$, in dollars, consists of a fixed $750 plus an average of $27.50 per scooter repaired. Determine the mean and standard deviation of the daily repair cost. (2 marks)''',[10])
add('waep23-u3',14,8,r'''66 mg of a radioisotope with a half-life of 99 hours was injected into a patient before a CT scan. The mass remaining after $t$ hours is $M=M_0e^{-kt}$.

(a) Determine $M_0$ and $k$. (3 marks)

(b) Determine the mass remaining exactly 10 days after the injection. (1 mark)

(c) Eventually the remaining mass falls to 5.5 mg. (i) Determine how long after the injection this occurs. (2 marks) (ii) Determine the rate at which the radioisotope is changing at this time. (2 marks)''',[11])
add('waep23-u3',15,10,r'''(a) Use the quotient rule to show that $\frac{d}{dx}\left(\frac{10x+50}{e^{0.2x}}\right)=\frac{-2x}{e^{0.2x}}$. (3 marks)

(b) Use your result to show that $\int\frac{2x}{e^{0.2x}}\,dx=\frac{-10x}{e^{0.2x}}-\frac{50}{e^{0.2x}}+c$, where $c$ is a constant. (3 marks)

(c) The height $h$ of a plant, initially 35 cm, is changing at a rate $\frac{dh}{dt}=\frac{2t}{e^{0.2t}}$ cm/day, $t\ge0$.

(i) Determine an equation to model the height as a function of time and hence determine its height after 10 days. (3 marks)

(ii) According to the model, what height will the plant never exceed? (1 mark)''',[12,13])
add('waep23-u3',16,9,r'''Consider $f(x)=e^{0.05x}$ and $g(x)=mx$ for $x\ge0$. The positive constant $m$ is such that the graphs always intersect. Let $R$ be the region enclosed by the $y$-axis and the graphs of $f$ and $g$.

(a) Let $m=0.2$. (i) Sketch both graphs for $0\le x\le30$, showing the coordinates of their intersection on the boundary of $R$. (3 marks) (ii) Determine the area of $R$. (2 marks)

(b) Determine the maximum area of $R$. (4 marks)''',[14,15])
add('waep23-u3',17,9,r'''Spinners A and B have equally likely outcomes of 2, 3, 4, 5, 6 for A and 2, 3, 4, 5 for B. A player pays $2 for one play and wins $5 if the outcomes are the same, $2 if they differ by one, and nothing otherwise. Let $X$ be the player's profit (winnings minus payment), in dollars, in one play.

(a) Explain why $X$ is a random variable and list its possible values. (2 marks)

(b) Determine $E(X)$. (4 marks)

(c) Calculate $\operatorname{Var}(X)$. (2 marks)

(d) Determine the cost per play so that in the long run a player will break even. (1 mark)''',[16])
add('waep23-u3',18,6,r'''The graph of $y=a^x$ is shown, where $a>0$. A secant joins points $P$ and $Q$ on the curve at $x$ and $x+h$.

[FIGURE]

(a) Describe the property of the secant represented by $\frac{a^{x+h}-a^x}{h}$. (1 mark)

(b) Describe the property of the curve represented by $\lim_{h\to0}\frac{a^{x+h}-a^x}{h}$. (1 mark)

It can be shown that this limit equals $a^x\lim_{h\to0}\frac{a^h-1}{h}$.

(c) When $a=4$, complete a table of $(a^h-1)/h$ for $h=0.01,0.001,0.0001,0.00001$, rounding to 4 decimal places. Explain how these values approximate the derivative of $4^x$. (3 marks)

(d) For what value of $a$ is $\lim_{h\to0}(a^h-1)/h=1$? (1 mark)''',[17],[(17,(100,85,530,290))])
add('waep23-u3',19,7,r'''The values of polynomials $f,g,h$ and their derivatives are shown below.

| $x$ | $f(x)$ | $g(x)$ | $h(x)$ | $f'(x)$ | $g'(x)$ | $h'(x)$ |
|---|---|---|---|---|---|---|
|1|9|−2|3|−3|−2|4|
|2|8|−3|8|0|0|6|
|3|7|−2|15|−3|2|8|

(a) Given $g''(2)=2$, describe the graph of $y=g(x)$ near $x=2$. Justify your answer. (2 marks)

(b) Evaluate the derivative of $g(x)h(x)$ at $x=3$. (2 marks)

(c) Evaluate the derivative of $g(h(x))/f(x)$ at $x=1$. (3 marks)''',[18])
# 2022 Unit 3
add('waep22-u3',1,7,r'''Let $f(x)=15-4x-6x^2-4x^3-x^4$.

(a) The curve $y=f(x)$ cuts the horizontal axis at $x=1$. State, with reasons, whether the function is increasing, decreasing or neither at this point. (2 marks)

(b) Determine $f''(0)$ and use this value to describe the concavity of the curve where it crosses the vertical axis. (2 marks)

(c) Does the curve have any points of inflection? If it does, determine their coordinates. If not, justify your answer. (3 marks)''',[4])
add('waep22-u3',2,6,r'''(a) Determine $f'(-2)$ when $f(x)=2(3x+5)^3$. (3 marks)

(b) Determine $g(2)$ when $g'(x)=12e^{3x-3}$ and $g(1)=7$. (3 marks)''',[5])
add('waep22-u3',3,8,r'''The function $f$ is defined for $x>0$ by $f(x)=\frac{e^{4x-1}}{x}$, and $f''(x)=\frac{2(8x^2-4x+1)e^{4x-1}}{x^3}$.

(a) Determine the coordinates and nature of all stationary points of $y=f(x)$. Justify your answer. (6 marks)

(b) Show that the graph has no points of inflection. (2 marks)''',[6])
add('waep22-u3',4,8,r'''The graph of $y=\sqrt{2x-3}$ between $x=2$ and $x=3.5$ is shown. Approximate values for $\sqrt2$ and $\sqrt3$ are 1.41 and 1.73 respectively.

[FIGURE]

(a) Use the areas of the rectangles shown to explain why $2.07<\int_2^{3.5}\sqrt{2x-3}\,dx<2.57$. (3 marks)

(b) Evaluate $\int_2^{3.5}\sqrt{2x-3}\,dx$. (3 marks)

(c) Evaluate $\int_2^{3.5}(1-\sqrt{2x-3})\,dx$. (2 marks)''',[7],[(7,(300,65,550,280))])
add('waep22-u3',5,8,r'''When a seed is randomly selected from a packet and grown, the probability that it yields a white flower is $0.35=\frac7{20}$.

(a) Explain why this context is suitable for modelling with a Bernoulli random variable and state the mean of the Bernoulli distribution. (2 marks)

(b) When several Bernoulli trials are repeated, the total number of successes can be modelled with a binomial random variable provided the trials meet two conditions. Briefly describe these conditions. (2 marks)

(c) Nine seeds are randomly selected and grown. Write an expression for the probability that seven or eight will yield a white flower. (2 marks)

(d) A gardener wants to be at least 99% certain of obtaining one or more white flowers. The number $n$ of seeds must solve $b^n\le a$. State, with justification, $a$ and $b$. (2 marks)''',[8,9])
add('waep22-u3',6,8,r'''Let $f(x)=e^{-2x}(\sin 2x-\cos 2x)$.

(a) Determine $f'(x)$, simplifying your answer. (3 marks)

(b) Use differentiation and your previous answer to show that $\int e^{-2x}\cos 2x\,dx=\frac14e^{-2x}(\sin 2x-\cos 2x)+c$, where $c$ is a constant. (2 marks)

(c) The graph of $y=e^{-2x}\cos 2x$ is shown below. Determine the area of region $R$, bounded by the curve, the $x$-axis and the $y$-axis. (3 marks)

[FIGURE]''',[10,11],[(11,(85,100,540,340))])
add('waep22-u3',7,7,r'''The vertices of rectangle $PQRS$ lie on sector $OAB$ of a circle of radius 6 cm, subtending angle $\theta$, where $\tan\theta=4$. Let $OP=x$ cm and $PS=y$ cm.

[FIGURE]

(a) Show that the perimeter of the rectangle is $p=6x+4\sqrt{9-4x^2}$ cm. (3 marks)

(b) Determine its maximum perimeter. (4 marks)''',[12,13],[(12,(80,85,540,270))])
add('waep22-u3',8,8,r'''A small body moving in a straight line has an initial velocity of 15 cm/s as it leaves point $P$. Its acceleration at time $t$ seconds is $6-1.5t$ cm/s², $t\ge0$.

(a) Determine its displacement relative to $P$ after 2 seconds. (4 marks)

(b) Determine its maximum velocity. (2 marks)

(c) Determine its maximum displacement relative to $P$. (2 marks)''',[4])
add('waep22-u3',9,7,r'''Let $f(x)=(4-x)e^{0.25x}$. The graph is shown.

[FIGURE]

Use calculus to determine the coordinates of the stationary point and the point of inflection, and to justify that the stationary point is a local maximum. (7 marks)''',[5],[(5,(310,65,550,300))])
add('waep22-u3',10,8,r'''A canning machine produces underweight cans with constant probability $p$. Random samples of $n$ cans are taken and the number $X$ of underweight cans recorded. The mean and standard deviation of $X$ are 2.16 and 1.44 respectively.

(a) $X$ is a discrete random variable. Explain why it is discrete and random. (2 marks)

(b) Name its distribution and determine $n$ and $p$. (3 marks)

(c) Another machine produces an underweight can with probability 0.015. For a random sample of 30 cans, determine the probability that (i) exactly one is underweight (2 marks); (ii) more than one is underweight (1 mark).''',[6])
add('waep22-u3',11,8,r'''The graphs of continuous functions $y=f(x)$ and $y=g(x)$ are shown.

[FIGURE]

(a) Evaluate the derivative of $f(x)g(x)$ at $x=-2$. (2 marks)

(b) Evaluate the derivative of $f(g(x))$ at $x=5$. (3 marks)

(c) Evaluate the derivative of $g'(x)/f(x)$ at $x=0$. (3 marks)''',[7],[(7,(260,65,550,320))])
add('waep22-u3',12,8,r'''A bag contains four black and four red balls. Two balls are drawn at random in succession. At the first draw, if the ball is black it is replaced; otherwise it is not replaced. Let $X$ be the number of black balls drawn.

(a) Determine $P(X=2)$. (1 mark)

(b) Complete the probability distribution table for $X=0,1,2$, using exact values. (3 marks)

(c) Determine the mean and variance of $X$. (4 marks)''',[8])
add('waep22-u3',13,8,r'''A discrete random variable $X$ has the following distribution, where $k$ is constant.

| $x$ | $-1$ | $1$ | $2$ | $4$ |
|---|---|---|---|---|
| $P(X=x)$ | $3k$ | $0.2$ | $0.4$ | $10k^2$ |

(a) Determine $k$. (3 marks)

(b) Determine $E(X)$. (2 marks)

(c) Given $\operatorname{Var}(X)=4.41$, determine (i) $E(Y)$ when $Y=3-2X$ (1 mark); (ii) $\operatorname{Var}(Y)$ when $Y=X/2-4$ (1 mark); (iii) the standard deviation of $Y$ when $Y=9X+8$ (1 mark).''',[9])
add('waep22-u3',14,9,r'''A full water tank takes 38 seconds to empty. Its volume $V$ litres at time $t$ seconds is changing at a rate $\frac{dV}{dt}=\sqrt[3]{9t+1}-7$, $0\le t\le38$.

(a) Determine the initial rate of change of volume. (1 mark)

(b) Use the increments formula to estimate the volume emptied during the first one-third of a second. (2 marks)

(c) Determine the initial volume. (3 marks)

(d) Determine the time, to the nearest 0.01 second, when it is half full. (3 marks)''',[10,11])
add('waep22-u3',15,8,r'''The concentration of a drug in a monkey's plasma, $C$ micrograms per litre, $t$ hours after administration, is modelled by $C=C_0e^{kt}$. Each dose increases the existing concentration by 310 μg/L. The concentration halves every 3 hours and 40 minutes. A monkey with no existing trace is given its first dose at 8:45 am.

(a) Use the model to determine the rate of change of concentration later that day at 12:25 pm. (4 marks)

(b) An additional dose is given whenever concentration falls to 110 μg/L. Determine the expected time of day, to the nearest minute, of the third dose. (4 marks)''',[12])
add('waep22-u3',16,7,r'''(a) Consider $f(x)=mx$, where $m$ is constant. The graph is shown, $k$ is constant and $\int_0^k f(x)\,dx=4$.

(i) Determine $\int_{-k}^k f(x)\,dx$. (1 mark)

(ii) Determine $\int_{-k}^0 2f(x+k)\,dx$. (2 marks)

(b) The polynomial $g$ has $\int_{-2}^5g(x)\,dx=10$. Determine $\int_{-2}^2(2-g(x))\,dx+\int_2^5(2x-g(x))\,dx$. (4 marks)''',[13])
add('waep22-u3',17,10,r'''The performance of a machine learning model recognising a pathogen is stable. Results from its last 250 runs are shown below.

| Image contains pathogen | Model says yes | Model says no |
|---|---|---|
| Yes | 154 | 21 |
| No | 6 | 69 |

(a) Determine the probability the model recognises a pathogen in an image that contains one. (1 mark)

(b) For 9 randomly selected images, determine the probability it returns exactly one incorrect result. (3 marks)

(c) For 30 randomly selected images, determine the probability it returns at least 26 correct results. (3 marks)

(d) For repeated batches of 50 randomly selected images that do not contain a pathogen, determine the mean and standard deviation of the number of correct results. (3 marks)''',[14,15])
add('waep22-u3',18,10,r'''A small body has velocity $v(t)=11+4\sin(\pi t/10)-6\sin(\pi t/5)$ cm/s, $t\ge0$.

(a) Using a graph on your calculator or otherwise, state its minimum velocity to the nearest 0.01 cm/s. Hence explain why the distance travelled in any time interval always equals its change in displacement. (2 marks)

(b) Determine the distance travelled between $t=0$ and $t=20$. (2 marks)

(c) The distance in a 10 second interval from $t=\theta$ to $t=\theta+10$ is $x(\theta)=a+b\cos(\pi\theta/10)$. Determine $a$ and $b$. (2 marks)

(d) During the first 35 seconds, there is a 10 second interval in which distance travelled is a minimum. Use calculus to determine when this interval occurs and justify the minimum. (4 marks)''',[16,17])
add('waep22-u3',19,7,r'''The line $y=c$ divides the area in the first quadrant under $y=64-x^2$ into two equal halves, as shown.

[FIGURE]

Determine $c$ with reasoning. (7 marks)''',[18],[(18,(260,65,550,320))])
# Corrections verified from the source render.
Q['waep23-u3-6']['markdown']=Q['waep23-u3-6']['markdown'].replace('[FIGURE]','');Q['waep23-u3-6']['figs']=[]
Q['waep23-u3-15']['markdown']=Q['waep23-u3-15']['markdown'].replace(r'\frac{10x+50}{e^{0.2x}}',r'\frac{10x+5}{e^{0.2x}}').replace(r'=\frac{-2x}{e^{0.2x}}',r'=\frac9{e^{0.2x}}-\frac{2x}{e^{0.2x}}')
# The scanned 2021 paper. Whole questions 5, 13 and 16 duplicate Word questions;
# retain one canonical record and record these source aliases in the import report.
add('waep21-u3',1,6,r'''(a) Determine $\frac{d}{dx}(\cos^6x)$. (2 marks)

(b) Evaluate $f'(\pi)$ when $f(x)=\frac{x+\sin2x}{\cos x}$. (4 marks)''',[1])
add('waep21-u3',2,5,r'''A small body is initially at the origin. It moves along the $x$-axis with velocity $v(t)=(t/2-2)^3$ cm/s at time $t$ seconds.

(a) Determine $x(t)$, its displacement at time $t$. (3 marks)

The body is stationary when $t=T$.

(b) Determine its displacement at $T+3$ seconds. (2 marks)''',[2])
add('waep21-u3',3,8,r'''(a) State two key characteristics of a chance experiment that make it suitable for modelling by a binomial random variable. (2 marks)

Research has shown that 10% of dogs between the ages of 5 and 8 have some form of heart disease. A random sample of 70 dogs is selected from a large number of dogs of this age. Let $X$ be the number in the sample with some form of heart disease.

(b) Explain why randomly selecting one dog and recording whether it has some form of heart disease is a Bernoulli trial. (2 marks)

(c) Write a numerical expression for the probability that 8 dogs in the sample have some form of heart disease. (2 marks)

(d) State the mean and variance of $X$. (2 marks)''',[3])
add('waep21-u3',4,6,r'''Determine the area of the finite region bounded by $y=\sqrt{3x}$ and $y=x/2$. (6 marks)''',[4])
add('waep21-u3',7,8,r'''The function $f$ is defined by $f(x)=\frac6{x^2+9}$, so that $f''(x)=\frac{36(x^2-3)}{(x^2+9)^3}$.

(a) Describe the concavity of $y=f(x)$. (4 marks)

(b) Determine, with justification, the range of $f'(x)$. (4 marks)''',[7])
add('waep21-u3',6,7,r'''A four-sided die has faces marked 1, 1, 2 and 3, all equally likely to land face down. A game costs $2 and involves throwing the die twice and adding the two numbers that land face down. If the total score is 6, the player wins $30; otherwise they win nothing. Let $X$ be the total score in one play.

(a) Construct a probability distribution table for $X$. (3 marks)

(b) Determine $E(X)$. (1 mark)

Let $Y$ be the net monetary loss, in dollars, of a player in two plays.

(c) Determine $E(Y)$. (3 marks)''',[6])
add('waep21-u3',8,7,r'''The random variable $T$ has the following distribution.

| $t$ | $0$ | $1$ |
|---|---|---|
| $P(T=t)$ | $\frac{11}{10}-\frac2{5k}$ | $\frac k4+\frac15$ |

(a) Determine the positive constant $k$ and hence state $P(T=1)$. (4 marks)

(b) The random variable $W=5T-4$. Determine $E(W)$ and $\operatorname{Var}(W)$. (3 marks)''',[8])
add('waep21-u3',9,8,r'''The graph of $g$ and a table of values of $f$ and its derivatives are shown below.

[FIGURE]

(a) Evaluate $h'(k)$ when (i) $h(x)=f(g(x))$ and $k=2$ (3 marks); (ii) $h(x)=g(x)/f(x)$ and $k=3$ (3 marks).

(b) Evaluate $h''(1)$ when $h'(x)=f'(x)g'(x)$. (2 marks)''',[9],[(9,(45,95,395,190))])
add('waep21-u3',10,8,r'''Let $f(x)=2x^4+ax^2+1$.

(a) Sketch $y=f(x)$ when $a=-16$, labelling all stationary points and intercepts. (4 marks)

(b) Show that $y=f(x)$ always has a maximum turning point at $x=0$ if $a<0$. (4 marks)''',[10])
add('waep21-u3',11,7,r'''List A contains the digits in the first 100 decimal places of $\pi$. Their relative frequencies are shown below.

|Digit|0|1|2|3|4|5|6|7|8|9|
|---|---|---|---|---|---|---|---|---|---|---|
|Frequency|0.08|0.08|0.12|0.11|0.10|0.08|0.09|0.08|0.12|0.14|

(a) Determine the probability that a randomly selected digit (i) is odd (1 mark); (ii) is a factor of 12, given that it is not odd (2 marks).

(b) The discrete random variable $X$ is defined by $P(X=x)=1/7$ for $x=0,1,2,3,4,5,6$, and 0 otherwise. (i) State the name of this distribution. (1 mark) (ii) Calculate its expected value and variance. (3 marks)''',[11])
add('waep21-u3',12,7,r'''A hot potato removed from an oven is placed on a cooling rack. Its temperature $T$ °C after $t$ minutes is modelled by $T=17+195e^{kt}$. Its temperature halves between $t=0$ and $t=7.4$.

(a) Determine $k$. (3 marks)

(b) Determine the time until its temperature first falls to within 3 °C of its steady-state temperature. (2 marks)

(c) Determine the time at which it is cooling at 3 °C per minute. (2 marks)''',[12])
add('waep21-u3',14,8,r'''The area $A$ of a regular polygon with $n$ sides of length $x$ is $A=\frac{nx^2\cos(\pi/n)}{4\sin(\pi/n)}$.

(a) Simplify the formula when $n=6$ to obtain the area of a regular hexagon. (2 marks)

(b) Use increments to estimate the change in area of a regular hexagon when its side length increases from 10 cm to 10.5 cm. (3 marks)

(c) Use increments to estimate the change in area of a regular polygon with side length 10 cm when its number of sides increases from 29 to 31. (3 marks)''',[14])
add('waep21-u3',15,8,r'''(a) 17% of a large number of smoke alarms in a building complex are faulty. An electrician randomly selects 8 alarms. Determine (i) the probability none is faulty (2 marks); (ii) the probability more than three are faulty, given that at least one is faulty (2 marks); (iii) the standard deviation of the number faulty (1 mark).

(b) In a newer complex only 7% of alarms are faulty. Determine, with reasoning, the minimum number to inspect so that the probability at least one is faulty exceeds 99%. (3 marks)''',[15])
add('waep21-u3',17,7,r'''Regions $A,B,C,D$ are bounded by $y=f(x)$ and the $x$-axis as shown. Their areas are 7, 25, 19 and 17 square units respectively.

[FIGURE]

(a) Determine (i) $\int_{-2}^1 f(x)dx$ (1 mark); (ii) $\int_1^6 7f(x)dx$ (2 marks); (iii) $\int_{-2}^3(3-f(x))dx$ (2 marks).

(b) Explain why $\int_{-1}^3f'(x)dx=0$. (2 marks)''',[17],[(17,(35,72,390,170))])
add('waep21-u3',18,8,r'''An offshore wind turbine $T$ lies 9 km from the nearest point $A$ on a straight coast. A power storage facility $P$ lies on the coast 40 km from $A$. Cable is laid in two straight sections, from $T$ to $Q$, where $Q$ is on the coast $x$ km from $A$, and then from $Q$ to $P$. Coastal cable costs $4000 per km and offshore cable $5000 per km.

(a) Determine to the nearest hundred dollars the cost when $Q$ is midway from $A$ to $P$. (2 marks)

(b) Show that the cost in thousands of dollars is $C=5\sqrt{x^2+81}-4x+160$. (2 marks)

(c) Use calculus, with justification, to determine the minimum cost. (4 marks)''',[18])
add('waep21-u3',19,8,r'''An electronic device randomly generates one of the first four triangle numbers, with distribution:

|$x$|1|3|6|10|
|---|---|---|---|---|
|$P(X=x)$|$a$|$b$|0.2|0.3|

The mean is 5.6.

(a) Determine $a$ and $b$. (3 marks)

(b) The device runs 3 times. Determine the probability that (i) 6 is generated exactly twice (2 marks); (ii) the sum of the generated numbers is at least 23 (3 marks).''',[19])
add('waep21-u3',20,5,r'''(a) Determine $a,b$ that make each statement true for a polynomial $f$.

(i) $\int_{-4}^{-2}f(x)dx+\int_{-2}^a f(x)dx=\int_b^1 f(x)dx$. (1 mark)

(ii) $\int_{-2}^2 f(x)dx+\int_2^4 f(x)dx-\int_a^b f(x)dx=\int_0^4 f(x)dx$. (2 marks)

(b) Show that $\frac{d}{dx}\int_{g(x)}^{h(x)}f(t)dt=f(h(x))h'(x)-f(g(x))g'(x)$. (2 marks)''',[20])
add('waep21-u3',21,8,r'''A small body $P$ has acceleration $a=At+B$ cm/s² at time $t$ s. Initially it is displaced 8 cm relative to a fixed point $O$, moving at 4 cm/s. Three seconds later it has displacement 3.8 cm and velocity $-5.9$ cm/s.

(a) Determine $A,B$. (6 marks)

(b) Determine its minimum velocity. (2 marks)''',[21])

# Original embedded figure bounds exclude duplicate question text.
FIGURE_BOUNDS={'waep23-u3-2': [(5, (353.5, 91.754, 506.25, 182.44))], 'waep23-u3-5': [(8, (309.0, 80.701, 466.6, 156.1))], 'waep23-u3-7': [(10, (283.5, 81.0, 463.16, 182.45))], 'waep23-u3-10': [(5, (165.15, 106.54, 438.65, 248.04))], 'waep23-u3-12': [(8, (146.52, 118.95, 457.27, 244.7))], 'waep23-u3-18': [(17, (176.27, 106.54, 427.52, 220.04))], 'waep22-u3-4': [(7, (263.2, 83.55, 534.1, 219.0))], 'waep22-u3-6': [(11, (140.52, 101.04, 463.27, 209.54))], 'waep22-u3-7': [(12, (218.52, 144.74, 385.27, 320.74))], 'waep22-u3-9': [(5, (321.0, 81.0, 530.73, 189.55))], 'waep22-u3-11': [(7, (320.05, 84.7, 507.37, 256.15))], 'waep22-u3-19': [(18, (361.2, 85.55, 521.35, 213.1))]}
for k,v in FIGURE_BOUNDS.items():Q[k]["figs"]=v

Q['waep21-u3-9']['figs']=[(9,(50,158,355,248))]
