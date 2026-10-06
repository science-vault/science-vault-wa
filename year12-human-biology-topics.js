/* Year 12 Human Biology ATAR — Chemical Messengers */
(function(){
window.Year12HumanBioTopics=window.Year12HumanBioTopics||{};
window.Year12HumanBioTopics['Scientific Inquiry Skills']={title:'Scientific Inquiry Skills',subtitle:'Year 12 Human Biology ATAR · inquiry and data analysis',topics:[{id:'inquiry-types',title:'Types of scientific investigations',description:'Observation, surveys, case studies, longitudinal studies and controlled experiments.'},{id:'inquiry-planning',title:'Scientific method and planning valid investigations',description:'Hypotheses, variables, validity, reliability, ethics and experimental design.'},{id:'inquiry-data',title:'Data, results and analysis',description:'Data types, statistical summaries, graphs and evidence-based conclusions.'}]};
const chemicalTopics=[
{id:'endocrine-intro',title:'Endocrine system & hormones',icon:'🧬',description:'Endocrine glands, hormones, receptors, target cells, saturation, clearance and negative feedback.'},
{id:'hormone-cell-action',title:'Hormone action at cells',icon:'🔑',description:'Protein/amine/peptide and steroid hormones, receptors, second messengers and enzyme amplification.'},
{id:'hypothalamus-pituitary',title:'Hypothalamus & pituitary',icon:'🧠',description:'Anterior and posterior pituitary pathways, releasing factors, hormones and ADH regulation.'},
{id:'growth-hormone',title:'Growth hormone',icon:'📈',description:'Production, actions, negative-feedback regulation, hypersecretion and deficiency.'},
{id:'thyroid',title:'Thyroid gland',icon:'🦋',description:'T3/T4, thyroxine regulation, metabolic effects, hyperthyroidism and hypothyroidism.'},
{id:'calcium-regulation',title:'Parathyroids & calcium regulation',icon:'🦴',description:'PTH and thyrocalcitonin in negative-feedback control of blood calcium.'},
{id:'adrenal',title:'Adrenal glands',icon:'⚡',description:'Aldosterone, cortisol, catecholamines, adrenal cortex/medulla and stress responses.'},
{id:'pancreas',title:'Pancreas: insulin & glucagon',icon:'🩸',description:'Blood-glucose homeostasis, insulin, glucagon, glycogen and diabetes mellitus.'},
{id:'other-endocrine',title:'Other endocrine organs',icon:'🌙',description:'Thymus, pineal gland, gonads and other hormone-secreting tissues.'},
{id:'recombinant-hormones',title:'Hormones & recombinant DNA',icon:'🧫',description:'Restriction enzymes, plasmids, ligase and production of synthetic insulin and growth hormone.'}
];
const nervousTopics=[
{id:'nervous-overview',title:'Nervous system overview & neurons',icon:'🧠',description:'CNS and PNS overview, neuron structure, myelin, neuron types, nerves and impulse transmission.'},
{id:'action-potentials',title:'Nerve impulses & action potentials',icon:'⚡',description:'Resting potential, depolarisation, repolarisation, refractory period, propagation and saltatory conduction.'},
{id:'synapses-neurotransmitters',title:'Synapses & neurotransmitters',icon:'🔗',description:'Synaptic transmission, excitatory and inhibitory neurotransmitters, NMJs and chemical effects.'},
{id:'pns-sensory',title:'PNS – sensory division & receptors',icon:'👁️',description:'Afferent pathways, receptors, proprioception, spinal nerves and sensory input.'},
{id:'pns-motor',title:'PNS – motor & autonomic divisions',icon:'🏃',description:'Somatic and autonomic pathways, sympathetic and parasympathetic control.'},
{id:'reflexes',title:'Reflexes & reflex arcs',icon:'↩️',description:'Reflex properties, reflex arc components, innate and acquired reflexes.'},
{id:'cns-brain',title:'CNS – the brain',icon:'🧠',description:'Cerebrum, cortex, lobes, functional areas and communication within the brain.'},
{id:'cns-other',title:'CNS – other structures & spinal cord',icon:'🧩',description:'Corpus callosum, cerebellum, hypothalamus, medulla oblongata and spinal cord.'},
{id:'cns-protection',title:'CNS protection',icon:'🛡️',description:'Cranium, vertebral column, meninges, cerebrospinal fluid and blood-brain barrier.'},
{id:'nervous-endocrine-compare',title:'Nervous vs endocrine control',icon:'⚖️',description:'Compare speed, duration, message transmission and specificity.'},
{id:'nervous-disease',title:'Nervous system diseases & treatments',icon:'🧬',description:'Huntington’s, Parkinson’s and Alzheimer’s disease, gene therapy and cell replacement therapy.'}
];
const homeostasisTopics=[
{id:'homeostasis-foundations',title:'Homeostasis & feedback loops',icon:'⚖️',description:'Steady state, dynamic equilibrium, tolerance limits, set points and feedback-loop components.'},
{id:'thermoregulation-cold',title:'Thermoregulation – heat balance & cold responses',icon:'🥶',description:'Heat gain/loss, thermoreceptors, control centres, effectors and responses below set point.'},
{id:'thermoregulation-hot',title:'Thermoregulation – heat responses & fever',icon:'🌡️',description:'Vasodilation, sweating, behavioural responses, tolerance limits, hyperthermia and fever.'},
{id:'fluid-homeostasis',title:'Body fluid homeostasis',icon:'💧',description:'Fluid compartments, kidneys, osmotic pressure, ADH, aldosterone, thirst and water imbalance.'},
{id:'glucose-homeostasis',title:'Blood glucose homeostasis',icon:'🩸',description:'Insulin, glucagon, liver, glycogenesis, glycogenolysis and negative feedback.'},
{id:'blood-gas-homeostasis',title:'Blood gas homeostasis',icon:'🫁',description:'CO₂, pH, chemoreceptors, medulla, respiratory muscles and breathing-rate feedback.'},
{id:'cardiovascular-homeostasis',title:'Heart rate & blood pressure regulation',icon:'❤️',description:'Cardiac output, baroreceptors, autonomic control, vessel diameter and exercise responses.'},
{id:'homeostasis-disruptions',title:'Disruptions to homeostasis & biotechnology',icon:'⚠️',description:'Diabetes, thyroid/GH imbalance, emphysema, hypertension, nervous-system disease and biotechnology treatments.'}
];
const immuneTopics=[
{id:'immune-external',title:'Pathogens & external defences',icon:'🛡️',description:'Pathogens, transmission, skin, mucous membranes, respiratory/digestive/urogenital barriers, eyes, ears and protective reflexes.'},
{id:'immune-nonspecific',title:'Internal non-specific defences',icon:'🔥',description:'Natural killer cells, phagocytosis, inflammation, fever and the lymphatic system.'},
{id:'immune-specific',title:'Specific immunity – B cells, T cells & memory',icon:'🧬',description:'Antigens, APCs, humoral and cell-mediated immunity, antibodies and primary/secondary responses.'},
{id:'immune-vaccines',title:'Vaccination, boosters & herd immunity',icon:'💉',description:'Vaccines, immune memory, boosters, benefits/risks, vaccination programs and herd immunity.'},
{id:'immune-types',title:'Active, passive, natural & artificial immunity',icon:'🔄',description:'Four types of acquired immunity, antibody transfer, vaccination, infection and memory cells.'},
{id:'immune-antimicrobials',title:'Antibiotics, antivirals & resistance',icon:'💊',description:'Antibiotic/antiviral specificity, bactericidal/bacteriostatic action, culture and sensitivity and resistance.'}
];
const unit='Unit 3 – Homeostasis and disease';
const previous=window.Year12HumanBioTopics[unit]||{};
const existing=previous.topics||[];
window.Year12HumanBioTopics[unit]={...previous,title:unit,subtitle:'Year 12 Human Biology ATAR · Unit 3',topics:[...existing.filter(t=>!chemicalTopics.some(c=>c.id===t.id)&&!nervousTopics.some(n=>n.id===t.id)&&!homeostasisTopics.some(h=>h.id===t.id)&&!immuneTopics.some(i=>i.id===t.id)),...chemicalTopics,...nervousTopics,...homeostasisTopics,...immuneTopics]};
})();