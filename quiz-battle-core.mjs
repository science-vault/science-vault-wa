// Shared game rules. Battle points are separate from Learning League XP.
export const TEAMS=['Aurora','Orbit','Nova','Comet'];
export const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function validateDeck(input){
 if(!Array.isArray(input)||input.length<1||input.length>50)throw Error('Use between 1 and 50 questions.');
 return input.map((q,i)=>{if(typeof q.prompt!=='string'||!q.prompt.trim()||q.prompt.length>2000||!Array.isArray(q.options)||q.options.length!==4||q.options.some(x=>typeof x!=='string'||!x.trim()||x.length>300)||new Set(q.options.map(x=>x.trim().toLowerCase())).size!==4||!Number.isInteger(q.correct)||q.correct<0||q.correct>3||typeof(q.explanation??'')!=='string'||(q.explanation??'').length>1000)throw Error(`Question ${i+1}: provide a question, four different options and a correct answer numbered 0–3.`);return{id:String(q.id||'custom-'+i).slice(0,100),prompt:q.prompt.trim(),options:q.options.map(x=>x.trim()),correct:q.correct,explanation:q.explanation||''}});
}
export function points(correct,elapsed,seconds,streak=0){if(!correct)return 0;const fraction=Math.max(0,Math.min(1,Number(elapsed)/seconds));return 500+Math.round(500*(1-fraction))+Math.min(5,Math.max(0,streak-1))*50}
export function scoreRound(players,previous,answers,correct,startedAt,seconds,mode){
 const old=new Map(previous.map(x=>[x.uid,x])),responses=new Map(answers.map(x=>[x.uid,x]));
 return players.map(p=>{const prior=old.get(p.uid)||{score:0,streak:0,correct:0},a=responses.get(p.uid),elapsed=a?(a.createdAt-startedAt)/1000:Infinity,valid=Number.isFinite(elapsed)&&elapsed>=0&&elapsed<=seconds,hit=valid&&a.choice===correct,streak=hit?prior.streak+1:0,delta=points(hit,elapsed,seconds,streak);return{uid:p.uid,nickname:p.nickname,team:mode==='teams'?p.team:-1,score:prior.score+delta,streak,correct:prior.correct+(hit?1:0),delta}}).sort((a,b)=>b.score-a.score||b.correct-a.correct||a.nickname.localeCompare(b.nickname));
}
export function teamScores(rows){return TEAMS.map((name,team)=>{const members=rows.filter(x=>x.team===team);return{name,team,players:members.length,score:members.length?Math.round(members.reduce((s,x)=>s+x.score,0)/members.length):0}}).filter(x=>x.players).sort((a,b)=>b.score-a.score||a.team-b.team)}
export function parsePaste(text){return validateDeck(text.trim().split(/\n\s*\n/).filter(Boolean).map((block,i)=>{const lines=block.split('\n').map(x=>x.trim()),answer=lines.find(x=>/^answer:\s*[ABCD]\s*$/i.test(x));if(lines.length<6||!answer)throw Error(`Question ${i+1}: include a prompt, A–D options, and Answer: A (or B, C, D).`);const options=['A','B','C','D'].map(letter=>{const line=lines.find(x=>new RegExp('^'+letter+'[.)]\\s*','i').test(x));return line?.replace(/^[ABCD][.)]\s*/i,'')||''});return{prompt:lines[0],options,correct:'ABCD'.indexOf(answer.split(':')[1].trim().toUpperCase()),explanation:lines.find(x=>/^why:/i.test(x))?.replace(/^why:\s*/i,'')||''}}))}
export function randomCode(){const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';return [...crypto.getRandomValues(new Uint8Array(8))].map(n=>a[n%a.length]).join('')}
const q=(id,prompt,options,correct,explanation)=>({id,prompt,options,correct,explanation});
export const STARTERS={
 'Science':[
 q('SCI-01','Which change is a chemical reaction?',['Melting ice','Evaporating water','Rusting iron','Crushing a can'],2,'Rusting forms a new substance: iron oxide.'),
 q('SCI-02','Which variable is deliberately changed in a fair test?',['Dependent variable','Independent variable','Controlled variable','Mean result'],1,'The independent variable is the factor the investigator changes.'),
 q('SCI-03','Which cell structure controls most cell activities?',['Cell wall','Vacuole','Cell membrane','Nucleus'],3,'The nucleus contains genetic information that directs cell activities.'),
 q('SCI-04','In a food web, what does an arrow from grass to a rabbit show?',['Energy transfer to the rabbit','The rabbit makes the grass grow','Energy transfer to the grass','Grass eats the rabbit'],0,'Food-web arrows show the direction in which energy is transferred.'),
 q('SCI-05','An object travels 120 metres in 20 seconds. What is its average speed?',['0.17 m/s','6 m/s','100 m/s','2,400 m/s'],1,'Average speed = distance ÷ time = 120 ÷ 20 = 6 m/s.'),
 q('SCI-06','Which method separates an insoluble solid from a liquid?',['Distillation','Evaporation','Filtration','Chromatography'],2,'Filter paper traps the insoluble solid while the liquid passes through.')],
 'Physics ATAR':[
 q('PHY-01','A 2 kg object accelerates at 3 m/s². What is the net force?',['1.5 N','5 N','6 N','9 N'],2,'F = ma = 2 × 3 = 6 N.'),
 q('PHY-02','A wave has frequency 5 Hz and wavelength 2 m. What is its speed?',['2.5 m/s','7 m/s','0.4 m/s','10 m/s'],3,'v = fλ = 5 × 2 = 10 m/s.'),
 q('PHY-03','A 12 V supply drives a current of 2 A through a resistor. What is its resistance?',['6 Ω','24 Ω','10 Ω','0.17 Ω'],0,'R = V/I = 12/2 = 6 Ω.'),
 q('PHY-04','What happens to the momentum of an isolated system during a collision?',['It always increases','It is conserved','It becomes zero','It always decreases'],1,'Total momentum is conserved when the net external force is zero.')],
 'Chemistry ATAR':[
 q('CHE-01','What is the amount of substance in 18.0 g of water? Use M(H₂O) = 18.0 g/mol.',['0.10 mol','18.0 mol','1.00 mol','324 mol'],2,'n = m/M = 18.0/18.0 = 1.00 mol.'),
 q('CHE-02','Which particle is lost when a neutral atom forms a positive ion?',['Proton','Neutron','Nucleus','Electron'],3,'Losing an electron leaves more protons than electrons.'),
 q('CHE-03','For an exothermic forward reaction, what does increasing temperature favour at equilibrium?',['The reverse reaction','The forward reaction','Neither reaction','Only the catalyst'],0,'Higher temperature favours the endothermic direction, which is the reverse reaction here.'),
 q('CHE-04','What does a catalyst do?',['Increases the equilibrium constant','Lowers activation energy','Changes the overall enthalpy change','Is consumed completely'],1,'A catalyst provides a reaction pathway with lower activation energy.')],
 'Biology ATAR':[
 q('BIO-01','Which process produces two genetically identical daughter cells under normal conditions?',['Meiosis','Mitosis','Fertilisation','Crossing over'],1,'Mitosis preserves chromosome number and normally produces genetically identical daughter cells.'),
 q('BIO-02','What is the main role of decomposers?',['Create sunlight','Prevent respiration','Recycle nutrients','Remove all carbon'],2,'Decomposers break down organic matter, returning nutrients to the ecosystem.'),
 q('BIO-03','What is an allele?',['A form of a gene','A whole chromosome set','A cell organelle','A type of tissue'],0,'Alleles are alternative forms of a gene at the same locus.'),
 q('BIO-04','Which process is the net movement of water across a selectively permeable membrane?',['Active transport','Translation','Mitosis','Osmosis'],3,'Osmosis is the net movement of water across a selectively permeable membrane.')],
 'Human Biology ATAR':[
 q('HBI-01','Which hormone lowers blood glucose concentration?',['Glucagon','Adrenaline','Insulin','Thyroxine'],2,'Insulin promotes glucose uptake and storage, lowering blood glucose.'),
 q('HBI-02','Where does most gas exchange occur in the lungs?',['Alveoli','Trachea','Bronchi','Diaphragm'],0,'Alveoli provide a large, thin, moist surface close to blood capillaries.'),
 q('HBI-03','Which component of blood is chiefly responsible for transporting oxygen?',['Platelets','Plasma antibodies','White blood cells','Red blood cells'],3,'Haemoglobin in red blood cells binds oxygen.'),
 q('HBI-04','In negative feedback, the response usually does what?',['Amplifies the initial change','Opposes the initial change','Stops all body activity','Replaces the receptor'],1,'Negative feedback reduces a deviation from the normal range.')],
 'Mathematics Methods ATAR':[
 q('MTH-01','What is the derivative of x² with respect to x?',['x','2x','x³/3','2'],1,'The power rule gives d(x²)/dx = 2x.'),
 q('MTH-02','What is the gradient of y = 3x − 7?',['−7','7','3','−3'],2,'In y = mx + c, m is the gradient.'),
 q('MTH-03','Two independent fair coin tosses are made. What is P(two heads)?',['1/4','1/2','3/4','1'],0,'Multiply independent probabilities: 1/2 × 1/2 = 1/4.'),
 q('MTH-04','What is ln(e³)?',['e','3e','1','3'],3,'The natural logarithm is the inverse of exponentiation with base e.')]
};
