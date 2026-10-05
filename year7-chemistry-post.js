/* Runs after page scripts settle: prevents Biology visuals leaking into Chemistry and adds random retrieval. */
(function(){setTimeout(function(){const C=window.Year7ChemistryRich;if(!C||!C.enhance||C.__scoped)return;const old=C.enhance;C.enhance=function(root,title){
  /* Remove Biology-only media/cards if another enhancer inserted them. */
  [...root.querySelectorAll('figure')].forEach(f=>{if(/living things|observable characteristics|organism|biodiversity|wikimedia commons/i.test(f.textContent))f.remove()});
  const context=(title+' '+root.textContent).replace(/\s+/g,' ');old(root,context);
  /* Remove again because legacy visual code may have run earlier in this render. */
  [...root.querySelectorAll('figure')].forEach(f=>{if(/living things|observable characteristics|organism|biodiversity/i.test(f.textContent))f.remove()});
  if(/Practise|Quick Check|Retrieval|Apply|Challenge/i.test(title))randomActivity(root,context);
};C.__scoped=true;
function randomActivity(root,ctx){const qs=[];
 if(/particle|solid|liquid|gas|state/i.test(ctx))qs.push(['Which statement best matches the particle model?',['Particles in a solid never move','Liquid particles can move past one another','Gas particles are joined in fixed positions'],1]);
 if(/solution|solute|solvent|mixture/i.test(ctx))qs.push(['Salt is dissolved in water. What is the solvent?',['salt','water','the container'],1]);
 if(/siev|particle size/i.test(ctx))qs.push(['Which method uses differences in particle size?',['sieving','magnetic separation','distillation'],0]);
 if(/magnet/i.test(ctx))qs.push(['Iron filings mixed with sand are best separated first using…',['filter paper','a magnet','evaporation'],1]);
 if(/filtrat|residue|filtrate/i.test(ctx))qs.push(['The liquid passing through filter paper is the…',['residue','filtrate','solute'],1]);
 if(/chromat/i.test(ctx))qs.push(['One ink produces three spots on a chromatogram. This suggests the ink is…',['a mixture','a pure substance','insoluble'],0]);
 if(/distill/i.test(ctx))qs.push(['After water vaporises during distillation it is…',['sieved','cooled and condensed','magnetically separated'],1]);
 if(!qs.length)return;const q=qs[Math.floor(Math.random()*qs.length)],d=document.createElement('div');d.className='chem-random2';d.innerHTML='<small>RANDOM RETRIEVAL</small><b>'+q[0]+'</b>'+q[1].map((x,i)=>'<button data-i="'+i+'">'+x+'</button>').join('')+'<p></p>';root.appendChild(d);d.querySelectorAll('button').forEach(b=>b.onclick=()=>{const ok=+b.dataset.i===q[2];const p=d.querySelector('p');p.textContent=ok?'✓ Correct.':'↻ Try again — use the explanation or diagram above.';p.className=ok?'ok':'no'});}
const s=document.createElement('style');s.textContent='.chem-random2{margin:20px 0;padding:18px;border:2px solid #7966aa;border-radius:15px;background:#f6f2ff}.chem-random2 small,.chem-random2 b{display:block;margin-bottom:9px}.chem-random2 small{font-weight:900;letter-spacing:.1em;color:#66529e}.chem-random2 button{display:block;width:100%;margin:7px 0;padding:10px;text-align:left;border:2px solid #afa4cc;border-radius:9px;background:#fff;cursor:pointer;font-weight:700}.chem-random2 p{padding:9px;border-radius:8px;font-weight:800}.chem-random2 p.ok{background:#ddf4e7;color:#17603e}.chem-random2 p.no{background:#fff0df;color:#884c1b}';document.head.appendChild(s);
},0)})();