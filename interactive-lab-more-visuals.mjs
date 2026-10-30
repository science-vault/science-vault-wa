import {forces,spring,gravity,charges,concentration,ph} from './interactive-lab-more.mjs';
const purple='#7354dc',teal='#078679',gold='#b77c15',ink='#27384c',muted='#526278';
const f=x=>Math.abs(x)>0&&Math.abs(x)<.001?x.toExponential(2):Number(x.toFixed(3));
const txt=(x,y,s,size=14,color=muted,anchor='start')=>`<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-size="${size}" fill="${color}" text-anchor="${anchor}">${s}</text>`;
const line=(x,y,a,b,color=muted,width=2,extra='')=>`<line x1="${x}" y1="${y}" x2="${a}" y2="${b}" stroke="${color}" stroke-width="${width}" ${extra}/>`;
const dot=(x,y,r,color,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" ${extra}/>`;
function arrow(x,y,dx,color){return Math.abs(dx)<.01?'':line(x,y,x+dx,y,color,4)+`<path d="M${x+dx-Math.sign(dx)*9},${y-6}L${x+dx},${y}L${x+dx-Math.sign(dx)*9},${y+6}" fill="none" stroke="${color}" stroke-width="3"/>`;}
function graph(title,xLabel,yLabel,points,xmax,ymin,ymax,color=purple){const px=x=>485+x/xmax*240,py=y=>310-(y-ymin)/(ymax-ymin)*210;let s=txt(485,40,title,16,ink)+txt(485,76,yLabel,12);for(let i=0;i<=4;i++){const y=ymin+(ymax-ymin)*i/4;s+=line(485,py(y),725,py(y),'#dce3ed',1)+txt(478,py(y)+4,f(y),10,muted,'end')+txt(px(xmax*i/4),333,f(xmax*i/4),10,muted,'middle');}return s+line(485,100,485,310)+line(485,310,725,310)+txt(605,361,xLabel,12,muted,'middle')+`<polyline points="${points.map(([x,y])=>[px(x),py(y)].join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="3"/>`;}
export function moreVisual(lab,v,t=0){let s='';
if(lab.id==='forces-motion'){
 const p=forces(v,t),max=Math.max(1,Math.abs(p.a)*8),points=Array.from({length:81},(_,i)=>[i/10,p.a*i/10]);
 s=txt(25,35,'A CONSTANT PUSH · 8 SECOND RUN',13,purple)+line(25,265,425,265,ink,4);
 const offset=(p.position*18)%40;for(let i=-1;i<12;i++)s+=line(25+i*40-offset,270,10+i*40-offset,290,'#bdc7d5');
 s+=`<rect x="175" y="185" width="90" height="80" rx="9" fill="#e9e2ff" stroke="${purple}" stroke-width="3"/>`+txt(220,232,v.mass+' kg',17,ink,'middle')+arrow(220,165,v.push*1.6,purple)+arrow(220,285,-p.friction*1.6,gold)+txt(25,75,`Applied: ${v.push} N`,15,purple)+txt(25,101,`Friction: ${f(Math.abs(p.friction))} N`,15,gold)+txt(220,340,`Position: ${f(p.position)} m`,17,ink,'middle')+txt(220,371,'Camera follows crate · right is positive',12,muted,'middle');
 s+=graph('Velocity against time','Time (s)','Velocity (m/s)',points,8,p.a<0?-max:0,p.a<0?0:max)+line(485+p.time/8*240,100,485+p.time/8*240,310,gold,1);
}
if(lab.id==='spring-energy'){
 const p=spring(v,t),x=235+p.x*300,pts=[[45,205],[65,205]];for(let i=1;i<=18;i++)pts.push([65+(x-100)*i/19,205+(i%2?15:-15)]);pts.push([x-35,205]);
 s=txt(25,35,'RELEASE FROM REST · NO DAMPING',13,purple)+line(45,100,45,280,ink,6)+line(45,260,435,260,ink,3)+line(235,90,235,280,'#b8c4d4',1,'stroke-dasharray="5 4"')+`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${purple}" stroke-width="3"/><rect x="${x-35}" y="170" width="70" height="90" rx="8" fill="#e9e2ff" stroke="${purple}" stroke-width="3" data-drag="spring" style="cursor:ew-resize"/>`+txt(x,220,v.mass+' kg',14,ink,'middle')+arrow(x,140,Math.sign(p.force)*Math.min(100,Math.abs(p.force)*4),teal)+txt(235,303,'x = 0 (equilibrium)',12,muted,'middle')+txt(220,339,`x = ${f(p.x)} m · F = ${f(p.force)} N`,17,ink,'middle')+txt(220,377,'Drag the mass to set its release displacement.',12,muted,'middle');
 const duration=p.period*3,points=Array.from({length:121},(_,i)=>[i/120*duration,spring(v,i/120*duration).x]);s+=graph('Displacement against time','Time (s)','Displacement (m)',points,duration,-v.amplitude,v.amplitude)+line(485+(t%duration)/duration*240,100,485+(t%duration)/duration*240,310,gold,1);
}
if(lab.id==='gravity-force'||lab.id==='electric-charges'){
 const grav=lab.id==='gravity-force',p=grav?gravity(v):charges(v),min=grav?1:.2,max=grav?10:2,right=220+(v.distance-min)/(max-min)*150,left=95,y=205;
 s=txt(25,35,'DRAG THE RIGHT OBJECT TO CHANGE SEPARATION',12,purple)+line(left,285,right,285)+line(left,279,left,291)+line(right,279,right,291)+txt((left+right)/2,310,`${v.distance} m (centre to centre)`,13,muted,'middle');
 const c1=grav?purple:v.q1>0?'#b8485b':v.q1<0?'#2779bb':'#8794a4',c2=grav?teal:v.q2>0?'#b8485b':v.q2<0?'#2779bb':'#8794a4';
 s+=dot(left,y,30,c1)+dot(right,y,30,c2,'data-drag="'+(grav?'gravity':'charge')+'" style="cursor:ew-resize"')+txt(left,y+5,grav?v.mass1+' kg':v.q1>0?'+'+v.q1:v.q1,13,'white','middle')+txt(right,y+5,grav?v.mass2+' kg':v.q2>0?'+'+v.q2:v.q2,13,'white','middle');
 const direction=grav?1:Math.sign(-p.rightForce),length=p.force===0?0:Math.min(75,20+Math.log10(1+(grav?p.force*1e6:p.force)*50)*15);s+=arrow(left,150,length*direction,purple)+arrow(right,150,-length*direction,teal)+txt(220,355,grav?'Equal attraction on both objects':p.interaction,17,ink,'middle')+txt(220,385,'Force arrows schematic · objects held fixed',12,muted,'middle');
 const scale=grav?1e6:1,points=Array.from({length:101},(_,i)=>{const distance=min+(max-min)*i/100;return[distance,(grav?gravity({...v,distance}):charges({...v,distance})).force*scale];}),ymax=Math.max(grav?.01:.001,points[0][1]*1.05);
 s+=graph('Inverse-square relationship','Separation (m)',grav?'Force (µN)':'Force magnitude (N)',points,max,0,ymax)+dot(485+v.distance/max*240,310-p.force*scale/ymax*210,6,gold)+txt(485,390,'Gold point: current separation',12);
}
if(lab.id==='concentration-dilution'){
 const p=concentration(v),height=p.volume/3.5*245,top=320-height,count=Math.round(v.amount*100);
 s=txt(25,35,'ADD WATER · KEEP SOLUTE AMOUNT FIXED',13,purple)+`<path d="M85 65V320H365V65" fill="none" stroke="${ink}" stroke-width="3"/><rect x="87" y="${top}" width="276" height="${height}" fill="${purple}" opacity="${Math.min(.7,.12+p.final*.3)}"/>`;
 for(let i=0;i<count;i++)s+=dot(100+(i*.618%1)*250,top+7+(i*.414%1)*Math.max(1,height-14),4,purple);
 for(let i=0;i<=7;i++){const y=320-i/7*245;s+=line(365,y,375,y)+txt(383,y+4,(i*.5)+' L',11);}
 s+=line(85,top,365,top,teal,4)+dot(365,top,9,teal,'data-drag="dilution" style="cursor:ns-resize"')+txt(225,355,`${f(p.final)} mol/L`,24,ink,'middle')+txt(225,386,'Each dot: equal sample of dissolved solute',12,muted,'middle');
 const points=Array.from({length:101},(_,i)=>[i/100*2,concentration({...v,water:i/100*2}).final]);s+=graph('Concentration falls with dilution','Water added (L)','Concentration (mol/L)',points,2,0,p.initial*1.05)+dot(485+v.water/2*240,310-p.final/(p.initial*1.05)*210,6,gold);
}
if(lab.id==='ph-scale'){
 const p=ph(v),color=p.ph<6?'#c9545c':p.ph>8?'#6951ba':'#078679';
 s=txt(25,35,'IDEAL STRONG ACID OR BASE · 25 °C',13,purple)+`<path d="M90 95V300H350V95" fill="none" stroke="${ink}" stroke-width="3"/><rect x="92" y="145" width="256" height="153" fill="${color}" opacity=".25"/><rect x="260" y="75" width="16" height="150" rx="6" fill="${ink}"/><rect x="250" y="48" width="38" height="35" rx="6" fill="${teal}"/>`+txt(220,210,`pH ${f(p.ph)}`,30,ink,'middle')+txt(220,252,v.kind===0?'HCl (strong acid)':'NaOH (strong base)',16,ink,'middle')+txt(220,345,`Formal concentration: ${p.concentration.toExponential(2)} mol/L`,13,ink,'middle')+txt(220,377,'Colour is illustrative · no indicator model',12,muted,'middle')+txt(485,45,'Logarithmic pH scale',18,ink);
 const colors=['#bf4150','#ce594a','#d27640','#d49a35','#b9a734','#8aa13b','#52984b','#078679','#188b9e','#287bb3','#4967bb','#6754b2','#7c49a5','#923f90','#a33b78'];for(let i=0;i<14;i++)s+=`<rect x="${485+i/14*240}" y="135" width="${240/14+1}" height="45" fill="${colors[i]}"/>`;
 for(let i=0;i<=14;i+=2)s+=txt(485+i/14*240,205,i,12,muted,'middle');const x=485+p.ph/14*240;s+=`<path d="M${x-7} 119L${x} 132L${x+7} 119Z" fill="${ink}"/>`+txt(485,245,'Acidic',13,'#b8485b')+txt(605,245,'Neutral',13,teal,'middle')+txt(725,245,'Alkaline',13,purple,'end')+txt(485,297,`pH + pOH = ${f(p.ph+p.poh)}`,17,ink)+txt(485,336,'One pH unit = tenfold change',12)+txt(485,358,'in hydronium concentration.',12);
}
return s?`<svg viewBox="0 0 760 420" role="img" aria-label="${lab.title}: live model and measurements"><title>${lab.title}: live model and measurements</title><rect width="760" height="420" rx="12" fill="#f8faff"/>${s}</svg>`:null;
}
