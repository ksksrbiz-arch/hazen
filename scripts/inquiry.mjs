const e=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Email drafts only. Nothing is submitted to a server by this form.
export function inquiry(kind,property=null){
 const interest=kind==='buy'?'Buying a home':kind==='sell'?'Selling a home':kind==='assessment'?'A home assessment':kind==='property'?(property?.status==='Active'?'Request a showing':'A property inquiry'):'';
 const address=['sell','assessment','property'].includes(kind);
 return `<section id="inquiry" class="inquiry-panel" aria-labelledby="inquiry-heading">
 <div class="inquiry-intro"><p class="eyebrow">Connect with Brad</p><h2 id="inquiry-heading" tabindex="-1">${kind==='assessment'?'Request a home assessment':kind==='property'?'Ask about this property':'Tell Brad about your plans'}</h2>
 <p>A few details give Brad a useful starting point for your conversation.</p>
 <ol class="inquiry-steps"><li>Tell Brad what you have in mind.</li><li>Review your prepared message.</li><li>Open your email application and send it.</li></ol>
 <div class="inquiry-direct"><span>Prefer to connect directly?</span><a href="tel:+13609219484">Call (360) 921-9484</a><a href="mailto:b.hazen@hotmail.com">b.hazen@hotmail.com</a></div><noscript><p>Use the call or email links above to contact Brad. Preparing an email draft with the form requires JavaScript.</p></noscript></div>
 <form class="inquiry-form" data-inquiry="${kind}" inert><p class="required-note">Fields marked * are required. Other details are optional.</p>
 <fieldset><legend>Your contact details</legend><div class="inquiry-fields">
 <div class="inquiry-field"><label for="inquiry-name">Your name *</label><input id="inquiry-name" name="name" autocomplete="name" maxlength="100" required></div>
 <div class="inquiry-field"><label for="inquiry-email">Email address *</label><input id="inquiry-email" name="email" type="email" autocomplete="email" maxlength="150" required></div></div></fieldset>
 <fieldset><legend>Your plans</legend><div class="inquiry-fields">
 <div class="inquiry-field"><label for="inquiry-interest">I’m interested in *</label><select id="inquiry-interest" name="interest" required><option value="" ${!interest?'selected':''}>Choose a topic</option>${['Selling a home','A home assessment','Buying a home','Request a showing','A property inquiry','Other questions'].map(value=>`<option ${interest===value?'selected':''}>${value}</option>`).join('')}</select></div>
 <div class="inquiry-field"><label for="inquiry-location" data-location-label>${address?'Property address'+(kind==='assessment'?' *':' (optional)'):'Preferred communities (optional)'}</label><input id="inquiry-location" name="location" autocomplete="off" maxlength="200" value="${e(property?.address)}" ${kind==='assessment'?'required':''} aria-describedby="location-hint"><small id="location-hint">${address?'Include the city, if you know it.':'Share the places you are considering.'}</small></div>
 <div class="inquiry-field full"><label for="inquiry-message">What would you like Brad to know? (optional)</label><textarea id="inquiry-message" name="message" rows="4" maxlength="1500" placeholder="Share your priorities, questions, or property details."></textarea></div></div>
 <details class="inquiry-options"><summary>Add a phone number and timing (optional)</summary><div class="inquiry-fields">
 <div class="inquiry-field"><label for="inquiry-phone">Phone (optional)</label><input id="inquiry-phone" name="phone" type="tel" autocomplete="tel" maxlength="40"></div>
 <div class="inquiry-field"><label for="inquiry-timing">Timing (optional)</label><select id="inquiry-timing" name="timing"><option>Just exploring</option><option>Within 3 months</option><option>3–6 months</option><option>6 months or later</option></select></div></div></details></fieldset>
 <div class="inquiry-submit"><button class="button" type="submit" disabled>Review Email Draft →</button><p class="form-note">You’ll review the message first. This website does not send emails. <a href="/privacy/">Privacy information</a></p></div>
 <p class="form-status" role="status" aria-live="polite"></p>
 <section class="email-backup" hidden aria-labelledby="draft-heading"><h3 id="draft-heading" tabindex="-1">Review your email draft</h3><p>To: <strong>b.hazen@hotmail.com</strong></p><p data-email-subject></p><label for="prepared-message">Prepared message</label><textarea id="prepared-message" readonly rows="8"></textarea><div class="draft-actions"><a class="button" data-open-email href="mailto:b.hazen@hotmail.com">Open Email &amp; Send Yourself</a><button type="button" class="copy-message">Copy Message</button><button type="button" class="edit-inquiry">Edit Details</button></div><p class="form-note">Opening a draft does not send it. Send it from your email application. If no draft opens, copy the message into an email to Brad.</p></section>
 </form></section>`;
}
