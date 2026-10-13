/* Complete Year 11 topic references reuse the three explicit scenario journeys. */
(function(){'use strict';const C=window.PhysicsScenarioCourse,F=window.PhysicsFocused;
const focused=C.registry.filter(s=>s.year===11&&/-focus-[123]$/.test(s.id));
if(focused.length!==72)throw new Error('Year 11 completion requires all 72 focused lessons.');
for(const parent of [...new Set(focused.map(s=>s.parent))]){
 const children=[1,2,3].map(n=>focused.find(s=>s.id===parent+'-focus-'+n));
 const info=F.parents[parent],pages=[],owners=[],chapters=[];
 children.forEach((child,c)=>{child.chapters.forEach(([name,description])=>chapters.push([child.shortTitle+' · '+name,description]));child.pages.forEach(page=>{pages.push({...page,chapter:page.chapter+c*4,title:child.shortTitle+' · '+page.title});owners.push(child);});});
 const first=children[0],last=children[2];
 C.register({id:parent,parent,title:'Full reference: '+info.topic.title,shortTitle:info.topic.title,subtitle:'The complete topic, with all three scenario journeys in one reference.',pages,chapters,bank:children.flatMap(s=>s.bank.slice(0,2)),practice:[first.practice[0],last.practice[1]],constants:first.constants,summary:children.map(s=>s.summary||s.subtitle).join(' '),focus:first.focus,wire(root){const owner=owners[Number(root.dataset.ppPage)];if(owner?.scenarioWire)owner.scenarioWire(root);}});
 // Complete references retain their existing links without becoming a fourth focused lesson.
 const group=F.sequences[info.year][info.unit].find(g=>g.parent.id===parent);group.lessons=group.lessons.filter(s=>s.id!==parent);
 F.lessons=F.lessons.filter(s=>s.id!==parent);
}
window.PhysicsYear11Rebuild={version:C.version,complete:true,focusedLessons:72,referenceTopics:24,sections:focused.reduce((n,s)=>n+s.pages.length,0),masteryQuestions:focused.reduce((n,s)=>n+s.bank.length,0),lessons:focused.map(s=>({id:s.id,sections:s.pages.length,diagrams:s.pages.filter(p=>p.html.includes('<svg')).length}))};
})();
