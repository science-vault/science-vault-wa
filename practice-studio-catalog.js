/* Shared by Practice Studio and the assessment builder. Add new imported banks here. */
(function(root){
 const indices=['practice-studio-physics-index.json','practice-studio-physics-year11-index.json','practice-studio-human-biology-index.json','practice-studio-human-biology-year11-index.json','practice-studio-chemistry-year11-index.json','practice-studio-methods-year11-index.json','practice-studio-methods-year12-index.json','practice-studio-mathematics-lower-index.json','practice-studio-mathematics-data-index.json','practice-studio-mathematics-geometry-index.json','practice-studio-mathematics-measurement-index.json','practice-studio-mathematics-number-index.json'];
 const types={Mathematics:['Calculator-free','Calculator-assumed'],Physics:['Short answer','Calculations','Comprehension'],'Human Biology':['Multiple choice','Short answer','Extended answer'],Chemistry:['Multiple choice','Short answer','Extended answer'],'Mathematics Methods':['Calculator-free','Calculator-assumed']};
 function normalise(meta){
  if(meta.subject!=='Physics')return meta;
  const section=meta.sourceSection||meta.section||'';
  const category=/comprehension|extended response|section (?:three|3)/i.test(section)?'Comprehension':/problem solving|calculation|section (?:two|2)/i.test(section)?'Calculations':'Short answer';
  return {...meta,sourceSection:section,responseTypes:meta.responseTypes||meta.types,types:[category]};
 }
 const importDates=Object.fromEntries(['basic-algebra','further-algebra','equations-formulae','linear-relations'].map(slug=>['practice-studio-mathematics-'+slug+'.json','2026-10-30T11:53:15Z']));
 root.PracticeStudioCatalog={indices,types,normalise,importDates};
})(typeof window==='undefined'?globalThis:window);

