import {fresh,clean} from './learning-pathway-core.mjs?v=1';
export const storageKey=uid=>'vault-learning-pathway-v1:'+uid;
export function read(uid){if(!uid)return fresh();try{return clean(JSON.parse(localStorage.getItem(storageKey(uid))))}catch{return fresh()}}
export function save(uid,model){if(!uid)return false;try{localStorage.setItem(storageKey(uid),JSON.stringify(model));window.dispatchEvent(new Event('vault-pathway-updated'));return true}catch{return false}}
