/* Independent session shuffles; stable IDs keep bookmarks, answers and history intact. */
(function(root){'use strict';
function randomInt(max){if(root.crypto?.getRandomValues){const limit=4294967296-4294967296%max,a=new Uint32Array(1);do{root.crypto.getRandomValues(a);}while(a[0]>=limit);return a[0]%max;}return Math.floor(Math.random()*max);}
function shuffle(items,pick=randomInt){const out=[...items];for(let i=out.length-1;i>0;i--){const j=pick(i+1);[out[i],out[j]]=[out[j],out[i]];}return out;}
class PracticeSequence{
 constructor(pick=randomInt){this.pick=pick;this.order=[];this.visited=new Set();this.subject=null;}
 begin(pool,attempts=[],subject=null){this.subject=subject||null;const allowed=pool.filter(x=>!this.subject||x.q[0]===this.subject),seen=new Set(attempts.map(a=>a.id)),order=shuffle(allowed.map(x=>x.i),this.pick);this.order=[...order.filter(id=>!seen.has(id)),...order.filter(id=>seen.has(id))];this.visited.clear();return this.order[0]??null;}
 next(current,pool){const eligible=pool.filter(x=>!this.subject||x.q[0]===this.subject),allowed=new Set(eligible.map(x=>x.i));if(!this.order.includes(current))this.begin(eligible,[],this.subject);this.visited.add(current);let next=this.order.find(id=>allowed.has(id)&&!this.visited.has(id));if(next!==undefined)return next;
  // The pool was exhausted or filters changed. Start a fresh random cycle.
  this.order=shuffle(eligible.map(x=>x.i),this.pick);this.visited.clear();if(this.order.length>1&&this.order[0]===current)[this.order[0],this.order[1]]=[this.order[1],this.order[0]];return this.order[0]??null;
 }
 reset(){this.order=[];this.visited.clear();this.subject=null;}
}
root.StudioPracticeSequence=new PracticeSequence();root.StudioPracticeSequenceCore={PracticeSequence,shuffle};
})(typeof window==='undefined'?globalThis:window);
