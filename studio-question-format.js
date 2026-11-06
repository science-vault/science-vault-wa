/* Shared source formatting; teacher-added response space is applied after this pass. */
(function(root){
 'use strict';
 const leaders=/[_\u00ad \t]{3,}|(?<![A-Za-z0-9])(?:\.[ \t]*){8,}/g;
 const isLeader=run=>run.trim().startsWith('.')||(run.match(/_/g)||[]).length>=3;
 function text(value){const without=value.replace(leaders,run=>isLeader(run)?'':run);if(value===without)return value;const remaining=without.replace(/\u00ad/g,'').trim();return value.replace(leaders,run=>isLeader(run)?(remaining?' □ ':' '):run);}
 function html(value){
  const host=document.createElement('div');host.innerHTML=String(value||'');
  for(const img of host.querySelectorAll('img')){const entry=root.StudioSourceImageText?.resolve(img.getAttribute('src')||'');if(!entry)continue;if(entry.removeFollowingText){const next=(img.closest('figure')||img).nextElementSibling;if(next?.tagName==='P'&&next.textContent.replace(/\s+/g,' ').trim()===entry.removeFollowingText)next.remove();}const parent=img.parentElement,replaceParagraph=/^<(?:table|p|div)\b/i.test(entry.html.trim())&&parent?.tagName==='P'&&!parent.textContent.trim()&&parent.children.length===1;const span=document.createElement(replaceParagraph?'div':'span');span.setAttribute('data-source-image-text',entry.sourceSHA256);span.innerHTML=entry.html;if(replaceParagraph)parent.replaceWith(span);else img.replaceWith(span);}
  const walker=document.createTreeWalker(host,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){
   if(node.parentElement?.closest('math,svg,script,style,code,pre'))continue;
   node.nodeValue=text(node.nodeValue);
  }
  for(const p of host.querySelectorAll('p'))if(!p.textContent.trim()&&!p.querySelector('img,svg,math,table'))p.remove();
  for(const figure of host.querySelectorAll('figure'))if(!figure.textContent.trim()&&!figure.querySelector('img,svg,math,table'))figure.remove();
  return host.innerHTML;
 }
 function sourceHTML(raw){const review=root.StudioSourceImageText?.tails?.[raw.id];if(!review)return raw.html;const host=document.createElement('div');host.innerHTML=raw.html||'';const anchor=[...host.querySelectorAll('p')].find(p=>p.textContent.trim().startsWith(review.anchor));if(!anchor)throw Error('The reviewed source section is missing for '+raw.id);while(anchor.nextSibling)anchor.nextSibling.remove();const tail=document.createElement('div');tail.setAttribute('data-source-tail',raw.id);tail.innerHTML=review.html;anchor.replaceWith(tail);return host.innerHTML;}
 function question(raw){return {...raw,html:html(sourceHTML(raw)),...(typeof raw.answerHtml==='string'?{answerHtml:html(raw.answerHtml)}:{}),...(raw.optionsHtml?{optionsHtml:raw.optionsHtml.map(html)}:{}),fontFamily:'Arial',fontSizePt:12,responseLines:0};}
 root.StudioQuestionFormat={html,question,text};
})(typeof window==='undefined'?globalThis:window);
