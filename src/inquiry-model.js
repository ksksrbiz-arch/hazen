export const sellerGoals=['Pricing guidance','Preparing to list','Marketing my property'];
export const sellerPropertyTypes=['House','Condo or townhome','Land or acreage','Other or not sure'];

export function inquiryDraftBody(data){
 const value=key=>String(data.get(key)||'').trim();
 const lines=[`Name: ${value('name')}`,`Email: ${value('email')}`,`Phone: ${value('phone')||'Not supplied'}`,`Interest: ${value('interest')}`,`Location / property: ${value('location')||'Not supplied'}`,`Timing: ${value('timing')||'Just exploring'}`];
 if(['Selling a home','A home assessment'].includes(value('interest'))){
  if(sellerGoals.includes(value('sellerGoal')))lines.push('Conversation focus: '+value('sellerGoal'));
  if(sellerPropertyTypes.includes(value('propertyType')))lines.push('Property type: '+value('propertyType'));
  if(value('propertyFeatures'))lines.push('Property features / updates: '+value('propertyFeatures').slice(0,600));
 }
 return [...lines,'',value('message')].join('\n');
}
