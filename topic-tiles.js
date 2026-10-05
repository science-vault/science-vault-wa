/* Topic tile dashboard for Science Vault LMS */
(function(){
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function render(host,topics,onOpen){host.innerHTML='<div class="topic-head"><div><span class="eyebrow">CHOOSE A TOPIC</span><h2>Biological Sciences</h2><p>Select a topic to begin its self-paced learning module.</p></div><span class="topic-count">'+topics.length+' topics</span></div><div class="topic-tile-grid">'+topics.map((t,i)=>'<button class="topic-tile" data-i="'+i+'"><span class="topic-icon">'+t.icon+'</span><span class="topic-number">TOPIC '+String(i+1).padStart(2,'0')+'</span><strong>'+esc(t.title)+'</strong><small>'+esc(t.subtitle)+'</small><span class="topic-open">Start topic <b>→</b></span></button>').join('')+'</div>';host.querySelectorAll('.topic-tile').forEach(b=>b.onclick=()=>onOpen(topics[+b.dataset.i]));}
window.ScienceVaultTopicTiles={render};
})();