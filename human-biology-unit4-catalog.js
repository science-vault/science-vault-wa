/* Replacement PowerPoint lessons, 12 November 2026. */
(function(root){"use strict";
const chapters=[{"id":"hb-upload-pcr-and-gel-electrophoresis","title":"PCR and gel electrophoresis","year":"12","unit":"Unit 4 – Human variation and evolution","scope":"Explain DNA amplification and interpret separation of DNA fragments by size.","subtitle":"32 pages · original diagrams · written practice","screens":[],"questions":[],"bank":[],"uploadLesson":"hb-upload-pcr-and-gel-electrophoresis.json","icon":"🧬"},{"id":"hb-upload-dna-sequencing-and-mapping","title":"DNA sequencing and mapping","year":"12","unit":"Unit 4 – Human variation and evolution","scope":"Distinguish the order of DNA bases from the relative positions of DNA markers.","subtitle":"31 pages · original diagrams · written practice","screens":[],"questions":[],"bank":[],"uploadLesson":"hb-upload-dna-sequencing-and-mapping.json","icon":"🧬"}];
root.HumanBiologyATAR=(root.HumanBiologyATAR||[]).filter(l=>!(String(l.year)==="12"&&String(l.unit).startsWith("Unit 4"))).concat(chapters);
root.HBUnit4Catalog={chapters,resolve:key=>key};
})(window);
