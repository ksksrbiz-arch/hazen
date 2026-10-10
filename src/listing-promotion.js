const text=value=>typeof value==='string'?value.trim():'';
const oneLine=value=>text(value).replace(/\s+/g,' ');
const money=value=>Number.isFinite(value)&&value>=0?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value):null;
const number=value=>Number.isFinite(value)&&value>=0?new Intl.NumberFormat('en-US').format(value):null;
const contact='Brad Hazen · Realty Pro, Inc.\n(360) 921-9484 · b.hazen@hotmail.com';

// Templates use entered public facts only. Never serialize the listing object.
export function listingPromotion(item,{origin='',published=false,dirty=true,hasUnpublishedChanges=true,publicSlug=''}={}){
 const title=oneLine(item.title)||'Property details',address=oneLine(item.address),status=['Active','Pending','Sold'].includes(item.status)?item.status:'Status not provided';
 const price=money(item.price),facts=[];
 for(const [key,label] of [['beds','bedrooms'],['baths','bathrooms'],['squareFeet','sq ft']]){const value=number(item[key]);if(value!=null)facts.push(value+' '+label);}
 let publicUrl='',tourUrl='';
 try{const base=new URL(origin);if(published&&!dirty&&!hasUnpublishedChanges&&publicSlug===item.slug&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(publicSlug)&&base.protocol==='https:'&&!base.username&&!base.password){publicUrl=base.origin+'/properties/'+publicSlug+'/';}}catch{}
 try{const url=new URL(item.videoUrl);if(url.protocol==='https:'&&!url.username&&!url.password)tourUrl=url.href;}catch{}
 const heading=[title,address,`Status: ${status}`,price?`${status==='Sold'?'Listed price':'Price'}: ${price}`:'',facts.join(' · ')].filter(Boolean).join('\n');
 const action=status==='Sold'?'Contact Brad about selling your property or finding similar homes.':status==='Pending'?'This property is pending. Contact Brad for its current status and similar properties.':'Contact Brad for current availability, property details, and viewing arrangements.';
 const links=[publicUrl?'Property page: '+publicUrl:'',tourUrl?'Tour: '+tourUrl:''].filter(Boolean).join('\n');
 const attribution=text(item.attribution),description=text(item.description),details=[heading,description,links,action,contact,attribution&&attribution!=='Brad Hazen · Realty Pro, Inc.'?'Listing attribution: '+attribution:''].filter(Boolean).join('\n\n');
 const reviewed=/^\d{4}-\d{2}-\d{2}$/.test(item.updatedAt||'')?'Details reviewed: '+item.updatedAt:'';
 const summary=[heading,oneLine(item.mlsId)?'MLS reference: '+oneLine(item.mlsId):'',description,links,reviewed,contact,attribution?'Listing attribution: '+attribution:''].filter(Boolean).join('\n\n');
 return {social:details,email:'Subject: '+title+' — '+status+'\n\n'+details,summary,publicUrl,missing:[!text(item.title)&&'listing title',!address&&'address',!price&&'price',!description&&'description'].filter(Boolean)};
}
