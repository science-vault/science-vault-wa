/* Learning Vault WA LMS Topic Lesson Bank.
   Lessons are intentionally authored from repository teaching/curriculum material.
   Do not add generic fallback lesson content here.
   Key: YEAR|COURSE|UNIT_OR_STRAND|TOPIC
*/
window.TopicLessons = window.TopicLessons || {};
window.registerTopicLesson = function(meta, html){
  if(!meta || !html) return;
  const key=[meta.year,meta.course,meta.unit,meta.topic].join('|');
  window.TopicLessons[key]={...meta,html};
};
