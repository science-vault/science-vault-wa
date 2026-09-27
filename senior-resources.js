// Senior pages use the same manifest index as the rest of Learning Vault WA.
(function(){
 const OUT=window.SENIOR_RESOURCES||(window.SENIOR_RESOURCES=[]);
 const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 const ALIASES={
  'Human Biology|ATAR|4':[
   ['Human evolution',['human evolution','hominid evolution','hominin evolution','hominid','hominin','hominids','hominins','primate evolution','human origins','evolution of humans','fossil hominin','fossil hominid']],
   ['Population genetics',['population genetics','gene pool','allele frequency','genetic drift','founder effect','bottleneck']],
   ['Human variation and evolution',['human variation','variation in humans','variation and evolution']],
   ['Applications of human biological knowledge',['dna profiling','genetic screening','biotechnology','pcr','gene technology']]
  ],
  'Human Biology|ATAR|3':[
   ['Coordination and regulation',['nervous system','neuron','brain','synapse','endocrine','hormone','thermoregulation','osmoregulation','homeostasis']],
   ['Immune responses and disease',['immune','immunity','antibody','pathogen','vaccination','disease']],
   ['Human biology investigations',['investigation','experimental design','research','validity','reliability']]
  ],
  'Human Biology|ATAR|2':[
   ['Human reproduction',['reproduction','reproductive','menstrual','fertilisation','fertilization','pregnancy','embryo','contraception']],
   ['DNA, genes and inheritance',['dna','gene','chromosome','meiosis','inheritance','pedigree','mutation']],
   ['Human variation',['human variation','variation']]
  ],
  'Human Biology|ATAR|1':[
   ['Cells and tissues',['cell','cells','tissue','organelle','membrane']],
   ['Metabolism and body systems',['metabolism','enzyme','digestive','respiratory','circulatory','cardiovascular','excretory','urinary','musculoskeletal']],
   ['Science inquiry in human biology',['investigation','experimental design','research','data']]
  ],
  'Biology|ATAR|3':[
   ['Evolutionary processes',['evolution','natural selection','speciation','selection pressure']],
   ['DNA, genes and inheritance',['dna','gene','chromosome','replication','protein synthesis','mutation','inheritance']],
   ['Reproduction and population genetics',['reproduction','meiosis','population genetics','gene pool','allele frequency']]
  ],
  'Biology|ATAR|4':[
   ['Homeostasis and disease',['homeostasis','disease','pathogen','immune','immunity']],
   ['Population change and environmental pressures',['population change','environmental pressure','climate change','human impact']],
   ['Biological responses and applications',['biological response','biotechnology','application']]
  ],
  'Physics|ATAR|4':[
   ['Special relativity',['special relativity','time dilation','length contraction','relativity']],
   ['Quantum physics',['quantum','photoelectric','photon']],
   ['Wave-particle duality and cosmology',['wave particle','wave-particle','de broglie','cosmology','big bang','redshift','universe']]
  ],
  'Chemistry|ATAR|3':[
   ['Chemical equilibrium',['equilibrium','le chatelier','equilibrium constant']],
   ['Acids, bases and buffers',['acid','base','buffer','ph','poh','titration']],
   ['Oxidation-reduction and electrochemistry',['redox','oxidation','reduction','galvanic','electrolysis','electrode','corrosion']]
  ],
  'Chemistry|ATAR|4':[
   ['Structure and reactions of organic compounds',['organic','hydrocarbon','alkane','alkene','alcohol','aldehyde','ketone','carboxylic','ester','amine','amide','functional group','isomer']],
   ['Chemical synthesis and analysis',['synthesis','atom economy','green chemistry','analysis']],
   ['Applications of chemistry',['polymer','polymerisation','industrial','application']]
  ]
 };
 function hay(r){return norm([r.title,r.description,r.file,...(r.keywords||[])].join(' '))}
 function inferUnit(r){
  if(r.unit)return r.unit;
  const allowed=r.year==='Year 11'?[1,2]:r.year==='Year 12'?[3,4]:[];if(!allowed.length)return'';
  const content=(window.SENIOR_CONTENT&&window.SENIOR_CONTENT[r.course+'|'+r.pathway])||{},h=hay(r);let best=allowed[0],bestScore=0;
  for(const u of allowed){let score=0;for(const phrase of(content[u]||[]))for(const w of norm(phrase).split(' ').filter(w=>w.length>4))if(h.includes(w))score++;for(const [,keys] of(ALIASES[r.course+'|'+r.pathway+'|'+u]||[]))for(const k of keys)if(h.includes(norm(k)))score+=norm(k).includes(' ')?6:3;if(score>bestScore){bestScore=score;best=u}}
  return'Unit '+best;
 }
 function inferTopic(r){
  const u=Number(String(r.unit||'').replace(/\D/g,'')),topics=((window.SENIOR_CONTENT&&window.SENIOR_CONTENT[r.course+'|'+r.pathway])||{})[u]||[],h=hay(r),aliases=ALIASES[r.course+'|'+r.pathway+'|'+u]||[];
  let best='',score=0;
  for(const [target,keys] of aliases){let s=0;for(const k of keys)if(h.includes(norm(k)))s+=norm(k).includes(' ')?12:5;if(s>score&&topics.includes(target)){score=s;best=target}}
  if(score)return best;
  for(const t of topics){const words=norm(t).split(' ').filter(w=>w.length>4),s=words.reduce((n,w)=>n+(h.includes(w)?1:0),0);if(s>score){score=s;best=t}}
  return score?best:'';
 }
 function sync(){const src=window.SCIENCE_VAULT_RESOURCES||[],rows=src.filter(r=>r.pathway&&r.course).map(r=>{const x={...r};x.unit=inferUnit(x);x.topic=inferTopic(x);return x});OUT.splice(0,OUT.length,...rows);window.dispatchEvent(new CustomEvent('senior-resources-ready',{detail:{count:OUT.length}}))}
 if(window.SCIENCE_VAULT_REPO_INDEX_READY)sync();else window.addEventListener('science-vault-resources-ready',sync,{once:true});
})();