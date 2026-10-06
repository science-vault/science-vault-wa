/* Chemical Messengers lessons 2–10: integrate original PowerPoint visuals into the teaching screens. */
(function(){
const ROOT="/science-vault-wa/assets/human-biology/chemical-messengers/";
const map={
"hormone-cell-action":[["Start with solubility",[1]],["Protein / amine / peptide hormones",[4]],["Enzyme amplification",[4]],["Example: insulin",[6]],["Steroid hormones",[7]],["Example: testosterone",[8]],["Compare the two mechanisms",[9]]],
"hypothalamus-pituitary":[["Location and partnership",[3,4]],["Hypothalamus functions",[5]],["Pituitary structure",[6]],["Anterior pathway",[7]],["Releasing and inhibiting factors",[8]],["Anterior-pituitary hormones",[9,10]],["Posterior pathway",[11,12]],["ADH and oxytocin",[13]],["ADH negative feedback",[14]],["Anterior vs posterior",[15]]],
"growth-hormone":[["What is growth hormone?",[2]],["Major effects",[3]],["Growth regulation",[4,5]],["IGF-1 and growth",[5]],["Hypersecretion",[6,7]],["Hyposecretion",[8,9]]],
"thyroid":[["Location and structure",[2,3]],["Thyroid hormones",[4]],["Iodine",[5]],["Metabolic effects",[6]],["Thyroid regulation",[7]],["Hyperthyroidism",[8]],["Hypothyroidism",[9]],["Calcitonin",[10]]],
"calcium-regulation":[["Location",[2]],["When calcium is low",[3,4]],["When calcium is high",[5]],["The complete balance",[6]]],
"adrenal":[["Location and structure",[2]],["Cortex vs medulla",[3]],["Aldosterone",[4]],["Cortisol regulation",[5]],["Cortisol effects",[5]],["Catecholamine pathway",[6,7]]],
"pancreas":[["Pancreas structure",[2]],["Insulin",[3]],["Insulin negative feedback",[4]],["Glycogen",[5]],["Glucagon",[6]],["Glucagon negative feedback",[7,8]],["One homeostatic system",[9]],["Type 1 diabetes mellitus",[10]],["Type 2 diabetes mellitus",[10]]],
"other-endocrine":[["Beyond the major glands",[2]],["Thymus",[3]],["Pineal gland",[4]],["Gonads",[5]],["Other endocrine tissues",[5]]],
"recombinant-hormones":[["What is recombinant DNA technology?",[3]],["DNA and genes",[4]],["Restriction enzymes",[5,6]],["DNA ligase",[7]],["Plasmids as vectors",[9]],["Synthetic insulin: steps 1–4",[10,11]],["Synthetic insulin: steps 5–8",[11]],["Why this mattered",[12]],["Growth hormone uses the same logic",[12]]]
};
const files={
"hormone-cell-action":{1:["png"],4:["png"],6:["png","png"],7:["png"],8:["png","png"],9:["png"]},
"hypothalamus-pituitary":{3:["png"],4:["png"],5:["png"],6:["png"],7:["png"],8:["png"],9:["jpg"],10:["png"],11:["png"],12:["jpg"],13:["jpg"],14:["png"],15:["png"]},
"growth-hormone":{2:["jpg"],3:["png"],4:["png"],5:["png","png"],6:["jpg"],7:["jpg"],8:["png","png"],9:["png"]},
"thyroid":{2:["png"],3:["png"],4:["jpg","png","png"],5:["png","png"],6:["png","png"],7:["png"],8:["png","png"],9:["png","png"],10:["png","png","png"]},
"calcium-regulation":{2:["png"],3:["png"],4:["png"],5:["png","png","png"],6:["png"]},
"adrenal":{2:["jpg"],3:["jpg","png"],4:["png"],5:["png","png"],6:["png","png"],7:["png"]},
"pancreas":{2:["png"],3:["png","jpg"],4:["png"],5:["png"],6:["png","png","png"],7:["png"],8:["png"],9:["gif","png"],10:["png"]},
"other-endocrine":{2:["jpg"],3:["png"],4:["jpg"],5:["png"]},
"recombinant-hormones":{4:["png"],5:["png"],6:["png","png"],7:["png"],9:["jpg","jpg","png"],10:["png"],11:["png","png"],12:["png"]}
};
function gallery(id,slides){
 let out='<div class="hb-integrated-gallery">';
 for(const n of slides){
   const exts=(files[id]||{})[n]||[];
   exts.forEach((ext,i)=>{const nn=String(n).padStart(2,"0"),ii=String(i+1).padStart(2,"0");out+='<figure class="hb-teach-visual"><img loading="lazy" src="'+ROOT+id+'/slide-'+nn+'-image-'+ii+'.'+ext+'" alt="Original PowerPoint visual for '+id.replaceAll("-"," ")+'"><figcaption>Original PowerPoint visual · slide '+n+'</figcaption></figure>';});
 }
 return out+'</div>';
}
for(const [id,rules] of Object.entries(map)){
 const lesson=window.Year12HumanBioLessons&&window.Year12HumanBioLessons[id]; if(!lesson)continue;
 for(const [title,slides] of rules){
   const screen=lesson.screens.find(s=>s.title===title); if(screen)screen.html=screen.html+gallery(id,slides);
 }
}
})();