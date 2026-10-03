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
window.AssessmentBuilderConfig={version:'2026.6',bankRoot:'assessment-builder/question-banks',imageRoot:'assessment-builder/images',legacyScienceLoader:'assessment-question-bank.js'};
(function initialiseRegistry(){
  function populate(){
    var subject=document.getElementById('subject');
    var year=document.getElementById('year');
    var build=document.getElementById('build');
    if(!subject||!year) return false;
    subject.innerHTML=window.AssessmentBuilderSubjects.map(function(s){return '<option value="'+s.id+'">'+s.label+'</option>';}).join('');
    subject.value='science';
    year.innerHTML='<option value="7">Year 7</option><option value="8">Year 8</option><option value="9">Year 9</option><option value="10">Year 10</option>';
    year.disabled=false;
    if(build) build.disabled=false;
    return true;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',populate,{once:true}); else populate();
})();
window.addEventListener('load',function(){
  var subject=document.getElementById('subject');
  var year=document.getElementById('year');
  if(subject&&!subject.value){subject.innerHTML=window.AssessmentBuilderSubjects.map(function(s){return '<option value="'+s.id+'">'+s.label+'</option>';}).join('');subject.value='science';}
  if(year&&(year.disabled||!year.value)){year.innerHTML='<option value="7">Year 7</option><option value="8">Year 8</option><option value="9">Year 9</option><option value="10">Year 10</option>';year.disabled=false;}
  var s=document.createElement('script');s.src='assessment-builder-export-format.js?v=2026.6';document.body.appendChild(s);
});