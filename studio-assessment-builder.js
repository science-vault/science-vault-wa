/* Keep the upper-school builder on Studio's shared bank for supported courses. */
(function(){
 const bank=window.StudioAssessmentBank;
 const note=document.createElement('section');note.className='notice';note.id='studioBuilderStatus';note.setAttribute('role','status');
 const retry=document.createElement('button');retry.type='button';retry.textContent='Retry loading';retry.className='btn';retry.hidden=true;
 const text=document.createElement('span');note.append(text,document.createTextNode(' '),retry);document.querySelector('.builder').before(note);
 let ticket=0;
 async function sync(){
  const request=++ticket,course=courseObj()?.name,year=Number($('year').value),shared=$('area').value==='Science'&&$('pathway').value==='ATAR'&&bank.covered(course);
  retry.hidden=true;$('build').disabled=true;
  if(!shared){text.textContent='No Practice Studio questions have been uploaded for this course and pathway yet. Practice Studio is the only assessment question source.';return}
  text.textContent='Loading the Practice Studio question bank for '+course+' Year '+year+'…';$('build').disabled=true;
  try{
   const rows=await bank.load(course,year);if(request!==ticket)return;
   refreshVersions();render();renderBank();
   text.textContent=rows.length+' questions from Practice Studio · '+course+' Year '+year+'. Topics, question types, diagrams and marking guides come from the shared bank.';
  }catch(error){if(request!==ticket)return;text.textContent='Practice Studio questions could not load. '+error.message;retry.hidden=false;$('build').disabled=true}
 }
 retry.onclick=sync;
 for(const name of ['area','course','year','pathway'])$(name).addEventListener('change',sync);
 sync();
})();