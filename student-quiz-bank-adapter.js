// Universal Student Quiz bank adapter.
// Normalises every question currently loaded from the Years 7–10 and Upper School banks.
// New questions automatically become available to Student Quiz when added to either central bank.
(function(){
  function lower(){
    return (window.AssessmentQuestionBank||[]).map((q,i)=>({
      ...q,
      id:q.id||`LOW-${q.year||'X'}-${i+1}`,
      level:'lower',
      course:q.course||q.subject||'Science',
      unit:q.unit||q.strand||'',
      strand:q.strand||q.unit||'',
      topic:q.topic||'',
      difficulty:q.difficulty||'Mixed',
      marks:Number(q.marks)||0
    }));
  }
  function upper(){
    return (window.UpperSchoolQuestionBank||[]).map((q,i)=>({
      ...q,
      id:q.id||`UP-${i+1}`,
      level:'upper',
      course:q.course||q.subject||q.area||'Upper School',
      unit:q.unit||q.strand||'',
      strand:q.strand||q.unit||'',
      topic:q.topic||'',
      difficulty:q.difficulty||'Mixed',
      marks:Number(q.marks)||0
    }));
  }
  window.getStudentQuizQuestionBank=function(){
    const seen=new Set();
    return [...lower(),...upper()].filter(q=>{
      const key=q.id||`${q.level}|${q.course}|${q.year}|${q.question}`;
      if(seen.has(key)) return false;
      seen.add(key); return true;
    });
  };
  window.StudentQuizSchema={
    version:'2026.1',
    required:['question','marks'],
    recommended:['id','course','year','unit','topic','type','difficulty','parts','partKeys','keyRows','diagram','keyDiagram','quizRules'],
    note:'Questions added to either central question bank are discovered automatically. quizRules improve rule-based marking but are not required for discovery.'
  };
})();