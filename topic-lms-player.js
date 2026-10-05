/* Science Vault WA self-paced LMS player. Converts authored lesson sections into sequential student screens. */
(function(){
const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function build(data,host){
 const lessons=(data&&data.lessons)||[];
 if(!lessons.length){host.innerHTML=data&&data.html?data.html:'<div class="empty">Lesson being prepared.</div>';return;}
 let li=0,si=0;
 host.innerHTML='<div class="sv-lms"><aside class="sv-course"><div class="sv-course-title">YEAR 7 SCIENCE</div><h3>'+esc(data.topic||data.unit)+'</h3><div id="svLessonList"></div></aside><section class="sv-stage"><div class="sv-top"><div><span id="svStepLabel"></span><h2 id="svScreenTitle"></h2></div><span id="svPercent"></span></div><div class="sv-progress"><i id="svBar"></i></div><article id="svScreen" class="sv-screen"></article><div class="sv-actions"><button id="svPrev" class="btn dark">← Previous</button><button id="svNext" class="btn">Next →</button></div></section></div>';
 const list=host.querySelector('#svLessonList'),screen=host.querySelector('#svScreen'),title=host.querySelector('#svScreenTitle'),label=host.querySelector('#svStepLabel'),pct=host.querySelector('#svPercent'),bar=host.querySelector('#svBar'),prev=host.querySelector('#svPrev'),next=host.querySelector('#svNext');
 function sections(){const wrap=document.createElement('div');wrap.innerHTML=lessons[li].html;const heads=[...wrap.querySelectorAll('.lesson-block h3')];const out=[];const intro=wrap.querySelector('section.lesson-block');if(intro){const h2=intro.querySelector(':scope > h2');const ps=[...intro.querySelectorAll(':scope > p')].slice(0,3);if(h2||ps.length)out.push({title:'Lesson overview',html:(h2?'<h2>'+h2.innerHTML+'</h2>':'')+ps.map(p=>p.outerHTML).join('')});}
 heads.forEach(h=>{const parent=h.closest('.lesson-block');if(parent&&parent!==intro)out.push({title:h.textContent,html:parent.innerHTML.replace(h.outerHTML,'')});});
 return out.length?out:[{title:lessons[li].lessonTitle||'Lesson',html:lessons[li].html}];}
 function renderList(){list.innerHTML=lessons.map((l,i)=>'<button class="sv-lesson-item '+(i===li?'active':'')+'" data-i="'+i+'"><b>'+(i+1)+'</b><span>'+esc((l.lessonTitle||('Lesson '+(i+1))).replace(/^Lesson\s+\d+\s*[—-]\s*/i,''))+'</span></button>').join('');list.querySelectorAll('button').forEach(b=>b.onclick=()=>{li=+b.dataset.i;si=0;render();});}
 function render(){const ss=sections();if(si>=ss.length)si=ss.length-1;const s=ss[si];screen.innerHTML=s.html;title.textContent=s.title;label.textContent='Lesson '+(li+1)+' of '+lessons.length+' · Step '+(si+1)+' of '+ss.length;const n=si+1,total=ss.length,percent=Math.round(n/total*100);pct.textContent=percent+'%';bar.style.width=percent+'%';prev.disabled=li===0&&si===0;next.textContent=(li===lessons.length-1&&si===ss.length-1)?'Finish ✓':'Next →';renderList();window.scrollTo({top:host.offsetTop-20,behavior:'smooth'});}
 prev.onclick=()=>{const ss=sections();if(si>0)si--;else if(li>0){li--;si=999;}render();};
 next.onclick=()=>{const ss=sections();if(si<ss.length-1)si++;else if(li<lessons.length-1){li++;si=0;}else{screen.innerHTML='<div class="sv-complete"><div class="sv-tick">✓</div><h2>Biological Sciences complete</h2><p>You have reached the end of this learning sequence. Use <strong>Practise</strong> and <strong>Assess</strong> in the Topic Hub to check your understanding.</p></div>';title.textContent='Lesson complete';label.textContent='Year 7 Science';pct.textContent='100%';bar.style.width='100%';next.disabled=true;}render();};
 render();
}
window.ScienceVaultLMS={build};
})();