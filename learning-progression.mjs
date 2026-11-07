/* One increasing level curve for character progression and displayed league levels. */
export function levelCost(level=1){const n=Math.max(0,Math.floor(Number(level)||1)-1);return 1200+200*n+25*n*n;}
export function levelFloor(level=1){const n=Math.max(0,Math.floor(Number(level)||1)-1);return 1200*n+100*n*(n-1)+25*n*(n-1)*(2*n-1)/6;}
export function levelProgress(raw=0){const xp=Math.max(0,Math.min(Number.MAX_SAFE_INTEGER,Math.floor(Number(raw)||0)));let lo=1,hi=2;while(levelFloor(hi)<=xp)hi*=2;while(lo+1<hi){const mid=Math.floor((lo+hi)/2);if(levelFloor(mid)<=xp)lo=mid;else hi=mid;}const floor=levelFloor(lo),cost=levelCost(lo),earned=xp-floor;return{level:lo,xp,floor,cost,earned,next:cost-earned,progress:Math.floor(earned/cost*100)};}
