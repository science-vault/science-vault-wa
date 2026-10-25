/* Shared browsing categories. Original topic metadata remains unchanged for saved tasks. */
(function(){
 const cache=new WeakMap();
 const groups={
 'Physics':[
  ['Relativity',/relativ|time dilation|length contraction/],['Quantum and particle physics',/modern physics|quantum|photon|photoelectric|black.body|wien|de broglie|wave.particle|standard model|quark|particle physics|atomic energy|spectroscopy|fluorescence/],
  ['Space and cosmology',/big bang|cosmolog|hubble|expansion|universe/],['Electricity and magnetism',/electric|magnet|electrostat|millikan|circuit|resistan|resistiv|charge|coulomb|emf|motor|generator|transformer|transmission|conduct|current|rcd/],
  ['Thermal and nuclear physics',/thermal|heat|cooling|temperature|convection|condensation|phase|nuclear|radioact|binding energy|fusion|fission|mass defect/],['Waves',/wave|interference|polarisation|sound|oscillat/],
  ['Mechanics',/motion|force|energy|gravit|orbit|satellite|torque|equilibrium|moment|friction|pendulum|projectile|incline|power/],['Science inquiry and measurement',/investigat|measurement|uncertainty|units|conversion|comprehension/]],
 'Chemistry':[
  ['Acids and bases',/acid|base|buffer|titration|neutralis|water ionisation|hydrogen ion|\bpH\b|\bKa\b/],['Redox and electrochemistry',/redox|electrochem|galvanic|electroly|electron transfer|oxidising|reducing agent|electrorefin|oxidation state|corrosion|reduction potential|battery|salt bridge|fuel cell/],
  ['Equilibrium and reaction rates',/equilib|le chatelier|reversib|haber|contact process|ostwald|collision|activation|reaction rate|catalyst|catalytic/],['Organic chemistry',/organic|hydrocarbon|polymer|protein|amino|peptide|soap|detergent|isomer|alcohol|biodiesel|biofuel|ester|synthesis|nomenclature/],
  ['Atomic structure and bonding',/atomic|atom|isotope|spectr|electron configuration|periodic|bond|allotrope|ion|formula|molecular shape|intermolecular|lewis|nanomaterial|nanopart|nanotechn/],
  ['Chemical calculations and energy',/mole|stoich|heating curve|phase change|enthalpy|calorim|energy|thermochem|gas law|kinetic theory|empirical|composition|yield|chemical calculation|fuel/],['Materials, solutions and reactions',/mixture|separat|chromatograph|solub|solution|precipitat|water treatment|environment|chemical reaction|chemical equation|physical.*change|green chemistry/],['Science inquiry',/investigat|measure|error|data|graph/]],
 'Human Biology':[
  ['Coordination and homeostasis',/homeostas|nerv|neuron|endocrine|hormon|diabet|brain|hypothalam|parkinson|glycogen|glucose|adrenal|action potential|reflex|ADH|aldosterone|thermoregul|water balance|breathing control/],
  ['Disease and immunity',/disease|immun|fever|antibod|phagocyt|vaccin|antibiotic|pathogen/],['Human evolution',/evol|homin|primate|fossil|dating|biped|brachiat|oldowan|tool culture|stratigraph/],
  ['Genetics and biotechnology',/genetic|DNA|PCR|biotechn|mutation|selection|speciat|founder|gene|recombinant|electrophor/],['Cells and body systems',/cell|transport|body system|respirat|circulat|digest|reproduct/],['Science inquiry',/inquiry|ethic|investigat|graph|variable/]],
 'Biology':[['Genetics and biotechnology',/DNA|gene|biotechn|mutation|genetic/],['Evolution',/evol|speciat|selection/],['Cells and organisms',/cell|organism|homeostas/],['Ecology',/ecosystem|ecolog|population|biodivers/],['Science inquiry',/inquiry|investigat/]],
 'Psychology':[['Research methods',/research|inquiry|experiment|ethic|data/],['Biological psychology',/brain|neuron|nervous|biolog/],['Learning and cognition',/learn|memory|cognit|condition|percept/],['Social and developmental psychology',/social|develop|attitud|personality/]],
 'Mathematics Applications':[['Finance',/consumer|financ|loan|annuit|repayment|interest|investment|deprecia|perpetuit/],['Networks and matrices',/network|matrix|matrices|graph theory|spanning|flow|critical path|hamilton|euler|adjacency|route|project schedul/],['Sequences, growth and decay',/sequence|growth|decay|recursive|recurrence|arithmetic|geometric|recur/],['Statistics',/data|statistic|regress|correlat|time.series|moving average|seasonal|bivariate|univariate/],['Measurement and trigonometry',/shape|measure|trigonom|triangle|bearing|sine rule|cosine rule|area|volume/]],
 'Mathematics Methods':[['Calculus',/calculus|differentiat|derivative|integrat|antideriv|rate of change|stationary|gradient|tangent|area under/],['Probability and statistics',/probab|binomial|normal distribut|random variable|sample|confidence interval|standard deviation|distribution|statistic/],['Functions and algebra',/function|algebra|polynomial|exponent|logarithm|trigonom|sine|cosine|equation|transformation|quadratic/]],
 'Mathematics Specialist':[['Vectors and geometry',/vector|scalar|dot product|cross product|position vector|perpendicular|geometr/],['Complex numbers',/complex|argand|imaginary|de moivre|modulus|argument|roots of unity/],['Calculus',/calculus|differentiat|derivative|integrat|differential|rate of change|kinematic|volume of revolut/],['Functions, algebra and matrices',/function|algebra|matrix|matrices|proof|polynomial|trigonom|logarithm/],['Probability and statistics',/probab|normal distribut|random|sample|confidence interval|standard deviation|distribution|statistic/]],
 'Mathematics Essential':[['Number and finance',/calculat|percent|rate|financ|number/],['Measurement and geometry',/measure|geometr/],['Graphs and statistics',/graph|statistic|data/]],
 'English':[['Reading and analysis',/comprehend|compar|convention|stylist|represent|perspect|position|language|text.*purpose/],['Writing and composition',/creat|compos|writ/]],
 'Geography':[['Hazards and ecosystems',/hazard|ecolog/],['Global connections',/global|network|interconnect/],['Geographical inquiry',/inquiry|skill/]],
 'Business Management and Enterprise':[['Business foundations',/concept|environment/],['Business management and growth',/growth|management/]],
 'Modern History':[['Historical inquiry',/inquiry|source/],['Historical interpretation',/perspective|argument/]],
 'Health Studies':[['Health and wellbeing',/dimension|determinant|personal|influence/],['Health promotion',/promotion/],['Health inquiry',/inquiry/]],
 'Physical Education Studies':[['Body systems and biomechanics',/anatomy|biomechan/],['Training and performance',/train|fitness/],['Motor learning and coaching',/motor|coach/]],
 'Materials Design and Technology':[['Materials',/material/],['Design and production',/design|production|evaluat/]],
 'Design':[['Design foundations',/fundamental|audience|purpose/],['Design development',/develop/]],
 'Media Production and Analysis':[['Media analysis',/language|represent|audience/]],
 'Visual Arts':[['Art analysis',/language|interpret/],['Art practice',/practice/]],
 'English as an Additional Language or Dialect':[['Listening',/listen/],['Reading and viewing',/reading|viewing/],['Writing',/writing/]],
 'Philosophy and Ethics':[['Critical reasoning',/reason/],['Philosophical analysis',/analysis|evaluat/],['Argument',/argument/]]
 };
 // Patterns for examination-only maths records; detail is based on searchable original text.
 const details={
 'Finance':[['Loans and repayments',/loan|mortgage|repayment/],['Annuities and investments',/annuit|investment|perpetuit/],['Interest and depreciation',/interest|deprecia/]],
 'Networks and matrices':[['Critical paths and project scheduling',/critical path|project|earliest|latest|float time/],['Network flows',/flow|capacity|capacities|minimum cut/],['Spanning trees',/spanning|minimum.*tree/],['Routes and paths',/hamilton|euler|route|path|circuit/],['Matrices',/matrix|matrices|adjacency/]],
 'Sequences, growth and decay':[['Arithmetic and geometric sequences',/arithmetic|geometric/],['Recurrence relations',/recursive|recurrence|recur/],['Growth and decay models',/growth|decay|population/]],
 'Statistics':[['Time series',/seasonal|time.series|moving average/],['Bivariate data and regression',/regress|correlat|bivariate|scatter|least.squares/],['Univariate data',/univariate|median|quartile|box.plot|standard deviation|histogram/]],
 'Calculus':[['Integration',/integrat|antideriv|area under|definite integral/],['Differential equations',/differential equation/],['Differentiation and applications',/differentiat|derivative|stationary|gradient|tangent|rate of change/]],
 'Probability and statistics':[['Statistical inference',/confidence interval|sample proportion|sample mean/],['Normal distributions',/normal distribut|standard deviation/],['Binomial distributions',/binomial/],['Random variables and probability',/random|probab|distribution/]],
 'Functions and algebra':[['Trigonometric functions',/trigonom|sine|cosine|sin\b|cos\b/],['Exponential and logarithmic functions',/exponent|logarithm/],['Polynomials and functions',/polynomial|function|quadratic|transformation/]],
 'Vectors and geometry':[['Vector products',/dot product|cross product|scalar product/],['Vector lines and planes',/vector.*line|vector.*plane|plane|position vector/],['Vector geometry',/vector|perpendicular|geometr/]],
 'Complex numbers':[['Complex numbers and Argand diagrams',/complex|argand|imaginary|modulus|argument/]],
 'Functions, algebra and matrices':[['Matrices',/matrix|matrices/],['Functions and algebra',/function|polynomial|proof|algebra|trigonom/]]
 };
 const generic=/^(?:section\b|units? [1-4]|calculator (?:assumed|free)|examination|exam questions|mixed.topic)/i;
 const clean=s=>String(s||'').replace(/[–—]/g,'-').trim();
 function classify(q){if(q.studioSourceId)return{topic:q.topic,subtopic:q.subtopic,originalTopic:q.topic,inferred:false};if(cache.has(q))return cache.get(q);const original=clean(q.topic),course=clean(q.course||q.subject||q.area);let topic='',subtopic=clean(q.subtopic)||original||'General questions',inferred=false;
  if(course.toLowerCase()==='science'&&q.strand)topic=clean(q.strand);
  else if(course.toLowerCase()==='mathematics'&&q.strand)topic=clean(q.strand);
  else {const rules=groups[course]||[],g=rules.find(([,r])=>new RegExp(r.source,'i').test(original));if(g&&!generic.test(original))topic=g[0];
   if(!topic&&course.startsWith('Mathematics')&&generic.test(original)){
    const text=clean(q.searchText).replace(/\bCALCULATOR[- ](?:ASSUMED|FREE)\b/gi,'');
    const hits=rules.map(([name,r])=>({name,count:(text.match(new RegExp(r.source,'gi'))||[]).length})).filter(x=>x.count>0).sort((a,b)=>b.count-a.count);
    if(hits.length&&!(hits[1]&&hits[0].count===hits[1].count)){topic=hits[0].name;subtopic=(details[topic]||[]).find(([,r])=>new RegExp(r.source,'i').test(text))?.[0]||topic;inferred=true;}
   }
   if(!topic)topic=generic.test(original)?'Mixed-topic examination questions':rules.length?'Other subject content':original||'General questions';
  }
  const result={topic,subtopic,originalTopic:original,inferred};cache.set(q,result);return result;
 }
 function values(records,key){return [...new Set(records.flatMap(q=>q.studioSourceId?(key==='topic'?[...(q.topics||[]),...(q.mixed?['Mixed topics']:[])]:q.subtopics||[]):[classify(q)[key]]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));}
 function fill(select,items,label,preserve=false){const previous=select.value;select.replaceChildren(new Option('All '+label,'all'),...items.map(x=>new Option(x,x)));select.value=preserve&&items.includes(previous)?previous:'all';}
 function matches(q,topic='all',subtopic='all'){if(q.studioSourceId)return(topic==='all'||topic==='Mixed topics'&&q.mixed||(q.topics||[]).includes(topic))&&(subtopic==='all'||(q.subtopics||[]).includes(subtopic));const c=classify(q);return(topic==='all'||c.topic===topic)&&(subtopic==='all'||c.subtopic===subtopic);}
 function label(q){if(q.studioSourceId)return[...(q.topics||[]),...(q.subtopics||[])].join(' • ');const c=classify(q);return c.topic+(c.subtopic!==c.topic?' • '+c.subtopic:'');}
 window.QuestionBankCategories={classify,values,fill,matches,label};
})();