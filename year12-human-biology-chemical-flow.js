/* Final Chemical Messengers lesson-flow pass: lessons 2–10 mirror Lesson 1 rather than ending in source-slide archives. */
(function(){
const ids=["hormone-cell-action","hypothalamus-pituitary","growth-hormone","thyroid","calcium-regulation","adrenal","pancreas","other-endocrine","recombinant-hormones"];
const nums={"hormone-cell-action":2,"hypothalamus-pituitary":3,"growth-hormone":4,"thyroid":5,"calcium-regulation":6,"adrenal":7,"pancreas":8,"other-endocrine":9,"recombinant-hormones":10};
for(const id of ids){
 const L=window.Year12HumanBioLessons&&window.Year12HumanBioLessons[id]; if(!L)continue;
 // Remove the appended PowerPoint transcript/archive screens. Their teaching content and visuals
 // are now integrated into the actual lesson sequence.
 L.screens=L.screens.filter(s=>s.type!=="source"&&!/^Original PowerPoint/.test(s.title||""));
 const first=L.screens[0];
 if(first&&!first.html.includes("hb-lesson-kicker")){
   first.html='<div class="hb-lesson-kicker">CHEMICAL MESSENGERS · LESSON '+nums[id]+'</div>'+first.html;
 }
 const review=L.screens[L.screens.length-1];
 if(review&&review.title==="Retrieval review"){
   review.title="Lesson review";
   review.html=review.html.replace("<h2>Without looking back</h2>","<h2>What you should now be able to explain</h2>");
 }
}
})();