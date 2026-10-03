// Central Assessment Builder registry.
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
  version: '2026.4',
  bankRoot: 'assessment-builder/question-banks',
  imageRoot: 'assessment-builder/images',
  legacyScienceLoader: 'assessment-question-bank.js'
};

// assessment-builder.html defines its functions after this file is parsed.
// Queue initialisation so populateSubjects() exists before it is called.
setTimeout(function initialiseAssessmentBuilder(){
  try {
    if (typeof populateSubjects === 'function') {
      populateSubjects();
    } else {
      const subject=document.getElementById('subject');
      const year=document.getElementById('year');
      if(subject){
        subject.innerHTML=window.AssessmentBuilderSubjects.map(function(s){return '<option value="'+s.id+'">'+s.label+'</option>';}).join('');
        subject.value='science';
      }
      if(year){
        year.innerHTML='<option value="7">Year 7</option><option value="8">Year 8</option><option value="9">Year 9</option><option value="10">Year 10</option>';
        year.disabled=false;
      }
      const build=document.getElementById('build');
      if(build) build.disabled=false;
    }
  } catch(e) {
    console.error('Assessment Builder initialisation failed',e);
  }
},0);

window.addEventListener('load', function(){
  // Second pass in case another script or cached page reset the controls.
  const subject=document.getElementById('subject');
  if(subject && !subject.value && typeof populateSubjects==='function') populateSubjects();

  const s=document.createElement('script');
  s.src='assessment-builder/js/export-format.js?v=2026.4';
  document.body.appendChild(s);
});