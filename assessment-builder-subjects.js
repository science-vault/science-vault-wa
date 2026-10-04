// Central Assessment Builder registry.
window.AssessmentBuilderSubjects = [
  { id:'science', label:'Science', years:{
    '7':{label:'Year 7', legacy:true},
    '8':{label:'Year 8', legacy:true},
    '9':{label:'Year 9', legacy:true},
    '10':{label:'Year 10', legacy:true}
  }},
  { id:'english', label:'English', years:{} },
  { id:'mathematics', label:'Mathematics', years:{
    '7':{label:'Year 7',src:'assessment-builder/question-banks/mathematics/year7.js'},
    '8':{label:'Year 8',src:'assessment-builder/question-banks/mathematics/year8.js'},
    '9':{label:'Year 9',src:'assessment-builder/question-banks/mathematics/year9.js'},
    '10':{label:'Year 10',src:'assessment-builder/question-banks/mathematics/year10.js'}
  }},
  { id:'hass', label:'Humanities and Social Sciences', years:{} },
  { id:'health-pe', label:'Health and Physical Education', years:{} },
  { id:'technologies', label:'Technologies', years:{} },
  { id:'arts', label:'The Arts', years:{} },
  { id:'languages', label:'Languages', years:{} }
];
window.AssessmentBuilderConfig={version:'2026.7',bankRoot:'assessment-builder/question-banks',imageRoot:'assessment-builder/images',legacyScienceLoader:'assessment-question-bank.js'};
(function initialiseRegistry(){
  function populate(){
    var subject=document.getElementById('subject');
    var year=document.getElementById('year');
    var build=document.getElementById('build');
    if(!subject||!year) return false;
    subject.innerHTML=window.AssessmentBuilderSubjects.map(function(s){return '<option value="'+s.id+'">'+s.label+'</option>';}).join('');
    if(!subject.value) subject.value='science';
    var selected=window.AssessmentBuilderSubjects.find(function(s){return s.id===subject.value;})||window.AssessmentBuilderSubjects[0];
    var years=Object.keys(selected.years||{});
    year.innerHTML=years.map(function(y){return '<option value="'+y+'">Year '+y+'</option>';}).join('')||'<option value="">Coming soon</option>';
    year.disabled=!years.length;
    if(build) build.disabled=!years.length;
    return true;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',populate,{once:true}); else populate();
})();
window.addEventListener('load',function(){
  var s=document.createElement('script');s.src='assessment-builder-export-format.js?v=2026.7';document.body.appendChild(s);
});