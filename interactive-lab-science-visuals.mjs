import {pendulum,wave,refraction,gas,equilibrium,osmosis} from './interactive-lab-science.mjs';
const C={ink:'#27384c',muted:'#526278',purple:'#7354dc',teal:'#078679',gold:'#b77c15',line:'#dce3ed',blue:'#2779bb'};
const f=n=>Number(n.toFixed(2));
const txt=(x,y,s,size=14,color=C.muted,anchor='start')=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" text-anchor="${anchor}" font-family="system-ui,sans-serif">${s}</text>`;
const line=(x,y,a,b,color=C.line,width=2,dash='')=>`<line x1="${x}" y1="${y}" x2="${a}" y2="${b}" stroke="${color}" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
const dot=(x,y,r,color,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" ${extra}/>`;
function plot(points,x,y,w,h,xmax,ymax,color,ymin=0){return `<polyline points="${points.map(([a,b])=>`${x+a/xmax*w},${y+h-(b-ymin)/(ymax-ymin)*h}`).join(' ')}" fill="none" stroke="${color}" stroke-width="2.5"/>`;}
function graph(title,xlabel,ylabel,xmax,ymax,ymin=0){const x=485,y=100,w=240,h=210;let s=txt(x,58,title,16,C.ink)+txt(x,84,ylabel,12);for(let i=0;i<=4;i++)s+=line(x,y+i*h/4,x+w,y+i*h/4)+txt(x-8,y+h-i*h/4+4,f(ymin+(ymax-ymin)*i/4),11,C.muted,'end')+txt(x+i*w/4,y+h+22,f(xmax*i/4),11,C.muted,'middle');return s+line(x,y,x,y+h,C.muted)+line(x,y+h,x+w,y+h,C.muted)+txt(x+w/2,y+h+48,xlabel,12,C.muted,'middle');}
function energyBar(x,y,label,value,total,color){return txt(x,y,label,13)+`<rect x="${x}" y="${y+10}" width="270" height="15" rx="6" fill="#e8edf3"/><rect x="${x}" y="${y+10}" width="${Math.max(0,value/total*270)}" height="15" rx="6" fill="${color}"/>`+txt(x+282,y+23,`${f(value)} J`,12);}
export function scienceVisual(lab,v,t=0){let s='';
 if(lab.id==='pendulum'){
  const p=pendulum(v,t),len=75+v.length*69,x=220+len*Math.sin(p.theta),y=62+len*Math.cos(p.theta);
  s=line(80,62,365,62,C.ink,5)+line(220,62,220,335,C.line,1,'5 5')+line(220,62,x,y,C.ink,3)+dot(220,62,6,C.ink)+dot(x,y,15+v.mass*4,C.purple,'data-drag="pendulum" style="cursor:grab"')+txt(35,32,'DRAG THE BOB OR CHANGE A CONTROL',12,C.purple)+txt(220,355,`Period: ${f(p.period)} s`,18,C.ink,'middle');
  const duration=p.period*3,pts=Array.from({length:81},(_,i)=>[i/80*duration,pendulum(v,i/80*duration).kinetic]);s+=graph('Energy exchange','Time (s)','Energy (J)',duration,Math.max(.01,p.total*1.05))+plot(pts,485,100,240,210,duration,Math.max(.01,p.total*1.05),C.teal)+plot(pts.map(([a,b])=>[a,p.total-b]),485,100,240,210,duration,Math.max(.01,p.total*1.05),C.gold)+txt(485,385,'Teal: kinetic · Gold: potential',12)+line(485+(t%duration)/duration*240,100,485+(t%duration)/duration*240,310,C.purple,1,'4 3');
 }
 if(lab.id==='waves'){
  const px=x=>35+x/6*380,py=y=>205-y*105;
  s=txt(35,33,'DISTURBANCE TRAVELS RIGHT →',13,C.purple)+line(35,205,420,205,C.line,2,'4 4');
  for(let i=0;i<=6;i++)s+=line(px(i),202,px(i),209,C.muted)+txt(px(i),340,i+' m',12,C.muted,'middle');
  const points=Array.from({length:161},(_,i)=>{const x=i/160*6;return[px(x),py(v.amplitude*Math.sin(2*Math.PI*(x/v.wavelength-v.frequency*t)))];});s+=`<polyline points="${points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${C.purple}" stroke-width="4"/>`;
  const y=v.amplitude*Math.sin(2*Math.PI*(2/v.wavelength-v.frequency*t));s+=line(px(2),90,px(2),315,C.gold,1,'4 4')+dot(px(2),py(y),9,C.gold)+txt(225,376,'Gold marker: one particle at x = 2 m',13,C.ink,'middle');
  const pts=Array.from({length:101},(_,i)=>[i/100*3,v.amplitude*Math.sin(2*Math.PI*(2/v.wavelength-v.frequency*i/100*3))]);
  s+=graph('Particle displacement','Time (s)','Displacement y (m)',3,v.amplitude,-v.amplitude)+plot(pts,485,100,240,210,3,v.amplitude,C.gold,-v.amplitude)+txt(485,385,'Gold marker oscillates about y = 0',11);
 }
 if(lab.id==='refraction'){
  const p=refraction(v),a=v.incidence*Math.PI/180,x=220-170*Math.sin(a),y=205-170*Math.cos(a);
  s=`<rect x="25" y="55" width="395" height="150" rx="12" fill="#eef3fc"/><rect x="25" y="205" width="395" height="160" rx="12" fill="#ddf2ed"/>`+line(25,205,420,205,C.muted)+line(220,65,220,350,C.muted,1,'5 4')+txt(35,80,`Upper medium: n₁ = ${v.n1}`,13)+txt(35,343,`Lower medium: n₂ = ${v.n2}`,13)+txt(230,105,'Normal',12)+line(x,y,220,205,C.purple,5)+dot(x,y,12,C.purple,'data-drag="refraction" style="cursor:grab"')+line(220,205,220+160*Math.sin(a),205-160*Math.cos(a),C.gold,3,'6 4');
  if(!p.tir){const b=p.angle*Math.PI/180;s+=line(220,205,220+165*Math.sin(b),205+165*Math.cos(b),C.teal,5);}s+=dot(220,205,5,C.ink)+txt(225,395,'Drag the purple light source to change incidence.',12,C.ink,'middle')+txt(480,85,p.tir?'TOTAL INTERNAL REFLECTION':'REFRACTION',15,p.tir?C.purple:C.teal)+txt(480,130,`Incidence: ${v.incidence}°`,18,C.ink)+txt(480,172,p.tir?'No propagating refracted ray':`Refraction: ${f(p.angle)}°`,16,C.ink)+txt(480,214,p.critical===null?'No critical angle for this direction':`Critical angle: ${f(p.critical)}°`,14)+txt(480,270,'Purple: incident ray',13,C.purple)+txt(480,298,'Gold: reflected ray',13,C.gold)+txt(480,326,'Teal: refracted ray',13,C.teal)+txt(480,370,'All angles are measured from the normal.',12);
 }
 if(lab.id==='gas'){
  const width=110+v.volume/30*270,x=35,y=95,height=220,velocity=Math.sqrt(v.temperature/300),bounce=z=>1-Math.abs((z%2+2)%2-1),count=Math.round(v.amount*20);
  s=txt(35,38,'DRAG THE RIGHT PISTON TO CHANGE VOLUME',12,C.purple)+`<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#edf4ff" stroke="${C.muted}" stroke-width="3"/>`;
  for(let i=0;i<count;i++){const dx=bounce(i*.618+t*velocity*(.22+i%3*.08)),dy=bounce(i*.414+t*velocity*(.31+i%4*.07));s+=dot(x+8+dx*(width-16),y+8+dy*(height-16),4,C.blue);}
  s+=`<rect x="${x+width-7}" y="${y-8}" width="14" height="${height+16}" rx="5" fill="${C.purple}" data-drag="gas" style="cursor:ew-resize"/>`+txt(x+width/2,355,`${v.volume} L · ${v.temperature} K`,18,C.ink,'middle')+txt(225,388,'Dots represent samples; chamber dimensions are schematic.',11,C.muted,'middle');
  const max=gas({...v,volume:2}).pressure,pts=Array.from({length:100},(_,i)=>{const volume=2+i/99*28;return[volume,gas({...v,volume}).pressure];});s+=graph('Isotherm at current n and T','Volume (L)','Pressure (kPa)',30,max)+plot(pts,485,100,240,210,30,max,C.purple)+dot(485+v.volume/30*240,310-gas(v).pressure/max*210,6,C.gold)+txt(485,385,'Gold point: current chamber settings',12);
 }
 if(lab.id==='equilibrium'){
  const p=equilibrium(v,t);s=txt(220,40,'A ⇌ B',32,C.ink,'middle')+`<rect x="35" y="70" width="375" height="240" rx="16" fill="#f0f2fc" stroke="${C.line}"/>`;
  const aCount=Math.round(p.a*48);for(let i=0;i<48;i++){const x=58+i%8*46+Math.sin(t*1.5+i)*4,y=94+Math.floor(i/8)*37+Math.cos(t*1.2+i)*4;s+=dot(x,y,7,((i+Math.floor(t*3))%48)<aCount?C.purple:C.teal);}
  s+=txt(35,342,`Forward: ${f(p.forwardRate)} · Reverse: ${f(p.reverseRate)} mmol/L/s`,13)+txt(35,376,'Particles are samples; graph and readings use exact concentrations.',11);
  const pts=Array.from({length:101},(_,i)=>[i/100*20,equilibrium(v,i/100*20).a]);s+=graph('Approach to equilibrium','Time (s)','Concentration (mmol/L)',20,1)+plot(pts,485,100,240,210,20,1,C.purple)+plot(pts.map(([a,b])=>[a,1-b]),485,100,240,210,20,1,C.teal)+line(485+Math.min(20,t)/20*240,100,485+Math.min(20,t)/20*240,310,C.gold,1,'4 3')+txt(485,385,'Purple: A · Teal: B · Total = 1 mmol/L',12);
 }
 if(lab.id==='osmosis'){
  const p=osmosis(v,t),leftH=p.leftVolume*110,rightH=p.rightVolume*110;s=txt(220,33,'SELECTIVE MEMBRANE',14,C.purple,'middle')+`<rect x="35" y="70" width="380" height="245" fill="#fafcff" stroke="${C.line}" stroke-width="2"/><rect x="36" y="${314-leftH}" width="183" height="${leftH}" fill="#dceafa"/><rect x="222" y="${314-rightH}" width="192" height="${rightH}" fill="#d8f2eb"/>`+line(220,64,220,322,C.purple,5,'7 5');
  for(let side=0;side<2;side++){const n=side?v.right:v.left,h=side?rightH:leftH,start=side?235:50;for(let i=0;i<Math.round(n/2);i++)s+=dot(start+i%7*24,310-10-Math.floor(i/7)*Math.min(32,(h-20)/5),4,side?C.teal:C.blue);}
  const diff=p.leftConcentration-p.rightConcentration,label=Math.abs(diff)<.1?'No net water movement':diff>0?'← NET WATER MOVEMENT':'NET WATER MOVEMENT →';s+=txt(220,355,label,13,C.ink,'middle')+txt(220,383,'Solute stays on its own side. Initial volume: 1 L each.',11,C.muted,'middle');
  const max=Math.max(v.left,v.right),pts=Array.from({length:101},(_,i)=>[i/100*40,osmosis(v,i/100*40).leftConcentration]);s+=graph('Concentrations equalise','Illustrative time (s)','Concentration (mmol/L)',40,max)+plot(pts,485,100,240,210,40,max,C.blue)+plot(pts.map(([a])=>[a,osmosis(v,a).rightConcentration]),485,100,240,210,40,max,C.teal)+line(485+Math.min(40,t)/40*240,100,485+Math.min(40,t)/40*240,310,C.gold,1,'4 3')+txt(485,385,'Blue: left · Teal: right · Schematic reservoirs',11);
 }
 return s?`<svg viewBox="0 0 760 420" role="img" aria-label="${lab.title}: live model and measurements"><title>${lab.title}: live model and measurements</title><rect width="760" height="420" rx="12" fill="#f8faff"/>${s}</svg>`:null;
}
