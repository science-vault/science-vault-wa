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
const unit='Unit 3 – Homeostasis and disease';
const previous=window.Year12HumanBioTopics[unit]||{};
const existing=previous.topics||[];
window.Year12HumanBioTopics[unit]={...previous,title:unit,subtitle:'Year 12 Human Biology ATAR · Unit 3',topics:[...existing.filter(t=>!chemicalTopics.some(c=>c.id===t.id)),...chemicalTopics]};
})();