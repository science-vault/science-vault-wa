/* Detailed textbook additions, written independently of uploaded presentations. */
(function(root){'use strict';
root.HBTextbookExpand=function(id,sections,practice=[],tables=[],worked=[]){
 const m=root.HBFreshContent.find(m=>m.id===id);if(!m)throw Error('Missing textbook lesson '+id);
 m.sections.push(...sections);m.practice.push(...practice);m.tables=(m.tables||[]).concat(tables);m.workedMore=(m.workedMore||[]).concat(worked);
};
})(window);
