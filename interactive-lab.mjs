import {mountLab} from './interactive-lab-app.mjs?v=2026.10.30-labs3';
import {watchQuest} from './vault-quest-progress.mjs?v=2026.10.26-community1';
let uid,dispose;watchQuest(adapter=>{const next=adapter?.uid||null;if(next===uid)return;uid=next;dispose?.();dispose=mountLab(document.getElementById('labMount'),adapter);});

