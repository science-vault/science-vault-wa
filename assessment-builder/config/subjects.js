// Central Assessment Builder registry.
// Banks are lazy-loaded. Add a bank path only when that subject/year bank exists.
window.AssessmentBuilderSubjects = [
  { id:'science', label:'Science', years:{
    '7':{label:'Year 7', legacy:true},
    '8':{label:'Year 8', legacy:true},
    '9':{label:'Year 9', legacy:true},
    '10':{label:'Year 10', legacy:true}
  }},
  { id:'english', label:'English', years:{} },
  { id:'mathematics', label:'Mathematics', years:{} },
  { id:'hass', label:'Humanities and Social Sciences', years:{} },
  { id:'health-pe', label:'Health and Physical Education', years:{} },
  { id:'technologies', label:'Technologies', years:{} },
  { id:'arts', label:'The Arts', years:{} },
  { id:'languages', label:'Languages', years:{} }
];

window.AssessmentBuilderConfig = {
  version: '2026.3',
  bankRoot: 'assessment-builder/question-banks',
  imageRoot: 'assessment-builder/images',
  legacyScienceLoader: 'assessment-question-bank.js'
};

// Initialise the subject/year selector after all page scripts have loaded.
// This also repairs cached/deployed pages where the subject select is blank.
window.addEventListener('load', function(){
  const subject=document.getElementById('subject');
  const year=document.getElementById('year');
  if(subject && (!subject.options.length || !subject.value)){
    subject.innerHTML=window.AssessmentBuilderSubjects.map(function(s){
      return '<option value="'+s.id+'">'+s.label+'</option>';
    }).join('');
    subject.value='science';
  }
  if(subject && subject.value==='science' && year && (!year.options.length || year.disabled)){
    year.innerHTML=['7','8','9','10'].map(function(y){return '<option value="'+y+'">Year '+y+'</option>';}).join('');
    year.disabled=false;
    const build=document.getElementById('build'); if(build) build.disabled=false;
  }
  // Re-run the page's normal population/loading logic where available.
  if(typeof populateYears==='function') populateYears();

  const s=document.createElement('script');
  s.src='assessment-builder/js/export-format.js?v=2026.3';
  document.body.appendChild(s);
});