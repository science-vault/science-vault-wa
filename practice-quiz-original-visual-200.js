/* 200 original illustrated MCQs; generated diagrams are not claimed as past assessment images. */
(function(){
'use strict';
const qs=[];
const svg=(body)=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 250" width="620" height="250"><rect width="620" height="250" fill="white"/><g font-family="Arial,sans-serif" font-size="19" fill="#14243b">'+body+'</g></svg>');
const txt=(x,y,t)=>'<text x="'+x+'" y="'+y+'">'+String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</text>';
const line=(x,y,a,b)=>'<line x1="'+x+'" y1="'+y+'" x2="'+a+'" y2="'+b+'" stroke="#263a55" stroke-width="3"/>';
function add(f,i,stem,opts,correct,topic,year,img){qs.push({id:'SV-ORIGINAL-VISUAL-20261018-'+f+'-'+String(i+1).padStart(3,'0'),course:'Science',subject:'science',year,unit:topic,topic,type:'Multiple Choice',difficulty:i%3===0?'Easy':i%3===1?'Medium':'Hard',marks:1,stem,questionText:stem,mcOptions:opts.map(String),correctLetter:'ABCD'[correct],practiceImages:[img],source:'Science Vault WA original diagram question',addedAt:'2026-10-18'})}
for(let i=0;i<50;i++){
 const val=6+(i%25),step=1+(Math.floor(i/25)),x=val*step;
 const options=[x,x+step,x+2*step,x+3*step],rotate=i%4,arr=options.map((_,j)=>options[(j+rotate)%4]),correct=arr.indexOf(x);
 const img=svg(txt(25,35,'Distance travelled over time')+line(85,195,560,195)+line(85,195,85,45)+txt(10,65,'Distance (m)')+txt(430,233,'Time (s)')+line(85,195,450,75)+'<circle cx="450" cy="75" r="7" fill="#2c72c7"/>'+txt(460,76,'('+val+' s, '+x+' m)')+txt(78,215,'0'));
 add('GRAPH',i,'According to the labelled point on the distance–time graph, what distance has been travelled after '+val+' seconds?',arr,correct,'Scientific Graphs',8,img);
}
for(let i=0;i<50;i++){
 const r1=2+(i%9),r2=3+(Math.floor(i/9)%6),sum=r1+r2,options=[sum,sum+1,sum+2,Math.max(1,sum-1)],rotate=i%4,arr=options.map((_,j)=>options[(j+rotate)%4]),correct=arr.indexOf(sum);
 const img=svg(txt(30,35,'Two resistors connected in series')+line(80,85,195,85)+line(275,85,350,85)+line(435,85,530,85)+line(530,85,530,190)+line(530,190,80,190)+line(80,190,80,85)+'<rect x="195" y="68" width="80" height="34" fill="#e3efff" stroke="#263a55" stroke-width="3"/><rect x="350" y="68" width="85" height="34" fill="#e3efff" stroke="#263a55" stroke-width="3"/>'+txt(209,92,r1+' Ω')+txt(366,92,r2+' Ω')+txt(240,225,'Series circuit'));
 add('CIRCUIT',i,'What is the total resistance of the two resistors connected in series?',arr,correct,'Electric Circuits',9,img);
}
const chains=[['grass','grasshopper','frog','snake'],['algae','zooplankton','small fish','large fish'],['grass','rabbit','fox','eagle'],['leaves','caterpillar','small bird','hawk'],['phytoplankton','krill','penguin','seal'],['seeds','mouse','snake','owl'],['grass','zebra','lion','vulture'],['leaves','snail','thrush','hawk'],['pondweed','tadpole','fish','heron'],['nectar','butterfly','spider','bird']];
for(let i=0;i<50;i++){
 const chain=chains[i%10],target=1+(Math.floor(i/10)%3),answer=chain[target],opts=chain.slice(),rotate=i%4,arr=opts.map((_,j)=>opts[(j+rotate)%4]),correct=arr.indexOf(answer);
 const img=svg(txt(30,34,'Food chain: arrows show energy transfer')+chain.map((name,j)=>'<rect x="'+(16+j*153)+'" y="85" width="125" height="65" rx="9" fill="#edf7ed" stroke="#357348" stroke-width="2"/>'+txt(23+j*153,124,name)+(j<3?txt(142+j*153,125,'→'):'' )).join(''));
 add('FOODCHAIN',i,'Which organism is at position '+(target+1)+' in the food chain shown?',arr,correct,'Food Chains and Energy Flow',7,img);
}
for(let i=0;i<50;i++){
 const effort=10+2*(i%20),arm=2+(Math.floor(i/20)%3),loadArm=1,load=effort*arm;
 const opts=[load,load+effort,effort,load+2*effort],rotate=i%4,arr=opts.map((_,j)=>opts[(j+rotate)%4]),correct=arr.indexOf(load);
 const img=svg(txt(35,30,'Balanced lever (not to scale)')+line(85,120,535,120)+'<polygon points="390,120 365,175 415,175" fill="#a4b8cf" stroke="#263a55" stroke-width="2"/>'+line(120,110,120,70)+line(495,110,495,70)+txt(70,60,'Effort '+effort+' N')+txt(432,60,'Load ? N')+txt(165,165,'Effort arm '+arm+' m')+txt(425,165,'Load arm 1 m'));
 add('LEVER',i,'For this balanced lever, what load force balances the labelled effort? Use effort × effort arm = load × load arm.',arr,correct,'Simple Machines and Levers',7,img);
}
window.PracticeQuizImportedVisual200=qs;
})();