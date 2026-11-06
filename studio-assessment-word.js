/* Preserve Studio diagrams and chemical/mathematical notation in editable copies and DOCX. */
(function(root){
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
 const tag=n=>String(n.localName||n.tagName||'').toLowerCase(),children=n=>[...n.children].filter(x=>!['annotation','annotation-xml'].includes(tag(x)));
 function omml(n){
  if(!n)return '';
  const t=tag(n),c=children(n),r=()=>c.map(omml).join('');
  if(t==='mfrac')return'<m:f><m:num>'+omml(c[0])+'</m:num><m:den>'+omml(c[1])+'</m:den></m:f>';
  if(['msup','msub','msubsup'].includes(t)){
   const kind={msup:'sSup',msub:'sSub',msubsup:'sSubSup'}[t];
   return'<m:'+kind+'><m:e>'+omml(c[0])+'</m:e>'+(t!=='msup'?'<m:sub>'+omml(c[1])+'</m:sub>':'')+(t!=='msub'?'<m:sup>'+omml(c[t==='msup'?1:2])+'</m:sup>':'')+'</m:'+kind+'>';
  }
  if(t==='mmultiscripts'){
   const pre=c.findIndex(e=>tag(e)==='mprescripts');let base=omml(c[0]);
   if((pre<0?c.length:pre)>2)base='<m:sSubSup><m:e>'+base+'</m:e><m:sub>'+omml(c[1])+'</m:sub><m:sup>'+omml(c[2])+'</m:sup></m:sSubSup>';
   return pre>=0?'<m:sPre><m:sub>'+omml(c[pre+1])+'</m:sub><m:sup>'+omml(c[pre+2])+'</m:sup><m:e>'+base+'</m:e></m:sPre>':base;
  }
  if(t==='mover'&&c.length>=2){const accent=c[1].textContent||'¯';return ['¯','‾'].includes(accent)?'<m:bar><m:barPr><m:pos m:val="top"/></m:barPr><m:e>'+omml(c[0])+'</m:e></m:bar>':'<m:acc><m:accPr><m:chr m:val="'+esc(accent)+'"/></m:accPr><m:e>'+omml(c[0])+'</m:e></m:acc>';}
  if(t==='msqrt'||t==='mroot')return'<m:rad><m:radPr>'+(t==='msqrt'?'<m:degHide m:val="1"/>':'')+'</m:radPr><m:deg>'+(c[1]&&t==='mroot'?omml(c[1]):'')+'</m:deg><m:e>'+(t==='msqrt'?r():omml(c[0]))+'</m:e></m:rad>';
  if(t==='mtable')return'<m:m>'+c.map(row=>'<m:mr>'+children(row).map(cell=>'<m:e>'+omml(cell)+'</m:e>').join('')+'</m:mr>').join('')+'</m:m>';
  if(t==='mfenced')return'<m:d><m:dPr><m:begChr m:val="'+esc(n.getAttribute('open')||'(')+'"/><m:endChr m:val="'+esc(n.getAttribute('close')||')')+'"/></m:dPr><m:e>'+r()+'</m:e></m:d>';
  if(['mi','mn','mo','mtext','ms'].includes(t))return'<m:r><m:rPr><m:nor/></m:rPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="24"/></w:rPr><m:t xml:space="preserve">'+esc(n.textContent)+'</m:t></m:r>';
  return c.length?r():'<m:r><m:rPr><m:nor/></m:rPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="24"/></w:rPr><m:t>'+esc(n.textContent||'')+'</m:t></m:r>';
 }
 function asHTML(n){
  const t=tag(n),c=children(n),r=()=>c.map(asHTML).join('');
  if(t==='mfrac')return'<span>('+asHTML(c[0])+') / ('+asHTML(c[1])+')</span>';
  if(t==='msup')return asHTML(c[0])+'<sup>'+asHTML(c[1])+'</sup>';
  if(t==='msub')return asHTML(c[0])+'<sub>'+asHTML(c[1])+'</sub>';
  if(t==='msubsup')return asHTML(c[0])+'<sub>'+asHTML(c[1])+'</sub><sup>'+asHTML(c[2])+'</sup>';
  if(t==='msqrt')return'√('+r()+')';
  if(t==='mroot')return'<sup>'+asHTML(c[1])+'</sup>√('+asHTML(c[0])+')';
  if(t==='mtable')return'<table>'+c.map(row=>'<tr>'+children(row).map(cell=>'<td>'+asHTML(cell)+'</td>').join('')+'</tr>').join('')+'</table>';
  if(t==='mfenced')return esc(n.getAttribute('open')||'(')+r()+esc(n.getAttribute('close')||')');
  return c.length?r():esc(n.textContent||'');
 }
 function split(value,prefix){
  const host=document.createElement('div');host.innerHTML=value||'';let figures='',number=0;
  for(const img of host.querySelectorAll('img,svg')){
   const label=prefix+' figure '+(++number),ref=document.createElement('span');ref.textContent=' ['+label+'] ';
   const clone=img.cloneNode(true);clone.setAttribute('alt',label);if(img.hasAttribute('data-studio-crop')&&img.parentElement?.style.overflow==='hidden'){const viewport=img.parentElement.cloneNode(false);viewport.append(clone);figures+='<figure>'+viewport.outerHTML+'</figure>';img.parentElement.replaceWith(ref);}else{figures+='<figure>'+clone.outerHTML+'</figure>';img.replaceWith(ref);}
  }
  return{html:host.innerHTML,figures};
 }
 function template(q){
  const body=split(q.question,'Question'),key=split(q.answer,'Marking-key');
  return{question:'',parts:[{label:'',text:body.html,marks:q.marks,lines:0,space:'lines',diagram:body.figures}],diagram:'',answer:key.html,marks:q.marks,responseLines:0,nativeWordCopy:true,wordKeyDiagram:key.figures};
 }
 root.StudioAssessmentWord={template,asHTML,math:n=>'<m:oMath>'+omml(n)+'</m:oMath>'};
})(typeof window==='undefined'?globalThis:window);
