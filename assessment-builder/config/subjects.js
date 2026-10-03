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
  version: '2026.1',
  bankRoot: 'assessment-builder/question-banks',
  imageRoot: 'assessment-builder/images',
  legacyScienceLoader: 'assessment-question-bank.js'
};