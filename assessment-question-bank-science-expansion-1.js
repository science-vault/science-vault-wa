// Science expansion 1: large Years 7-10 assessment-style bank.
// Original questions organised by the four lower-school Science strands.
(function(){
const B=window.AssessmentQuestionBank||(window.AssessmentQuestionBank=[]);
const strands=['Biological Sciences','Chemical Sciences','Earth and Space Sciences','Physical Sciences'];
const concepts={
7:{
'Biological Sciences':['classification','food webs','ecosystems','adaptations','biotic and abiotic factors'],
'Chemical Sciences':['mixtures','solutions','separation techniques','pure substances','physical properties'],
'Earth and Space Sciences':['seasons','Moon phases','eclipses','Earth-Sun-Moon system','renewable resources'],
'Physical Sciences':['forces','simple machines','balanced forces','friction','gravity']},
8:{
'Biological Sciences':['cells','organ systems','plant and animal cells','microscopes','structure and function'],
'Chemical Sciences':['elements','compounds','mixtures','particle model','physical and chemical change'],
'Earth and Space Sciences':['rocks','minerals','rock cycle','weathering and erosion','Earth materials'],
'Physical Sciences':['energy','energy transfer','heat','light','sound']},
9:{
'Biological Sciences':['body systems','nervous system','endocrine system','disease','homeostasis'],
'Chemical Sciences':['atoms','chemical reactions','conservation of mass','acids and bases','reaction evidence'],
'Earth and Space Sciences':['plate tectonics','earthquakes','volcanoes','geological change','carbon cycle'],
'Physical Sciences':['electricity','circuits','voltage','current','resistance']},
10:{
'Biological Sciences':['genetics','DNA','inheritance','natural selection','evolution'],
'Chemical Sciences':['reaction rates','solutions','solubility','precipitation','chemical equations'],
'Earth and Space Sciences':['universe','stars','stellar life cycles','galaxies','Big Bang'],
'Physical Sciences':['motion','speed','velocity','acceleration','Newtonian forces']}}
;
const diag={
cell:`<svg viewBox="0 0 520 330" xmlns="http://www.w3.org/2000/svg"><rect width="520" height="330" fill="white"/><ellipse cx="260" cy="165" rx="180" ry="115" fill="#f7fafb" stroke="#263746" stroke-width="4"/><circle cx="245" cy="160" r="48" fill="white" stroke="#263746" stroke-width="3"/><ellipse cx="365" cy="115" rx="34" ry="16" fill="white" stroke="#263746" stroke-width="3"/><ellipse cx="150" cy="220" rx="32" ry="15" fill="white" stroke="#263746" stroke-width="3"/><line x1="245" y1="112" x2="245" y2="55" stroke="#263746"/><text x="230" y="45">A</text><line x1="400" y1="115" x2="455" y2="85" stroke="#263746"/><text x="465" y="85">B</text><line x1="82" y1="165" x2="35" y2="165" stroke="#263746"/><text x="15" y="160">C</text></svg>`,
moon:`<svg viewBox="0 0 620 360" xmlns="http://www.w3.org/2000/svg"><rect width="620" height="360" fill="white"/><circle cx="310" cy="180" r="48" fill="#eef3f6" stroke="#263746" stroke-width="3"/><text x="287" y="185">Earth</text>${[[310,45],[445,85],[500,180],[445,275],[310,315],[175,275],[120,180],[175,85]].map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="21" fill="white" stroke="#263746" stroke-width="3"/><text x="${p[0]-5}" y="${p[1]+5}" font-size="13">${i+1}</text>`).join('')}<text x="515" y="35">Sunlight →</text></svg>`,
circuit:`<svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg"><rect width="560" height="300" fill="white"/><path d="M100 70 H440 V230 H100 Z" fill="none" stroke="#263746" stroke-width="4"/><line x1="220" y1="55" x2="220" y2="85" stroke="#263746" stroke-width="3"/><line x1="235" y1="45" x2="235" y2="95" stroke="#263746" stroke-width="5"/><circle cx="360" cy="70" r="28" fill="white" stroke="#263746" stroke-width="3"/><path d="M340 50 L380 90 M380 50 L340 90" stroke="#263746" stroke-width="2"/><circle cx="100" cy="150" r="27" fill="white" stroke="#263746" stroke-width="3"/><text x="91" y="157" font-size="22">A</text><text x="250" y="45">cell</text><text x="345" y="120">lamp</text></svg>`,
force:`<svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg"><rect width="560" height="300" fill="white"/><rect x="215" y="115" width="130" height="80" fill="#f5f8fa" stroke="#263746" stroke-width="3"/><line x1="280" y1="115" x2="280" y2="45" stroke="#263746" stroke-width="4"/><polygon points="270,60 290,60 280,42"/><line x1="280" y1="195" x2="280" y2="265" stroke="#263746" stroke-width="4"/><polygon points="270,250 290,250 280,268"/><line x1="215" y1="155" x2="125" y2="155" stroke="#263746" stroke-width="4"/><polygon points="142,145 142,165 122,155"/><line x1="345" y1="155" x2="445" y2="155" stroke="#263746" stroke-width="4"/><polygon points="428,145 428,165 448,155"/><text x="295" y="55">A</text><text x="295" y="255">B</text><text x="145" y="140">C</text><text x="420" y="140">D</text></svg>`,
star:`<svg viewBox="0 0 680 260" xmlns="http://www.w3.org/2000/svg"><rect width="680" height="260" fill="white"/><circle cx="70" cy="130" r="38" fill="#f5f8fa" stroke="#263746" stroke-width="3"/><circle cx="210" cy="130" r="50" fill="#f5f8fa" stroke="#263746" stroke-width="3"/><circle cx="365" cy="130" r="62" fill="#f5f8fa" stroke="#263746" stroke-width="3"/><circle cx="535" cy="130" r="34" fill="#f5f8fa" stroke="#263746" stroke-width="3"/><line x1="108" y1="130" x2="155" y2="130" stroke="#263746" stroke-width="3"/><polygon points="155,130 142,122 142,138"/><line x1="260" y1="130" x2="303" y2="130" stroke="#263746" stroke-width="3"/><polygon points="303,130 290,122 290,138"/><line x1="427" y1="130" x2="500" y2="130" stroke="#263746" stroke-width="3"/><polygon points="500,130 487,122 487,138"/><text x="62" y="136">A</text><text x="202" y="136">B</text><text x="357" y="136">C</text><text x="527" y="136">D</text></svg>`};
function add(q){B.push(q)}
for(const y of [7,8,9,10]) for(const topic of strands){
 const c=concepts[y][topic];
 // 15 MCQ
 for(let i=1;i<=15;i++){const a=c[(i-1)%c.length],b=c[i%c.length],d=c[(i+2)%c.length];add({id:`sx1-${y}-${topic[0]}-mc${i}`,subject:'science',year:y,topic,type:'Multiple choice',difficulty:i<6?'Easy':i<12?'Medium':'Hard',marks:1,question:`Which statement best demonstrates understanding of ${a} in Year ${y} ${topic}? A. It is unrelated to ${b}. B. It can be explained using scientific evidence and the relevant model. C. It always produces the same outcome regardless of conditions. D. It is identical to ${d}.`,answer:'B. The scientifically supported statement is the best response.'})}
 // 12 short answer
 for(let i=1;i<=12;i++){const a=c[(i-1)%c.length],b=c[(i+1)%c.length];add({id:`sx1-${y}-${topic[0]}-sa${i}`,subject:'science',year:y,topic,type:'Short answer',difficulty:i<5?'Easy':i<10?'Medium':'Hard',marks:i<7?2:3,question:`Describe ${a} and explain one scientifically meaningful connection between ${a} and ${b}.`,answer:`Award 1 mark for an accurate description of ${a}; remaining mark(s) for a correct, relevant connection to ${b} using appropriate Year ${y} scientific terminology.`,responseLines:4})}
 // 8 multi-step
 for(let i=1;i<=8;i++){const a=c[(i-1)%c.length],b=c[(i+2)%c.length];add({id:`sx1-${y}-${topic[0]}-ms${i}`,subject:'science',year:y,topic,type:'Multi-step',difficulty:i<4?'Medium':'Hard',marks:8,question:`A student investigates ${a}. (a) Identify a variable that could be changed. (b) Identify a variable that should be measured. (c) State two variables that should be controlled. (d) Predict how changing the independent variable could affect the result. (e) Explain how the investigation could provide evidence about ${b}.`,answer:`(a) suitable independent variable [1]; (b) measurable dependent variable [1]; (c) two relevant controls [2]; (d) testable prediction [2]; (e) scientifically valid explanation linked to ${b} [2].`,response:'working'})}
 // 5 extended
 for(let i=1;i<=5;i++){const a=c[(i-1)%c.length],b=c[(i+2)%c.length],d=c[(i+3)%c.length];add({id:`sx1-${y}-${topic[0]}-er${i}`,subject:'science',year:y,topic,type:'Extended response',difficulty:'Hard',marks:10,question:`Use your knowledge of ${a}, ${b} and ${d} to explain how scientists can use evidence to account for a change or pattern in this system. Include relevant scientific vocabulary, a cause-and-effect chain and one limitation or factor that could alter the outcome.`,answer:`Accurate science involving ${a} [2]; link to ${b} [2]; link to ${d} [2]; logical cause-and-effect reasoning [2]; relevant limitation/factor [1]; clear scientific communication [1].`,responseLines:14})}
 // 5 fill blanks
 for(let i=1;i<=5;i++){const a=c[(i-1)%c.length],b=c[i%c.length];add({id:`sx1-${y}-${topic[0]}-fb${i}`,subject:'science',year:y,topic,type:'Fill in the blanks',difficulty:'Easy',marks:2,question:`Complete the sentence using appropriate scientific terms: “In this topic, __________ is closely related to ${a}, while __________ is used when discussing ${b}.”`,answer:`Accept the appropriate syllabus-aligned terms that correctly complete both statements. [1+1]`,responseLines:2})}
 // 5 labelling/diagram interpretation
 for(let i=1;i<=5;i++){let dg=topic==='Physical Sciences'?(y===9?diag.circuit:diag.force):topic==='Earth and Space Sciences'?(y===10?diag.star:diag.moon):topic==='Biological Sciences'?diag.cell:diag.cell;add({id:`sx1-${y}-${topic[0]}-lb${i}`,subject:'science',year:y,topic,type:'Labelling',difficulty:i<3?'Easy':'Medium',marks:4,question:`Study the diagram. Label or identify the indicated features A–D where applicable, then state one scientifically correct relationship represented by the diagram.`,answer:`Award marks for correct labels/identifications appropriate to the diagram and topic, plus one mark for a correct scientific relationship.`,diagram:dg,responseLines:4})}
}
})();