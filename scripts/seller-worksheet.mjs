import {conversationWorksheet} from './conversation-worksheet.mjs';
import {sellerChecklist} from './seller-marketing.mjs';
export const prompts = [
  [
    'Identify your preferred selling timeline.',
    'List your priorities for the sale and next move.',
    'Write down the questions you want to ask Brad.'
  ],
  [
    'Gather the address and basic property information.',
    'Note the home or land type and approximate size.',
    'Identify features that need supporting information.'
  ],
  [
    'List major updates and their approximate dates.',
    'Note known condition questions to discuss.',
    'Ask Brad about preparation before committing to work.'
  ],
  [
    'List the property’s distinctive indoor features.',
    'Describe outdoor space, access, or other highlights.',
    'Separate confirmed facts from details that need review.'
  ],
  [
    'Identify available photos and who authorized their use.',
    'Discuss photography and property presentation.',
    'Discuss practical showing arrangements with Brad.'
  ],
  [
    'Ask about pricing and the proposed marketing approach.',
    'Confirm included services and any additional costs.',
    'Agree on how inquiries, feedback, and updates will be discussed.'
  ]
];
export function sellerWorksheet() {
  return conversationWorksheet({
    label: 'Seller conversation worksheet',
    groups: sellerChecklist.map(([title, detail], i) => [title, detail, prompts[i]]),
    download: '/resources/seller-conversation-checklist.pdf',
    notesLabel: 'Questions to bring to Brad (optional)',
    notesPlaceholder: 'What would you like to understand before deciding on a listing plan?',
    notesHint: 'Use general property questions here. Keep sensitive documents and access codes separate.',
    nextTitle: 'Ready to discuss your property?',
    nextText: 'Download or print your notes before leaving this page. Use them when preparing your inquiry.',
    nextHref: '/sell/#inquiry',
    nextLabel: 'Talk With Brad About Selling'
  });
}
