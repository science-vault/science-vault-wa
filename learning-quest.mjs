import {mountQuest} from './learning-quest-app.mjs';
import {watchQuest} from './vault-quest-progress.mjs';
let uid,dispose;watchQuest(adapter=>{const next=adapter?.uid||null;if(next===uid)return;uid=next;dispose?.();dispose=mountQuest(document.getElementById('questMount'),adapter);});
