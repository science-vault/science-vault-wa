/* 500 original image-supported MCQs, packaged as batches of 200, 200 and 100.
   Every diagram is generated from the question's numeric parameters. */
(function(){
'use strict';
const bank=[];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const text=(x,y,s)=>'<text x="'+x+'" y="'+y+'">'+esc(s)+'</text>';
const line=(x,y,a,b)=>'<line x1="'+x+'" y1="'+y+'" x2="'+a+'" y2="'+b+'" stroke="#233955" stroke-width="3"/>';
const box=(x,y,w,h,fill)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="8" fill="'+(fill||'#edf4fc')+'" stroke="#233955" stroke-width="2"/>';
const img=body=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="660" height="250" viewBox="0 0 660 250"><rect width="660" height="250" fill="#fff"/><g fill="#20334c" font-family="Arial,sans-serif" font-size="19">'+body+'</g></svg>');
function add(group,i,topic,year,stem,answer,unit,visual){
 const offsets=[0,1,2,3],correct=i%4;
 const vals=[answer,answer+1,answer+2,answer+3];
 const choices=offsets.map((_,j)=>vals[(j-correct+4)%4]+' '+unit);
 if(new Set(choices).size!==4)throw Error('Duplicate choices');
 bank.push({id:'SV-VISUAL-500-20261018-'+group+'-'+String(i+1).padStart(3,'0'),course:'Science',subject:'science',year,unit:topic,topic,type:'Multiple Choice',difficulty:i%3===0?'Easy':i%3===1?'Medium':'Hard',marks:1,stem,questionText:stem,mcOptions:choices,correctLetter:'ABCD'[correct],practiceImages:[img(visual)],source:'Science Vault WA original illustrated question',addedAt:'2026-10-18'});
}
for(let i=0;i<50;i++){
 const t=2+i,s=3+i%8,d=t*s;
 const pic=text(25,36,'Motion data')+box(65,76,225,95)+text(80,110,'Distance: '+d+' m')+text(80,148,'Time: '+t+' s')+line(315,125,580,125)+text(335,103,'Start')+text(510,103,'Finish');
 add('SPEED',i,'Speed and Motion',8,'A moving object travels '+d+' m in '+t+' s. What is its average speed?',s,'m/s',pic);
}
for(let i=0;i<50;i++){
 const volume=3+i,mult=2+i%7,mass=volume*mult;
 const pic=text(30,38,'Material sample')+box(75,78,195,115,'#e8f4f4')+text(90,116,'Mass: '+mass+' g')+text(90,151,'Volume: '+volume+' cm³')+text(345,121,'Density = mass / volume');
 add('DENSITY',i,'Density',8,'What is the density of the material shown?',mult,'g/cm³',pic);
}
for(let i=0;i<50;i++){
 const vol=2+i,density=3+i%8,mass=vol*density;
 const pic=text(30,37,'Measuring a solid')+box(75,76,240,110,'#e8f4f4')+text(90,116,'Volume: '+vol+' cm³')+text(90,153,'Density: '+density+' g/cm³')+text(352,125,'Mass = density × volume');
 add('MASS',i,'Density',8,'What is the mass of the solid shown?',mass,'g',pic);
}
for(let i=0;i<50;i++){
 const area=2+i,pressure=3+i%9,force=area*pressure;
 const pic=text(25,35,'Force acting on a surface')+box(170,125,295,42,'#f0e8ff')+line(316,64,316,120)+text(337,90,'Force: '+force+' N')+text(194,207,'Contact area: '+area+' m²');
 add('PRESSURE',i,'Pressure',9,'A force of '+force+' N acts over '+area+' m². What pressure is produced?',pressure,'Pa',pic);
}
for(let i=0;i<50;i++){
 const duration=2+i,frequency=2+i%10,cycles=duration*frequency;
 const pic=text(24,35,'Oscillation record')+box(60,70,270,120)+text(75,110,'Cycles: '+cycles)+text(75,150,'Time: '+duration+' s')+text(360,115,'Frequency = cycles / time');
 add('FREQUENCY',i,'Waves',9,'A vibrating object completes '+cycles+' cycles in '+duration+' seconds. What is its frequency?',frequency,'Hz',pic);
}
for(let i=0;i<50;i++){
 const frequency=2+i,speed=frequency*(2+i%8),wavelength=speed/frequency;
 const pic=text(24,35,'Wave measurements')+box(55,74,280,115,'#edf4fc')+text(75,112,'Wave speed: '+speed+' m/s')+text(75,150,'Frequency: '+frequency+' Hz')+text(354,123,'Wavelength = speed / frequency');
 add('WAVELENGTH',i,'Waves',9,'What is the wavelength of the wave described in the diagram?',wavelength,'m',pic);
}
for(let i=0;i<50;i++){
 const mass=2*(i+1),speed=2+i%9,energy=mass*speed*speed/2;
 const pic=text(22,36,'Moving trolley')+box(100,92,190,72,'#f4f2e9')+'<circle cx="135" cy="178" r="14" fill="#263b55"/><circle cx="255" cy="178" r="14" fill="#263b55"/>'+text(115,120,'Mass: '+mass+' kg')+text(115,149,'Speed: '+speed+' m/s')+text(328,132,'KE = ½ × mass × speed²');
 add('KINETIC',i,'Energy and Motion',10,'Calculate the kinetic energy of the moving trolley.',energy,'J',pic);
}
for(let i=0;i<50;i++){
 const mass=i+2,height=2+i%9,energy=mass*10*height;
 const pic=text(25,34,'Object raised above the ground')+line(70,207,590,207)+box(165,65,130,48,'#edf4fc')+text(174,95,mass+' kg')+line(315,113,315,205)+text(330,164,'Height: '+height+' m')+text(385,85,'g = 10 N/kg');
 add('GPE',i,'Gravitational Potential Energy',10,'Using g = 10 N/kg, calculate the gravitational potential energy gained by the object.',energy,'J',pic);
}
for(let i=0;i<50;i++){
 const mass=2+i,acc=2+i%10,force=mass*acc;
 const pic=text(24,36,'Object accelerating horizontally')+box(130,90,180,90,'#eaf5ed')+text(145,122,'Mass: '+mass+' kg')+text(145,153,'a = '+acc+' m/s²')+line(320,135,515,135)+text(375,111,'Force ?');
 add('NEWTON',i,'Forces and Newton’s Laws',10,'What resultant force is needed to accelerate the object as shown?',force,'N',pic);
}
for(let i=0;i<50;i++){
 const count=2+i,voltage=count*1.5;
 const pic=text(26,36,'Identical cells connected in series')+box(75,76,260,105)+text(93,118,'Number of cells: '+count)+text(93,154,'Each cell: 1.5 V')+text(370,117,'Total voltage = sum of cell voltages');
 add('CELLS',i,'Electricity and Circuits',9,'What is the total voltage supplied by the '+count+' cells in series?',voltage,'V',pic);
}
if(bank.length!==500)throw Error('Expected exactly 500 questions');
window.PracticeQuizVisualBatch200A=bank.slice(0,200);
window.PracticeQuizVisualBatch200B=bank.slice(200,400);
window.PracticeQuizVisualBatch100C=bank.slice(400,500);
})();