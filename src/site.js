const menu=document.querySelector('.mobile-nav');
if(menu){
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});
 document.addEventListener('click',event=>{if(menu.open&&!menu.contains(event.target))menu.open=false;});
 menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.open=false;}));
 menu.addEventListener('focusout',()=>queueMicrotask(()=>{if(!menu.contains(document.activeElement))menu.open=false;}));
 window.matchMedia('(min-width: 1151px)').addEventListener('change',event=>{if(event.matches)menu.open=false;});
}

// Draft only: no inquiry data is uploaded or stored by the website.
document.querySelectorAll('[data-inquiry]').forEach(form=>{
 const backup=form.querySelector('.email-backup'),status=form.querySelector('.form-status');
 const interest=form.elements.interest,location=form.elements.location,sellerContext=form.querySelector('.seller-context');
 const goalLinks=[...document.querySelectorAll('[data-seller-goal]')];
 const syncGoal=()=>goalLinks.forEach(link=>{if(interest.value==='Selling a home'&&link.dataset.sellerGoal===form.elements.sellerGoal.value)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});
 const invalidateDraft=()=>{if(!backup.hidden){backup.hidden=true;form.classList.remove('reviewing-draft');backup.querySelector('[data-open-email]').removeAttribute('href');status.textContent='Your details changed. Review your draft again before opening an email.';}};
 const updateTopic=()=>{
  const sellerRelated=['Selling a home','A home assessment'].includes(interest.value);sellerContext.hidden=!sellerRelated;sellerContext.querySelectorAll('input,select,textarea').forEach(control=>control.disabled=!sellerRelated);syncGoal();
  const assessment=interest.value==='A home assessment',address=assessment||['Selling a home','Request a showing','A property inquiry'].includes(interest.value);
  location.required=assessment;location.setCustomValidity('');
  form.querySelector('[data-location-label]').textContent=address?'Property address'+(assessment?' *':' (optional)'):interest.value==='Buying a home'?'Preferred communities (optional)':'Property or community (optional)';
  form.querySelector('#location-hint').textContent=address?'Include the city, if you know it.':interest.value==='Buying a home'?'Share the places you are considering.':'Add a place or property, if relevant.';
 };
 interest.addEventListener('change',()=>{invalidateDraft();updateTopic();});updateTopic();
 goalLinks.forEach(link=>link.addEventListener('click',()=>{if(!sellerGoals.includes(link.dataset.sellerGoal))return;interest.value='Selling a home';form.elements.sellerGoal.value=link.dataset.sellerGoal;updateTopic();invalidateDraft();sellerContext.open=true;form.elements.name.focus({preventScroll:true});}));
 form.querySelector('button[type="submit"]').disabled=false;
 form.addEventListener('input',event=>{
  if(event.target.matches('input,select,textarea'))event.target.setCustomValidity('');
  invalidateDraft();syncGoal();
 });
 form.addEventListener('submit',event=>{
  event.preventDefault();
  form.querySelectorAll('[required]').forEach(field=>field.setCustomValidity(field.value.trim()?'':'Please complete this field.'));
  if(!form.reportValidity())return;
  const data=new FormData(form);
  const value=key=>String(data.get(key)||'').trim();
  const body=inquiryDraftBody(data);
  const href='mailto:b.hazen@hotmail.com?subject='+encodeURIComponent('Website inquiry: '+value('interest'))+'&body='+encodeURIComponent(body);
  backup.hidden=false;form.classList.add('reviewing-draft');backup.querySelector('textarea').value=body;
  backup.querySelector('[data-open-email]').href=href;
  backup.querySelector('[data-email-subject]').textContent='Subject: Website inquiry: '+value('interest');
  status.textContent='Your draft is ready to review. Nothing has been sent.';
  backup.querySelector('h3').focus({preventScroll:true});backup.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 });
 form.querySelector('.edit-inquiry').addEventListener('click',()=>{backup.hidden=true;form.classList.remove('reviewing-draft');backup.querySelector('[data-open-email]').removeAttribute('href');status.textContent='Update your details, then review the draft again.';form.elements.name.focus();});
 form.querySelector('.copy-message').addEventListener('click',async()=>{
  const field=form.querySelector('.email-backup textarea');
  try{await navigator.clipboard.writeText(field.value);form.querySelector('.form-status').textContent='Message copied. Paste it into an email to b.hazen@hotmail.com and send it.';}
  catch{field.focus();field.select();form.querySelector('.form-status').textContent='Select and copy the prepared message, then paste it into your email.';}
 });
 form.inert=false;
});

// Property tools enhance ordinary image links; the page remains usable without JavaScript.
const property=document.querySelector('[data-property]');
if(property){
 const print=property.querySelector('[data-print-property]');print.hidden=false;print.addEventListener('click',()=>window.print());
 if(property.dataset.preview!=='true'){
  const share=property.querySelector('[data-share-property]'),message=property.querySelector('[data-share-status]'),fallback=property.querySelector('[data-share-fallback]');
  const url=window.location.origin+window.location.pathname,title=document.querySelector('h1').textContent;
  share.hidden=false;
  share.addEventListener('click',async()=>{
   share.disabled=true;fallback.hidden=true;
   try{
    if(navigator.share){await navigator.share({title,url});message.textContent='Listing shared.';}
    else{await navigator.clipboard.writeText(url);message.textContent='Listing link copied.';}
   }catch(error){
    if(error.name!=='AbortError'){
     try{await navigator.clipboard.writeText(url);message.textContent='Listing link copied.';}
     catch{fallback.hidden=false;const input=fallback.querySelector('input');input.value=url;input.focus();input.select();message.textContent='Copy the listing link below to share it.';}
    }
   }finally{share.disabled=false;}
  });
  const email=property.querySelector('[data-showing-email]');
  if(email){const href=new URL(email.href);href.searchParams.set('body','I would like to ask about this property:\n'+title+'\n'+url+'\n\nMy preferred times:\nMy name:\nMy phone number:');email.href=href.href;}
 }
 const links=[...property.querySelectorAll('[data-gallery-photo]')];
 if(links.length&&typeof HTMLDialogElement!=='undefined'){
  const dialog=document.createElement('dialog');dialog.className='photo-viewer';dialog.setAttribute('aria-label','Property photo viewer');
  dialog.innerHTML='<div class="viewer-toolbar"><p class="viewer-count" role="status" aria-live="polite"></p><button type="button" class="viewer-close" autofocus>Close Photos</button></div><figure><img alt=""><figcaption></figcaption></figure><p class="viewer-error" role="status"></p><div class="viewer-navigation"><button type="button" class="viewer-prev" aria-label="Previous photo">← Previous</button><p>Use arrow keys to browse</p><button type="button" class="viewer-next" aria-label="Next photo">Next →</button></div>';
  document.body.append(dialog);
  const image=dialog.querySelector('img'),caption=dialog.querySelector('figcaption'),count=dialog.querySelector('.viewer-count'),error=dialog.querySelector('.viewer-error');let index=0,opener=null,touch=null;
  const show=next=>{index=(next+links.length)%links.length;const original=links[index].querySelector('img');error.textContent='';image.alt=original.alt;image.src=links[index].href;caption.textContent=original.alt;count.textContent='Photo '+(index+1)+' of '+links.length;};
  image.addEventListener('error',()=>{error.textContent='This photo could not load. Try another photo or close the viewer.';});
  dialog.querySelector('.viewer-close').addEventListener('click',()=>dialog.close());
  for(const [selector,step] of [['.viewer-prev',-1],['.viewer-next',1]]){const button=dialog.querySelector(selector);button.disabled=links.length<2;button.addEventListener('click',()=>show(index+step));}
  links.forEach((link,i)=>link.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0)return;event.preventDefault();opener=link;show(i);dialog.showModal();document.body.classList.add('gallery-open');}));
  dialog.addEventListener('close',()=>{document.body.classList.remove('gallery-open');opener?.focus();});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  dialog.addEventListener('keydown',event=>{const next=event.key==='ArrowRight'?index+1:event.key==='ArrowLeft'?index-1:event.key==='Home'?0:event.key==='End'?links.length-1:null;if(next!==null){event.preventDefault();show(next);}});
  image.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')touch={x:event.clientX,y:event.clientY,id:event.pointerId};});
  image.addEventListener('pointerup',event=>{if(!touch||touch.id!==event.pointerId)return;const dx=event.clientX-touch.x,dy=event.clientY-touch.y;touch=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)show(index+(dx<0?1:-1));});
  image.addEventListener('pointercancel',()=>{touch=null;});
 }
}

// A page-only worksheet: no account, storage, or network submission.
const worksheet=document.querySelector('[data-seller-worksheet]');
if(worksheet){
 worksheet.classList.add('worksheet-enhanced');
 const checks=[...worksheet.querySelectorAll('input[type="checkbox"]')],notes=worksheet.querySelector('#worksheet-notes'),printNotes=worksheet.querySelector('[data-worksheet-print-notes]'),progress=worksheet.querySelector('[data-worksheet-progress]');
 const updateWorksheet=()=>{const reviewed=checks.filter(check=>check.checked).length;progress.textContent=reviewed+' of '+checks.length+' prompts reviewed'+(reviewed===checks.length?' · Bring your questions to the conversation.':'.');printNotes.textContent=notes.value.trim()||'Questions / notes: __________________________________________________________';};
 worksheet.addEventListener('input',updateWorksheet);worksheet.addEventListener('change',updateWorksheet);window.addEventListener('pageshow',updateWorksheet);window.addEventListener('beforeprint',updateWorksheet);
 const printButton=worksheet.querySelector('[data-print-worksheet]'),resetButton=worksheet.querySelector('[data-reset-worksheet]');printButton.hidden=resetButton.hidden=progress.hidden=false;
 printButton.addEventListener('click',()=>{updateWorksheet();window.print();});resetButton.addEventListener('click',()=>{if((checks.some(check=>check.checked)||notes.value)&&!confirm('Clear this page’s checks and notes?'))return;checks.forEach(check=>check.checked=false);notes.value='';updateWorksheet();checks[0]?.focus();});updateWorksheet();
}

const photoGuidePrint=document.querySelector('[data-print-guide]');
if(photoGuidePrint){photoGuidePrint.hidden=false;photoGuidePrint.addEventListener('click',()=>window.print());}
