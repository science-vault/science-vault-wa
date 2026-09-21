const R=window.SCIENCE_VAULT_RESOURCES||[];
const bank=[
["Biological Sciences","Classification","mc","Which characteristic is used to classify living things?","Observable structural and functional features",1,["Their location only","Observable structural and functional features","Their age only","Their size only"]],
["Biological Sciences","Classification","short","What is a dichotomous key used for?","To identify organisms by making a series of choices between two alternatives.",2],
["Biological Sciences","Classification","short","State the two parts of a scientific name.","Genus and species.",2],
["Biological Sciences","Classification","application","An unknown animal has a backbone. Explain how this information helps with classification.","It identifies the animal as a vertebrate and narrows the possible classification groups.",2],
["Biological Sciences","Ecosystems and feeding relationships","mc","What is the role of a producer in a food chain?","To make its own food, usually by photosynthesis.",1,["To eat other animals","To make its own food, usually by photosynthesis.","To decompose waste","To hunt prey"]],
["Biological Sciences","Ecosystems and feeding relationships","short","Explain the difference between a food chain and a food web.","A food chain shows one feeding pathway; a food web shows interconnected feeding pathways.",2],
["Biological Sciences","Ecosystems and feeding relationships","application","Predict one effect of removing a predator from a food web.","Prey populations may increase, causing flow-on effects to other populations.",2],
["Chemical Sciences","States of matter and particles","mc","In which state are particles closely packed but able to move past each other?","Liquid",1,["Solid","Liquid","Gas","Plasma"]],
["Chemical Sciences","States of matter and particles","short","Describe what happens to particles when a liquid is heated.","Particles gain kinetic energy, move faster and may separate enough for the liquid to become a gas.",2],
["Chemical Sciences","Mixtures and separation","mc","Which technique separates an insoluble solid from a liquid?","Filtration",1,["Distillation","Filtration","Chromatography","Crystallisation"]],
["Chemical Sciences","Mixtures and separation","short","Explain why chromatography can separate substances in a mixture.","Different substances travel at different rates because of differences in attraction to the solvent and paper.",2],
["Chemical Sciences","Mixtures and separation","application","Choose a method to obtain salt crystals from salt water and explain your choice.","Evaporation/crystallisation; water is removed so dissolved salt forms crystals.",2],
["Earth and Space Sciences","Space and the Solar System","mc","Which object orbits a planet?","A moon",1,["A galaxy","A moon","A constellation","A nebula"]],
["Earth and Space Sciences","Space and the Solar System","short","State one difference between a planet and a star.","A star produces its own light/energy; a planet orbits a star and does not produce light in the same way.",2],
["Earth and Space Sciences","Earth, Sun and Moon phenomena","short","What causes day and night on Earth?","Earth's rotation on its axis.",1],
["Earth and Space Sciences","Earth, Sun and Moon phenomena","application","Explain why the Moon appears to have phases.","As the Moon orbits Earth, we see different portions of its sunlit half.",2],
["Physical Sciences","Forces and motion","mc","What is the SI unit used to measure force?","newton (N)",1,["joule (J)","newton (N)","watt (W)","metre (m)"]],
["Physical Sciences","Forces and motion","short","What is the difference between balanced and unbalanced forces?","Balanced forces have zero net force; unbalanced forces produce a non-zero net force and can change motion.",2],
["Physical Sciences","Forces and motion","application","A book is resting on a table. Describe the forces acting on it.","Gravity acts downward and the table's support/normal force acts upward; the forces are balanced.",2],
["Physical Sciences","Simple machines","mc","Which simple machine is a ramp?","Inclined plane",1,["Lever","Pulley","Inclined plane","Wheel and axle"]],
["Physical Sciences","Simple machines","short","What is mechanical advantage?","The factor by which a machine multiplies force.",2],
["Physical Sciences","Simple machines","application","Explain how a longer ramp can make lifting an object easier.","It reduces the force required by increasing the distance over which the force is applied.",2],
["Science Inquiry","Science inquiry skills","mc","Which variable is deliberately changed in an investigation?","Independent variable",1,["Dependent variable","Independent variable","Controlled variable","Random variable"]],
["Science Inquiry","Science inquiry skills","short","Why should controlled variables be kept the same?","To make the investigation fair so changes in the dependent variable can be linked to the independent variable.",2],
["Science Inquiry","Science inquiry skills","application","A student repeats an experiment five times. Explain why this is useful.","Repeats improve reliability and help identify anomalous results; a mean can also be calculated.",2]
];
const $=id=>document.getElementById(id), uniq=a=>[...new Set(a)].sort();
function fill(){
 const strands=uniq(R.filter(r=>r.year==="Year 7").map(r=>r.strand).filter(Boolean)); $("strand").innerHTML='<option value="All">All strands</option>'+strands.map(x=>'<option>'+x+'</option>').join(""); updateTopics();
}
function updateTopics(){const s=$("strand").value;const ts=uniq(R.filter(r=>r.year==="Year 7"&&(s==="All"||r.strand===s)).map(r=>r.topic).filter(Boolean));$("topic").innerHTML='<option value="All">All topics</option>'+ts.map(x=>'<option>'+x+'</option>').join("");}
let current=[],show=false;
function sample(a,n){return [...a].sort(()=>Math.random()-.5).slice(0,n)}
function generate(){
 const s=$("strand").value,t=$("topic").value,n=Math.max(3,Math.min(30,+$("count").value||10));
 const types=[];if($("mc").checked)types.push("mc");if($("short").checked)types.push("short");if($("application").checked)types.push("application");
 let pool=bank.filter(q=>(s==="All"||q[0]===s)&&(t==="All"||q[1]===t)&&types.includes(q[2]));
 if(!pool.length){$("questions").innerHTML='<p>No questions are available for that combination yet. Try the whole strand or another topic.</p>';return}
 current=sample(pool,Math.min(n,pool.length));draw();
}
function draw(){let total=0;$("paperTitle").textContent=$("title").value||"Science Test";$("questions").innerHTML=current.map((q,i)=>{total+=q[5];const choices=q[6]?'<ol type="A">'+q[6].map(x=>'<li>'+x+'</li>').join("")+'</ol>':'';return '<div class="question"><div class="question-head"><strong>'+(i+1)+'. '+q[3]+'</strong><span class="marks">['+q[5]+' mark'+(q[5]>1?'s':'')+']</span></div>'+choices+'<div class="answer hidden-answer" style="display:'+(show?'block':'none')+'"><strong>Answer:</strong> '+q[4]+'</div><div class="source">'+q[0]+' › '+q[1]+'</div></div>'}).join("");$("totalMarks").textContent='Total: '+total+' marks';$("toggleAnswers").textContent=show?"Hide answers":"Show answers";}
$("strand").addEventListener("change",updateTopics);$("generate").onclick=generate;$("shuffle").onclick=generate;$("toggleAnswers").onclick=()=>{show=!show;draw()};fill();