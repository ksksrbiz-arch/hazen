import {conversationWorksheet} from './conversation-worksheet.mjs';
export const buyerGroups=[
 ['Your next move','Clarify what you want to change and where you have flexibility.',[
  'Write down why you are considering a move.','Identify a preferred timeline and any flexibility.','List the questions you want to bring to Brad.']],
 ['Places and daily routines','Start with the places and practical needs that matter to you.',[
  'List communities you would like to explore.','Note destinations and travel times you want to check yourself.','Identify access, parking or everyday convenience needs.']],
 ['Must-haves and preferences','Separate essential property features from nice-to-haves.',[
  'List the home or land features you need.','Identify preferences you could compromise on.','Note layout, outdoor space or accessibility questions.']],
 ['Financing conversation','Prepare questions for your lender before making commitments.',[
  'Ask your lender about financing options and next steps.','Ask about upfront and ongoing ownership costs.','Keep financial documents separate from website inquiries.']],
 ['Property visits','Use consistent questions when reviewing properties.',[
  'Compare the property facts with your must-haves.','Note condition or inspection questions to discuss.','Check information that needs an official source or specialist.']],
 ['Your conversation with Brad','Bring your priorities and decide on the next step together.',[
  'Choose a few priorities to discuss first.','Bring property addresses or public listing links of interest.','Ask how the next steps and updates will be handled.']]
];
export const buyerWorksheetPage={slug:'buyer-checklist',title:'Your home-buying conversation checklist',intro:'Organize the priorities and questions for your next home purchase. Work through the prompts, keep your notes, and bring them to Brad.',sections:[]};
export const buyerChecklistText='BRAD HAZEN — BUYER CONVERSATION CHECKLIST\n\n'+buyerGroups.map(([title,detail,prompts],i)=>`${i+1}. ${title}\n${detail}\n${prompts.map(prompt=>'[ ] '+prompt).join('\n')}\nNotes: ______________________________`).join('\n\n')+'\n\nKeep financial documents and sensitive personal information separate from website inquiries.\n\nBrad Hazen · Realty Pro, Inc.\n(360) 921-9484 · b.hazen@hotmail.com\n';
export function buyerWorksheet(){return conversationWorksheet({label:'Buyer conversation worksheet',groups:buyerGroups,download:'/resources/buyer-conversation-checklist.txt',notesLabel:'Priorities and questions to bring to Brad (optional)',notesPlaceholder:'Which property features matter most, and what would you like to understand before your next move?',notesHint:'Use general property priorities. Keep financial documents, account details and sensitive personal information separate.',nextTitle:'Ready to discuss your next move?',nextText:'Download or print your notes before leaving this page. Use them when preparing your inquiry.',nextHref:'/buy/#inquiry',nextLabel:'Talk With Brad About Buying'});}
