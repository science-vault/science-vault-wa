// Upper School syllabus-version registry.
window.UpperSchoolSyllabusVersions={
  'Mathematics|Mathematics Applications|ATAR|12':[{id:'from-2025',label:'For teaching from 2025 (applies in 2026)',applicable2026:true},{id:'from-2027',label:'For teaching from 2027',future:true}],
  'Mathematics|Mathematics Methods|ATAR|12':[{id:'from-2026',label:'For teaching from 2026',applicable2026:true},{id:'from-2027',label:'For teaching from 2027',future:true}],
  'Mathematics|Mathematics Specialist|ATAR|12':[{id:'from-2025',label:'For teaching from 2025 (applies in 2026)',applicable2026:true},{id:'from-2027',label:'For teaching from 2027',future:true}],
  'Mathematics|Mathematics Essential|General|12':[{id:'from-2025',label:'For teaching from 2025 (applies in 2026)',applicable2026:true},{id:'from-2027',label:'For teaching from 2027',future:true}],
  'English|English|ATAR|12':[{id:'from-2025',label:'For teaching from 2025 (applies in 2026)',applicable2026:true},{id:'from-2027',label:'For teaching from 2027',future:true}],
  'English|English|General|12':[{id:'current-2026',label:'Current syllabus applicable in 2026',applicable2026:true},{id:'from-2027',label:'For teaching from 2027',future:true}],
  'English|English as an Additional Language or Dialect|ATAR|12':[{id:'from-2024',label:'For teaching from 2024 (applies in 2026)',applicable2026:true},{id:'from-2027',label:'For teaching from 2027',future:true}],
  'English|English as an Additional Language or Dialect|General|12':[{id:'from-2024',label:'For teaching from 2024 (applies in 2026)',applicable2026:true},{id:'from-2027',label:'For teaching from 2027',future:true}],
  'Science|Physics|ATAR|12':[{id:'teach-2026',label:'2026 SCSA Physics ATAR Year 12 syllabus',applicable2026:true}]
};
window.getUpperSchoolSyllabusVersions=function(area,course,pathway,year){const key=[area,course,pathway,String(year)].join('|');return window.UpperSchoolSyllabusVersions[key]||[{id:'current',label:'Current SCSA syllabus',applicable2026:true}]};
// Load the Physics-specific assessment rendering/filter enhancements after the builder's base scripts finish parsing.
if(typeof document!=='undefined'){const s=document.createElement('script');s.src='upper-school-physics-builder-enhancements.js?v=2026.10.3';s.async=true;document.head.appendChild(s);}