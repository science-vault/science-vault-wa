// Lower School Mathematics Years 7-10 question bank - root-level deployment-safe bank.
(function(){
const S='mathematics',Q=[];
const strands=['Number and algebra','Measurement and geometry','Probability and statistics'];
const add=(y,id,t,type,d,m,q,ans,e={})=>Q.push({id,subject:S,year:y,topic:t,type,difficulty:d,marks:m,question:q,answer:ans,...e});
const mc=(y,id,t,q,opts,c)=>add(y,id,t,'Multiple choice','Easy',1,`${q} A. ${opts[0]} B. ${opts[1]} C. ${opts[2]} D. ${opts[3]}`,`${'ABCD'[c]}. ${opts[c]} [1]`);
const sa=(y,id,t,q,ans,m=3,d='Medium')=>add(y,id,t,'Short answer',d,m,q,ans,{response:'working'});
const ex=(y,id,t,q,ans,m=6)=>add(y,id,t,'Extended response','Hard',m,q,ans,{responseLines:10});
for(const y of [7,8,9,10]){
 const N=strands[0],G=strands[1],P=strands[2];
 // 15 multiple choice per year
 for(let i=1;i<=5;i++) mc(y,`m${y}-r-nmc${i}`,N,`Evaluate ${y+i}+${i*3}.`,[String(y+i+i*3-2),String(y+i+i*3),String(y+i+i*3+2),String((y+i)*i)],1);
 for(let i=1;i<=5;i++){const l=4+i,w=2+i;mc(y,`m${y}-r-gmc${i}`,G,`What is the perimeter of a rectangle ${l} cm by ${w} cm?`,[`${l*w} cm`,`${2*(l+w)} cm`,`${l+w} cm`,`${2*l+w} cm`],1)}
 for(let i=1;i<=5;i++){const r=i+2,b=i+3;mc(y,`m${y}-r-pmc${i}`,P,`A bag has ${r} red and ${b} blue counters. What is P(red)?`,[`${b}/${r+b}`,`${r}/${r+b}`,`${r}/${b}`,`1/${r+b}`],1)}
 // 15 short answer per year
 for(let i=1;i<=5;i++){const a=y+i,b=2*i;sa(y,`m${y}-r-nsa${i}`,N,`Calculate ${a*5} - ${b*3}.`,`${a*5-b*3} [3].`)}
 for(let i=1;i<=5;i++){const b=6+i,h=3+i;sa(y,`m${y}-r-gsa${i}`,G,`Calculate the area of a triangle with base ${b} cm and perpendicular height ${h} cm.`,`A=1/2×${b}×${h}=${b*h/2} cm² [3].`)}
 for(let i=1;i<=5;i++){const vals=[i+2,i+4,i+6,i+8,i+10];const sum=vals.reduce((a,b)=>a+b,0);sa(y,`m${y}-r-psa${i}`,P,`Find the mean of ${vals.join(', ')}.`,`Mean=${sum}/5=${sum/5} [3].`)}
 // 6 extended/application-style responses per year
 ex(y,`m${y}-r-ext1`,N,`A shop reduces a $240 item by 15%. Calculate the discount and sale price. Show your method.`,`Discount=$36 [3]; sale price=$204 [3].`);
 ex(y,`m${y}-r-ext2`,N,`A service charges $18 plus $4 per unit. Write a rule for the total cost C for n units and calculate the cost for 12 units.`,`C=18+4n [3]; C=18+48=$66 [3].`);
 ex(y,`m${y}-r-ext3`,G,`A rectangular room is 8 m by 5 m. Calculate its area and perimeter, then explain the units used for each.`,`Area=40 m² [2]; perimeter=26 m [2]; square units for area and linear units for perimeter [2].`);
 ex(y,`m${y}-r-ext4`,G,`A scale drawing uses 1 cm to represent 2 m. A wall is 7.5 cm long on the drawing. Find the real length and explain your calculation.`,`7.5×2=15 m [4]; explanation [2].`);
 ex(y,`m${y}-r-ext5`,P,`A coin is tossed 80 times and gives 46 heads. Calculate the experimental probability of heads and compare it with the theoretical probability.`,`46/80=0.575 [3]; theoretical probability=0.5 [1]; comparison/variation explanation [2].`);
 ex(y,`m${y}-r-ext6`,P,`Design a fair survey for Year ${y} students. State a question, describe a representative sampling method and identify a suitable way to display the results.`,`Unbiased question [2]; representative/random or stratified sample [2]; suitable display [1]; justification [1].`);
}
window.AssessmentQuestionBank=(window.AssessmentQuestionBank||[]).concat(Q);
})();