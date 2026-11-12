/* Authored lessons, expanded teaching and final-page image references. */
(function(root){'use strict';
const data=root.HBAuthoredDepthData,library=root.HBDiagramLibrary;
function clean(text){return String(text||'').replace(/<figcaption[^>]*>[\s\S]*?(?:Original PowerPoint|supplied PowerPoint)[\s\S]*?<\/figcaption>/gi,'').replace(/Original PowerPoint(?: visual)?(?:\s*·\s*slide\s*\d+)?/gi,'Teaching diagram').replace(/Original scientific-method flowchart from the supplied PowerPoint\./gi,'Scientific-method flowchart.').replace(/the supplied (?:presentation|PPT|material|example|lesson|PowerPoint)/gi,'this lesson').replace(/the presentation describes/gi,'Clinical features include').replace(/the supplied PPT also notes/gi,'This disorder can involve').replace(/supplied teaching materials/gi,'lesson materials');}
for(const m of root.HumanBiologyATAR.filter(m=>String(m.year)==='12')){
 const original=m.screens.filter(s=>s.kind!=='sources'&&!/hb-source-slide/.test(s.html||'')).map(s=>({...s,...(s.html?{html:clean(s.html)}:{}),...(s.text?{text:clean(s.text)}:{})}));
 const depth=(data.depth[m.id]||[]).flatMap(s=>{
  const pages=s.html?[{kind:'reference',title:s.title,html:s.html}]:[];
  if(s.diagram&&root.HBUnit4Diagrams?.render){try{const html=root.HBUnit4Diagrams.render(s.diagram);if(html)pages.push({kind:'reference',title:s.title+' · diagram',html});}catch(e){console.warn('Diagram unavailable',m.id,s.title);}}
  return pages;
 });
 const keys=data.images[m.id]||[],pictures=keys.map(key=>({kind:'reference',title:'Diagram study',html:library.figure(key),diagramStudy:true}));
 let split=original.findIndex(s=>['question','solution','check','mastery'].includes(s.kind));if(split<0)split=original.length;
 const teaching=original.slice(0,split),practice=original.slice(split);
 const expanded=[...teaching,...depth];
 pictures.forEach((p,i)=>expanded.splice(Math.floor((i+1)*expanded.length/(pictures.length+1)),0,p));
 m.screens=[...expanded,...practice,{kind:'sources',title:'Image references',html:library.credits(keys)+'<p>Curriculum: <a href="'+data.syllabusSources[0]+'" target="_blank" rel="noopener">SCSA Human Biology ATAR Year 12 syllabus</a>.</p>'}];
 m.autoAdvance=true;m.authoredLesson=true;
 m.subtitle='Detailed teaching · diagrams · worked examples · written practice';
}
})(window);
