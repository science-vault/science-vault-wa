import {watchQuest} from './vault-quest-progress.mjs?v=2026.11.07-champions1';
import {mountRewards} from './reward-collection.mjs?v=2026.11.07-champions1';
let current,dispose;watchQuest(adapter=>{if(adapter===current)return;current=adapter;dispose?.();dispose=mountRewards(document.getElementById('rewardCollection'),adapter);});
