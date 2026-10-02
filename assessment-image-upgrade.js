// Converts image metadata in question-bank items into assessment-builder visual blocks.
// Images are from reusable/public-domain sources and retain visible attribution.
(function(){
 const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 (window.AssessmentQuestionBank||[]).forEach(q=>{
   if(q.image&&q.image.src){
     q.diagram='<figure class="question-image" style="margin:14px 0;text-align:center"><img src="'+esc(q.image.src)+'" alt="'+esc(q.image.alt)+'" style="max-width:100%;max-height:420px;height:auto;object-fit:contain"><figcaption style="font-size:10px;color:#667;margin-top:5px">Image: '+esc(q.image.credit||'Wikimedia Commons')+'</figcaption></figure>';
   }
 });
})();