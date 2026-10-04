// 2026 WA Mathematics Years 7-10 expansion. Adds 35 questions per strand per year (105/year, 420 total).
(function(){
const S='mathematics',Q=[]; const strands=['Number and algebra','Measurement and geometry','Probability and statistics'];
const add=(y,id,t,type,d,m,q,ans,e={})=>Q.push({id,subject:S,year:y,topic:t,type,difficulty:d,marks:m,question:q,answer:ans,...e});
const mc=(y,id,t,q,opts,correct)=>add(y,id,t,'Multiple choice','Easy',1,`${q} A. ${opts[0]} B. ${opts[1]} C. ${opts[2]} D. ${opts[3]}`,`${'ABCD'[correct]}. ${opts[correct]} [1]`);
const num=(y,id,t,d,q,ans,m=3)=>add(y,id,t,'Short answer',d,m,q,ans,{response:'working'});
const app=(y,id,t,d,q,ans,m=4)=>add(y,id,t,'Application',d,m,q,ans,{response:'working'});
const ext=(y,id,t,q,ans,m=6)=>add(y,id,t,'Extended response','Hard',m,q,ans,{responseLines:10});
// Each generator intentionally spans fluency, reasoning and modelling across the mandated strands.
for(const y of [7,8,9,10]){
 const N=strands[0],G=strands[1],P=strands[2]; let k=100;
 // NUMBER & ALGEBRA: 35 additional per year
 const nsets={
  7:[[18,-7,11],[24,-9,15],[35,-18,17],[42,-25,17],[56,-31,25]],
  8:[[27,-13,14],[45,-19,26],[64,-28,36],[72,-35,37],[91,-46,45]],
  9:[[125,-47,78],[144,-68,76],[203,-89,114],[315,-127,188],[420,-195,225]],
  10:[[225,-96,129],[360,-175,185],[512,-238,274],[750,-325,425],[960,-475,485]]
 }[y];
 nsets.forEach((v,i)=>num(y,`m${y}-x${k++}`,N,i<2?'Easy':'Medium',`Calculate ${v[0]} + (${v[1]}).`,`${v[2]} [3].`));
 const pcts=y===7?[[160,25],[250,12],[480,15],[72,50],[350,8]]:y===8?[[360,15],[850,12],[1250,18],[640,22.5],[920,35]]:y===9?[[2400,7.5],[1850,12],[3600,6.5],[4250,14],[980,17.5]]:[[5600,4.5],[12500,7.2],[8400,11.5],[22500,3.8],[1750,16]];
 pcts.forEach((v,i)=>app(y,`m${y}-x${k++}`,N,'Medium',`Calculate ${v[1]}% of ${v[0]}.`,`${v[0]}×${v[1]/100}=${+(v[0]*v[1]/100).toFixed(2)} [4].`));
 for(let i=0;i<5;i++){const a=i+2,b=(i+3)*2,c=a*(i+4)+b;app(y,`m${y}-x${k++}`,N,i<3?'Medium':'Hard',`Solve ${a}x + ${b} = ${c}.`,`Subtract ${b}, then divide by ${a}; x=${i+4} [4].`)}
 for(let i=0;i<5;i++){const a=i+2,b=i+1;num(y,`m${y}-x${k++}`,N,'Medium',`Simplify ${a}x + ${b}x - ${i+3}.`,`${a+b}x - ${i+3} [3].`)}
 const ratios=[[3,5,240],[4,7,360],[5,8,450],[2,9,180],[7,10,560]];
 ratios.forEach((v,i)=>app(y,`m${y}-x${k++}`,N,'Medium',`A quantity is divided in the ratio ${v[0]}:${v[1]}. If the first share is ${v[2]}, find the second share.`,`One part=${v[2]}/${v[0]}=${v[2]/v[0]}; second share=${v[1]}×${v[2]/v[0]}=${v[1]*v[2]/v[0]} [4].`));
 for(let i=0;i<5;i++){const rate=(y+i+2);app(y,`m${y}-x${k++}`,N,'Hard',`A service charges $${12+i*3} plus $${rate.toFixed(2)} per unit. Write a rule for cost C for n units and calculate the cost for ${10+i*5} units.`,`C=${12+i*3}+${rate}n [2]; substitute n=${10+i*5}; C=$${(12+i*3+rate*(10+i*5)).toFixed(2)} [2].`)}
 ext(y,`m${y}-x${k++}`,N,`Compare two pricing plans by forming algebraic rules, finding their break-even point and explaining which plan is cheaper on either side of that point.`,`Award for two correct rules [2], correct equality/equation [1], correct break-even solution [1], correct interpretation below/above break-even [2].`);
 ext(y,`m${y}-x${k++}`,N,`Create and solve a realistic percentage-change problem involving a price, population or account balance. Show the multiplier method and interpret the result.`,`Suitable model/context [1]; correct percentage multiplier [1]; correct calculation [2]; units [1]; interpretation [1].`);
 ext(y,`m${y}-x${k++}`,N,`A growing pattern has term values 5, 9, 13, 17, ... Determine a rule for the nth term, use it to find the 25th term and justify the rule.`,`Common difference 4 [1]; rule 4n+1 [2]; 25th=101 [2]; justification [1].`);
 ext(y,`m${y}-x${k++}`,N,`Explain two different methods that can be used to check whether an algebraic solution is correct. Demonstrate both on an equation of your choice.`,`Two valid checking methods [2], e.g. substitution/re-solving/inverse operations; correct demonstration [2]; reasoning [2].`);
 ext(y,`m${y}-x${k++}`,N,`Model a real-life situation with a linear rule. Define the variables, identify the rate and initial value, calculate one prediction and discuss one limitation of the model.`,`Variables [1]; valid rule [1]; rate/intercept interpretation [1]; correct prediction [1]; limitation [2].`);
 // MEASUREMENT & GEOMETRY: 35 additional per year
 k=200;
 for(let i=0;i<5;i++){const l=6+i,w=3+i;num(y,`m${y}-x${k++}`,G,'Easy',`Find the perimeter of a rectangle ${l} cm by ${w} cm.`,`P=2(${l}+${w})=${2*(l+w)} cm [3].`)}
 for(let i=0;i<5;i++){const b=8+2*i,h=5+i;num(y,`m${y}-x${k++}`,G,'Medium',`Find the area of a triangle with base ${b} cm and perpendicular height ${h} cm.`,`A=1/2×${b}×${h}=${b*h/2} cm² [3].`)}
 for(let i=0;i<5;i++){const l=4+i,w=3+i,h=2+i;app(y,`m${y}-x${k++}`,G,'Medium',`Calculate the volume of a rectangular prism ${l} cm by ${w} cm by ${h} cm.`,`V=${l}×${w}×${h}=${l*w*h} cm³ [4].`)}
 for(let i=0;i<5;i++){const a=45+i*8;num(y,`m${y}-x${k++}`,G,'Medium',`Two angles lie on a straight line. One is ${a}°. Find the other angle.`,`180-${a}=${180-a}° [3].`)}
 for(let i=0;i<5;i++){const scale=[100,200,500,1000,2500][i],cm=2+i;app(y,`m${y}-x${k++}`,G,'Medium',`A scale drawing uses 1:${scale}. A length measures ${cm} cm on the drawing. Find the actual length in metres.`,`${cm}×${scale}=${cm*scale} cm = ${cm*scale/100} m [4].`)}
 if(y>=8) for(let i=0;i<5;i++){const a=3+i,b=4+i;app(y,`m${y}-x${k++}`,G,'Hard',`A right triangle has perpendicular sides ${a} cm and ${b} cm. Find the hypotenuse to one decimal place.`,`c=√(${a}²+${b}²)=${Math.sqrt(a*a+b*b).toFixed(1)} cm [4].`)} else for(let i=0;i<5;i++){const n=4+i;app(y,`m${y}-x${k++}`,G,'Hard',`Find the sum of the interior angles of a ${n}-sided polygon.`,`(${n}-2)×180=${(n-2)*180}° [4].`)}
 ext(y,`m${y}-x${k++}`,G,`Design a floor plan to scale for a rectangular room and calculate both its floor area and perimeter. Explain the scale you use.`,`Appropriate scale [1]; consistent scaled dimensions [1]; correct area [1]; correct perimeter [1]; units [1]; explanation [1].`);
 ext(y,`m${y}-x${k++}`,G,`A storage container is a rectangular prism. Choose realistic dimensions, calculate its volume, convert the volume to litres and explain each conversion.`,`Dimensions [1]; volume [2]; correct unit conversion [1]; litres [1]; explanation [1].`);
 ext(y,`m${y}-x${k++}`,G,`Construct a geometry problem involving unknown angles and solve it using at least two angle facts. Name each angle fact used.`,`Valid construction [1]; two correct angle facts [2]; algebra/calculation [1]; correct angle [1]; explanation [1].`);
 ext(y,`m${y}-x${k++}`,G,`Compare two shapes that have the same perimeter but different areas. Give dimensions, calculate both areas and explain what the comparison demonstrates.`,`Valid equal-perimeter shapes [2]; both areas [2]; comparison [1]; conclusion [1].`);
 ext(y,`m${y}-x${k++}`,G,`Explain how measurement error can affect a calculated area or volume. Give a numerical example and state how sensible rounding should be reported.`,`Measurement uncertainty identified [1]; numerical example [2]; effect on derived measure [1]; sensible rounding [1]; explanation [1].`);
 // PROBABILITY & STATISTICS: 35 additional per year
 k=300;
 const bags=[[3,2],[4,6],[5,3],[7,3],[2,8]];
 bags.forEach((v,i)=>app(y,`m${y}-x${k++}`,P,'Medium',`A bag contains ${v[0]} red and ${v[1]} blue counters. Find the probability of selecting a red counter.`,`Total=${v[0]+v[1]} [1]; P(red)=${v[0]}/${v[0]+v[1]} [3].`));
 for(let i=0;i<5;i++){const heads=22+i*5,trials=50+i*10;app(y,`m${y}-x${k++}`,P,'Medium',`A coin experiment gives ${heads} heads in ${trials} tosses. Find the experimental probability of heads.`,`${heads}/${trials}=${(heads/trials).toFixed(3)} approximately [4].`)}
 const data=[[2,4,6,8,10],[3,5,5,7,10],[4,6,7,9,14],[10,12,13,15,20],[5,8,9,11,17]];
 data.forEach((v,i)=>app(y,`m${y}-x${k++}`,P,'Medium',`For the data ${v.join(', ')}, calculate the mean and range.`,`Mean=${(v.reduce((a,b)=>a+b,0)/v.length).toFixed(1)} [2]; range=${Math.max(...v)-Math.min(...v)} [2].`));
 for(let i=0;i<5;i++)add(y,`m${y}-x${k++}`,P,'Short answer','Medium',3,`A survey asks only students from one ${i%2?'sports team':'class'} about a whole-year issue. Explain one possible source of sampling bias.`,`The selected group may differ systematically from the whole year [1]; sample may not be representative [1]; random/stratified sampling across the cohort would improve it [1].`);
 for(let i=0;i<5;i++){const n=6+i;app(y,`m${y}-x${k++}`,P,'Hard',`A fair ${n}-sided spinner is spun twice. How many ordered outcomes are possible?`,`${n}×${n}=${n*n} ordered outcomes [4].`)}
 for(let i=0;i<5;i++)add(y,`m${y}-x${k++}`,P,'Application','Hard',4,`Two data sets have the same median but different spreads. Explain what this means and name a statistic that could be used to compare spread.`,`Same median means same central middle value [1]; distributions can still vary differently [1]; use range or IQR as appropriate [1]; larger spread statistic indicates greater variability [1].`);
 ext(y,`m${y}-x${k++}`,P,`Design a simulation for a chance experiment with at least two stages. Explain the representation, one trial, number of repetitions and how the estimated probability is calculated.`,`Valid representation [1]; correct multi-stage trial [1]; repeated trials [1]; success criterion [1]; relative frequency calculation [1]; more trials improve stability [1].`);
 ext(y,`m${y}-x${k++}`,P,`Design a fair survey for a Year ${y} cohort. State the question, sampling method, variable type and a suitable display for the results.`,`Clear unbiased question [1]; representative sampling [2]; variable type [1]; suitable display [1]; justification [1].`);
 ext(y,`m${y}-x${k++}`,P,`A social-media post uses a graph to claim one group is much better than another. Describe at least three features you would check before accepting the claim.`,`Any three well-explained checks such as scale/axis, sample size, sampling method, centre/spread, omitted data, source [2 marks each].`);
 ext(y,`m${y}-x${k++}`,P,`Compare theoretical probability with experimental probability. Give an example and explain why experimental results can differ, especially with small samples.`,`Definitions [2]; suitable example [1]; random variation [1]; small samples fluctuate more [1]; larger trials tend to stabilise [1].`);
 ext(y,`m${y}-x${k++}`,P,`Create two small numerical data sets with the same centre but different spread. Calculate appropriate summary statistics and explain the comparison.`,`Two valid sets [1]; same centre demonstrated [1]; spread statistics [2]; comparison [1]; interpretation [1].`);
}
window.AssessmentQuestionBank=(window.AssessmentQuestionBank||[]).concat(Q);
})();