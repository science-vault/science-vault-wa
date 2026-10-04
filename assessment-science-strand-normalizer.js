// Adds a separate SCSA Science strand field to Years 7–10 Science question records.
// Topic remains the specific teaching topic; strand is one of the four Science Understanding strands.
(function(){
  const bank=window.AssessmentQuestionBank||[];
  const strandFrom=(q)=>{
    const s=((q.topic||'')+' '+(q.question||'')+' '+(q.id||'')).toLowerCase();
    // Biological Sciences
    if(/bio|cell|organ|body system|ecosystem|food chain|food web|classification|organism|reproduction|genetic|dna|inherit|adapt|evolution|microorgan|disease|photosynth|respiration/.test(s)) return 'Biological Sciences';
    // Chemical Sciences
    if(/chem|mixture|separat|particle|atom|element|compound|reaction|reactant|product|acid|base|ph|solution|solute|solvent|solub|precip|metal|periodic|matter|physical change|chemical change/.test(s)) return 'Chemical Sciences';
    // Earth and Space Sciences
    if(/earth|space|rock|mineral|geolog|plate|tectonic|volcano|earthquake|weather|climate|water cycle|season|moon|sun|planet|solar|star|universe|galaxy|resource|carbon cycle/.test(s)) return 'Earth and Space Sciences';
    // Physical Sciences
    if(/phys|force|motion|speed|velocity|acceleration|energy|heat|thermal|light|sound|wave|electric|circuit|magnet|machine|lever|inclined|gravity|friction|pressure/.test(s)) return 'Physical Sciences';
    return '';
  };
  for(const q of bank){
    const y=Number(q.year);
    if(y>=7&&y<=10){
      const strand=strandFrom(q);
      if(strand) q.strand=strand;
    }
  }
  window.ScienceStrandFromQuestion=strandFrom;
})();