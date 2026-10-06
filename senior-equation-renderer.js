/* Shared textbook-style equation renderer for Topic Hub STEM lessons. */
(function(){
const frac=(a,b)=>'<span class="eq-frac"><span class="eq-num">'+a+'</span><span class="eq-den">'+b+'</span></span>';
function sub(s){return s.replace(/([A-Za-zΔΣωθ])_\{([^}]+)\}/g,'$1<sub>$2</sub>').replace(/([A-Za-zΔΣωθ])_([A-Za-z0-9]+)/g,'$1<sub>$2</sub>').replace(/v([fFiI])([xy])/g,(m,a,b)=>'v<sub>'+a.toLowerCase()+b+'</sub>');}
function sup(s){return s.replace(/\^\{([^}]+)\}/g,'<sup>$1</sup>').replace(/\^(-?\d+)/g,'<sup>$1</sup>').replace(/²/g,'<sup>2</sup>').replace(/³/g,'<sup>3</sup>').replace(/⁻¹/g,'<sup>−1</sup>');}
function root(s){const i=s.indexOf('√[');if(i<0)return s;let depth=0,end=-1;for(let j=i+2;j<s.length;j++){if(s[j]==='[')depth++;if(s[j]===']'){if(depth===0){end=j;break;}depth--;}}if(end<0)return s;return s.slice(0,i)+'<span class="eq-root"><span>'+s.slice(i+2,end)+'</span></span>'+s.slice(end+1);}
function format(s){
 let t=s.trim();
 t=sub(sup(t));
 t=t.replace(/m s −1/g,'m s<sup>−1</sup>').replace(/m s −2/g,'m s<sup>−2</sup>');
 t=root(t);
 t=t.replace(/tan<sup>−1<\/sup>\(([^/()]+)\/([^()]+)\)/g,(m,a,b)=>'tan<sup>−1</sup>('+frac(a,b)+')');
 t=t.replace(/\b([A-Za-z]+)\/([A-Za-z0-9]+)\b/g,(m,a,b)=>frac(a,b));
 return t;
}
function render(root=document){root.querySelectorAll('.math-display,.y12-equation').forEach(el=>{if(el.dataset.eqRendered||el.dataset.eqNative)return;const note=el.querySelector('.eq-note');const noteHTML=note?note.outerHTML:'';const clone=el.cloneNode(true);clone.querySelectorAll('.eq-note').forEach(n=>n.remove());el.innerHTML='<div class="eq-row">'+format(clone.textContent)+'</div>'+noteHTML;el.dataset.eqRendered='1';});}
window.SeniorEquationRenderer={render,formula:format};
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)render(n.matches&&n.matches('.math-display,.y12-equation')?n.parentNode:n);}))).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',()=>render());
})();