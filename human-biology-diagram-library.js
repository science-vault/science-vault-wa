/* Supplementary teaching diagrams and end-of-lesson image credits. */
(function(root){'use strict';
const A=root.HBDiagramData.assets,M=root.HBDiagramData.lessons;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const prompts={action:'Identify resting potential, depolarisation, repolarisation and hyperpolarisation. Explain the roles of sodium and potassium channels.',neuron:'Follow the direction of information from dendrites to axon terminals. Relate each labelled structure to its function.',synapse:'Trace neurotransmitter release, diffusion, receptor binding and removal.',myelin:'Explain how myelin and the nodes of Ranvier affect impulse conduction.',glucose:'Trace both pathways. Explain why insulin and glucagon each contribute to negative feedback.',thyroid:'Follow TRH, TSH and thyroid hormones. Locate the points of negative feedback.',feedback:'Identify the stimulus, receptor, control centre and effector. Explain how the response opposes the change.',temperature:'Compare the responses when body temperature rises and when it falls.',meiosis:'Compare what separates in meiosis I with what separates in meiosis II.',crossing:'Identify the exchange between non-sister chromatids and explain its contribution to variation.',dna:'Identify the sugar–phosphate backbones, complementary bases and two antiparallel strands.',pcr:'Follow denaturation, primer annealing and extension. Explain why the cycle is repeated.',gel:'Compare fragment movement and band positions. Explain why smaller fragments usually travel further.',recombinant:'Trace the use of a vector, insertion of DNA and introduction into host cells.',antibody:'Identify variable regions and antigen-binding sites. Relate structure to specificity.',memory:'Compare the timing and magnitude of primary and secondary responses.',selection:'Compare how the distribution of phenotypes changes under different selection patterns.',homology:'Identify corresponding bones and explain how structural similarity can support common ancestry.',primates:'Read the branching pattern as relationships among lineages, rather than a ladder of progress.',skull:'Compare the cranial vault, forehead, jaw and facial projection without assuming that one feature alone identifies a species.',skeleton:'Compare limb proportions and posture. Relate skeletal features to locomotion.',method:'Follow the investigation process. Identify where a hypothesis is tested and where evidence may lead to revision.',nephron:'Trace the path of filtrate and distinguish it from the path of blood.',adh:'Explain how changing ADH secretion affects water reabsorption.',aquaporin:'Explain how water-channel availability changes the permeability of the collecting duct.'};
function figure(key){const a=A[key];return '<section class="hb-added-diagram"><h2>'+esc(a.title)+'</h2><figure><img src="'+esc(a.src)+'" alt="'+esc(a.title)+'" loading="eager" decoding="async"></figure><p>'+esc(prompts[key]||'Identify the labelled structures and explain their roles in the process shown. Connect the diagram to the preceding lesson content.')+'</p></section>';}
function credits(keys){return '<section class="hb-image-credits"><h2>Image references</h2><ol>'+[...new Set(keys)].map(k=>{const a=A[k];return '<li><strong>'+esc(a.title)+'</strong><br>'+esc(a.author)+' · <a href="'+esc(a.source)+'" target="_blank" rel="noopener">Source and image credit</a> · <a href="'+esc(a.licenseUrl)+'" target="_blank" rel="noopener">'+esc(a.license)+'</a><br><small>'+esc(a.changes)+'</small></li>';}).join('')+'</ol></section>';}
function buildDeck(lesson){
 const keys=M[lesson.id]||[],placements=new Map();
 keys.forEach((key,k)=>{
  const words=A[key].title.toLowerCase().match(/[a-z]{4,}/g)||[];let best=-1,index=Math.floor((k+1)*lesson.slides.length/(keys.length+1));
  lesson.slides.forEach((slide,i)=>{const text=(slide.title+' '+slide.text).toLowerCase();const score=words.filter(w=>text.includes(w)).length;if(score>best&&score>0){best=score;index=i;}});
  if(!placements.has(index))placements.set(index,[]);placements.get(index).push(key);
 });
 const deck=[];lesson.slides.forEach((slide,i)=>{
  lesson.readingPages[i].forEach((part,n)=>deck.push({type:'source',source:i,part:n,title:part.heading||slide.title||'Page '+(i+1)}));
  for(const key of placements.get(i)||[])deck.push({type:'diagram',key,title:A[key].title});
 });
 if(keys.length)deck.push({type:'references',keys,title:'Image references'});
 return deck;
}
async function paint(entry,stage){
 stage.innerHTML=entry.type==='references'?credits(entry.keys):figure(entry.key);
 const img=stage.querySelector('img');if(img){await new Promise((resolve,reject)=>{if(img.complete){img.naturalWidth?resolve():reject(Error('The diagram could not load.'));return;}img.onload=resolve;img.onerror=()=>reject(Error('The diagram could not load.'));});}
}
root.HBDiagramLibrary={buildDeck,paint,figure,credits};
})(window);
