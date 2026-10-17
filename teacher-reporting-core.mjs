// Reporting helpers operate only on class data already authorised by Firestore rules.
export function studentSummary(student, results, tasks=[]){
 const attempts=results.filter(r=>r.studentUid===student.studentUid);
 const graded=attempts.filter(r=>Number.isFinite(Number(r.max))&&Number(r.max)>0&&Number.isFinite(Number(r.earned)));
 const earned=graded.reduce((s,r)=>s+Number(r.earned),0);
 const possible=graded.reduce((s,r)=>s+Number(r.max),0);
 const completed=new Set(attempts.filter(r=>r.taskId&&r.selfReported===true||r.taskId&&Number(r.max)>0&&Number(r.earned)>=Number(r.max)).map(r=>r.taskId));
 const last=attempts.reduce((max,r)=>Math.max(max,r.createdAt?.toMillis?.()||0),0);
 return {name:student.displayName||'Student',year:student.yearGroup||'',attempts:attempts.length,earned,possible,percentage:possible?Math.round(100*earned/possible):null,completed:completed.size,assigned:tasks.length,lastActivity:last||null};
}
export function classSummary(students,results,tasks=[]){
 const rows=students.map(s=>studentSummary(s,results,tasks));
 return {rows,students:rows.length,attempts:results.length,activeStudents:rows.filter(r=>r.attempts>0).length,gradedStudents:rows.filter(r=>r.percentage!==null).length,meanPercent:rows.some(r=>r.percentage!==null)?Math.round(rows.filter(r=>r.percentage!==null).reduce((n,r)=>n+r.percentage,0)/rows.filter(r=>r.percentage!==null).length):null};
}
export function csvCell(value){
 const text=String(value??'');
 // Avoid spreadsheet formula injection when exported student-entered values are opened in Excel.
 const safe=/^[\s]*[=+@-]/.test(text)?"'"+text:text;
 return '"'+safe.replace(/"/g,'""')+'"';
}
export function reportCsv(summary){
 const header=['Student','Year','Saved attempts','Auto marks earned','Auto marks possible','Auto marks %','Assigned task completions','Last submitted activity'];
 const rows=summary.rows.map(r=>[r.name,r.year,r.attempts,r.earned,r.possible,r.percentage??'',r.completed,r.lastActivity?new Date(r.lastActivity).toISOString():'']);
 return [header,...rows].map(row=>row.map(csvCell).join(',')).join('\r\n')+'\r\n';
}
