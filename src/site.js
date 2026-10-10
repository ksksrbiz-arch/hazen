const menu=document.querySelector('.mobile-nav');
if(menu){
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});
 document.addEventListener('click',event=>{if(menu.open&&!menu.contains(event.target))menu.open=false;});
 menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.open=false;}));
}

// Draft only: no inquiry data is uploaded or stored by the website.
document.querySelectorAll('[data-inquiry]').forEach(form=>{
 form.querySelector('button[type="submit"]').disabled=false;
 form.querySelectorAll('[required]').forEach(field=>field.addEventListener('input',()=>field.setCustomValidity('')));
 form.addEventListener('submit',event=>{
  event.preventDefault();
  form.querySelectorAll('[required]').forEach(field=>field.setCustomValidity(field.value.trim()?'':'Please complete this field.'));
  if(!form.reportValidity())return;
  const data=new FormData(form);
  const value=key=>String(data.get(key)||'').trim();
  const body=[`Name: ${value('name')}`,`Email: ${value('email')}`,`Phone: ${value('phone')||'Not supplied'}`,`Interest: ${value('interest')}`,`Location / property: ${value('location')||'Not supplied'}`,`Timing: ${value('timing')}`,'',value('message')].join('\n');
  const href='mailto:b.hazen@hotmail.com?subject='+encodeURIComponent('Website inquiry: '+value('interest'))+'&body='+encodeURIComponent(body);
  const backup=form.querySelector('.email-backup');
  backup.hidden=false;backup.querySelector('textarea').value=body;
  backup.querySelector('a').href=href;
  form.querySelector('.form-status').textContent='Your draft is ready. Send it from your email application to complete your inquiry. If it doesn’t open, use the message below.';
  window.location.href=href;
 });
 form.querySelector('.copy-message').addEventListener('click',async()=>{
  const field=form.querySelector('.email-backup textarea');
  try{await navigator.clipboard.writeText(field.value);form.querySelector('.form-status').textContent='Message copied. Paste it into an email to b.hazen@hotmail.com and send it.';}
  catch{field.focus();field.select();form.querySelector('.form-status').textContent='Select and copy the prepared message, then paste it into your email.';}
 });
});
