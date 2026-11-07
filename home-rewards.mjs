import {CHAMPION_MAP,championPortrait} from './champion-catalog.mjs?v=2026.11.07-champions1';
const root=document.getElementById('homeRewards');
if(root){
 let champion='astra',edition='base';
 const render=()=>{
  const c=CHAMPION_MAP[champion],skin=edition==='base'?'base':c.id+'-'+edition;
  root.querySelector('[data-reward-art]').innerHTML=championPortrait(c.id,skin,'reward-hero-art');
  root.querySelector('[data-reward-name]').textContent=c.name;
  root.querySelector('[data-reward-title]').textContent=c.title;
  root.querySelector('[data-reward-level]').textContent='CHAMPION UNLOCK · LEVEL '+c.level;
  root.querySelector('[data-reward-edition]').textContent=edition==='base'?'Original champion':edition==='celestial'?'Celestial Edition · Epic skin':'Eclipse Edition · Legendary skin';
  root.querySelector('[data-reward-description]').textContent=edition==='base'?c.lore:'A collectible special-edition appearance for '+c.name+'. Skin rewards can appear in earned level-up crates.';
  root.querySelectorAll('[data-champion]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.champion===champion)));
  root.querySelectorAll('[data-edition]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.edition===edition)));
 };
 root.addEventListener('click',e=>{const c=e.target.closest('[data-champion]'),s=e.target.closest('[data-edition]');if(c&&CHAMPION_MAP[c.dataset.champion]){champion=c.dataset.champion;render()}if(s&&['base','celestial','eclipse'].includes(s.dataset.edition)){edition=s.dataset.edition;render()}});
 render();
}
