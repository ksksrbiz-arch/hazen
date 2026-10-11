const groups=[
 {id:'selling-resources',title:'Preparing to sell',intro:'Organize the property details and questions for your listing conversation.',items:[
  ['/seller-checklist/','Printable worksheet','Seller conversation checklist','Review your goals, property facts, preparation and questions. Check prompts and print your notes.'],
  ['/listing-photos/','Preparation guide','Plan your listing photos','Explore room and outdoor shot planning, preparation and an organized photo handoff.'],
  ['/listing-marketing/','Listing guide','Understand the listing approach','Discuss property presentation, outreach channels, responsibilities and how feedback will be reviewed.'],
  ['/home-valuation/','Personal conversation','Discuss your home’s value','Prepare a request for Brad to discuss your property. This is a personal assessment, not an instant online estimate.']
 ]},
 {id:'buying-resources',title:'Planning your next move',intro:'Explore places, clarify your priorities and bring your questions to Brad.',items:[
  ['/buy/','Buying guide','Plan your home purchase','Start with your priorities, preferred communities and the steps to discuss before buying.'],
  ['/communities/','Local guides','Explore Clark County communities','Read six community introductions and follow links to official local resources.'],
  ['/properties/','Brad’s property collection','Explore featured properties','View manually maintained listings when published and contact Brad to confirm current details.'],
  ['/contact/#inquiry','Email draft','Start a conversation','Prepare and review your message, then send it through your email application.']
 ]}
];

export const resourcesPage={slug:'resources',title:'Guides for your next move',intro:'Practical guides and preparation tools for buying, selling and talking with Brad. Explore freely; no registration is required.',sections:[]};
export function resourceHub(){return `<nav class="page-sections" aria-label="Resource categories"><span>Explore</span><a href="#selling-resources">Preparing to sell</a><a href="#buying-resources">Planning your next move</a></nav>${groups.map(group=>`<section class="resource-group" id="${group.id}" aria-labelledby="${group.id}-heading"><p class="eyebrow">Your preparation tools</p><h2 id="${group.id}-heading">${group.title}</h2><p>${group.intro}</p><div class="resource-grid">${group.items.map(([href,type,title,detail])=>`<a class="resource-card" href="${href}"><span class="resource-type">${type}</span><h3>${title}</h3><p>${detail}</p><span class="resource-action">Open resource <span aria-hidden="true">→</span></span></a>`).join('')}</div></section>`).join('')}<aside class="resource-help"><div><h2>Not sure where to begin?</h2><p>Tell Brad what you have in mind. You can start a conversation before every decision is made.</p></div><a class="button" href="/contact/#inquiry">Talk With Brad</a></aside>`;}

export function relatedResources(page){
 const items=page.slug==='sell'?[['/seller-checklist/','Seller checklist'],['/listing-photos/','Photo preparation'],['/listing-marketing/','Listing approach']]:page.slug==='buy'?[['/communities/','Community guides'],['/properties/','Featured properties']]:page.slug==='home-valuation'?[['/seller-checklist/','Organize your property details'],['/listing-marketing/','Explore the listing approach']]:page.slug==='about'?[['/sell/','Planning a sale'],['/buy/','Planning a purchase']]:[];
 return items.length?`<aside class="resource-next" aria-labelledby="resource-next-heading"><div><p class="eyebrow">Before your conversation</p><h2 id="resource-next-heading">Keep useful guides close.</h2></div><nav aria-label="Related preparation resources">${items.map(([href,label])=>`<a href="${href}">${label} <span aria-hidden="true">→</span></a>`).join('')}<a href="/resources/">All guides and tools <span aria-hidden="true">→</span></a></nav></aside>`:'';
}
