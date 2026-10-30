import {contact} from '../src/contact.js';
import {sellerGoals} from '../src/inquiry-model.js';
export const sellerChecklist = [
  ['Your goals', 'Preferred timing, what matters most in the sale, and questions about your next move.'],
  ['Property essentials', 'Address, home or land type, approximate size, and the features buyers should understand.'],
  ['Improvements and condition', 'A simple list of updates, approximate dates, and known items to discuss.'],
  [
    'What makes it distinctive',
    'Outdoor space, layout, views, access, or other features that can be accurately documented.'
  ],
  [
    'Presentation and access',
    'Available authorized photos, your preparation priorities, and showing arrangements to discuss.'
  ],
  [
    'Questions for the listing plan',
    'Proposed price, included marketing services, any additional costs, and how updates will be communicated.'
  ]
];

export const sellerChecklistText =
  'BRAD HAZEN — SELLER CONVERSATION CHECKLIST\n\n' +
  sellerChecklist
    .map(([title, detail], i) => `${i + 1}. ${title}\n${detail}\nNotes: ______________________________`)
    .join('\n\n') +
  '\n\nBring general property information. Do not send financial documents, access codes, or sensitive personal records through the website.\n\nDiscuss the final marketing services, scope, costs, and timing with Brad before proceeding.\n\nBrad Hazen · Realty Pro, Inc.\n' +
  contact.phone +
  ' · ' +
  contact.email +
  '\n';

export function sellerHomepage() {
  return `<section class="seller-feature section" aria-labelledby="seller-feature-heading"><div class="seller-feature-copy"><p class="eyebrow">For your next listing</p><h2 id="seller-feature-heading">Put your property’s strongest details forward.</h2><p>A clear presentation gives buyers a place to explore the photos, understand the property, and take the next step with Brad.</p><ul><li>A dedicated property page with photos and key details</li><li>A shareable link for the listing conversation</li><li>A direct way to ask about the home or a showing</li></ul><div class="page-actions"><a class="button" href="/listing-marketing/">Explore the Listing Approach</a><a href="/sell/#inquiry">Talk About My Property</a></div></div><figure><img src="/assets/prairie-home.webp" width="600" height="338" alt="Illustrative country home in a Pacific Northwest landscape" loading="lazy" decoding="async"><figcaption>Original AI-generated illustration · not an actual listing</figcaption></figure></section>`;
}

export function sellerPreparation() {
  return `<section class="seller-preparation" id="seller-ready" aria-labelledby="seller-ready-heading"><div><p class="eyebrow">Before your first conversation</p><h2 id="seller-ready-heading">Bring the details. Start with your goals.</h2><p>You can explore a sale before every decision is made. Use these prompts to organize what you already know and the questions you want to ask.</p><a class="seller-download" href="/seller-checklist/">Open the Printable Seller Checklist <span>Review, check, and print · no sign-up required</span></a><a class="seller-text-download" href="/resources/seller-conversation-checklist.pdf" download>Download the printable PDF</a><p class="seller-private-note">Bring general property information. Keep financial documents, access codes, and sensitive records out of website inquiries.</p></div><ol>${sellerChecklist.map(([title, detail], i) => `<li><span aria-hidden="true">0${i + 1}</span><div><h3>${title}</h3><p>${detail}</p></div></li>`).join('')}</ol></section>`;
}

export function sellerMarketingPage() {
  return `<section class="marketing-plan" id="marketing-plan" aria-labelledby="marketing-plan-heading"><p class="eyebrow">A plan to discuss with Brad</p><h2 id="marketing-plan-heading">Shape the listing around the property.</h2><p class="marketing-lead">Start with the facts and your priorities, then agree on how the property will be presented and promoted.</p><div class="marketing-stages"><article><span>01 · Position</span><h3>Find the strongest story</h3><p>Identify the property’s defining features, the questions buyers may have, and the price and timing you want to discuss.</p><small>Discuss: property facts, supporting information, and pricing rationale.</small></article><article><span>02 · Present</span><h3>Make the details easy to explore</h3><p>Organize authorized photos, a clear description, key facts, and any available tour into a dedicated property page.</p><small>Discuss: photography, preparation, permissions, and the listing description.</small><a class="marketing-resource-link" href="/listing-photos/">Plan Your Listing Photos →</a></article><article><span>03 · Share</span><h3>Choose the right channels</h3><p>Use the property page as a destination for agreed outreach. Discuss brokerage exposure, agent connections, social posts, and any proposed paid promotion.</p><small>Confirm: included channels, who handles them, budget, and additional costs.</small></article><article><span>04 · Review</span><h3>Keep the conversation moving</h3><p>Agree on how inquiries and showing feedback will be reviewed, how updates will be shared, and when the approach should be revisited.</p><small>Confirm: communication cadence, feedback, and decisions.</small></article></div></section><section class="listing-showcase" id="showcase" aria-labelledby="showcase-heading"><figure><img src="/assets/guide-home.webp" width="600" height="338" alt="Illustrative landscaped home entrance" loading="lazy" decoding="async"><figcaption>AI-generated illustration · not Brad’s listing</figcaption></figure><div><p class="eyebrow">One place to explore the property</p><h2 id="showcase-heading">A dedicated page for your listing.</h2><p>When an approved listing is published, buyers can explore its photos and details, share the page, print a property sheet, and prepare a question for Brad.</p><ul><li>Photo gallery and property description</li><li>Price, status, and available property facts</li><li>Tour link when one is provided</li><li>Direct contact and a showing inquiry</li></ul><a href="/properties/">View Brad’s Property Collection →</a></div></section><aside class="marketing-agreement"><h2>Agree on the scope before launch.</h2><p>Photography, brokerage distribution, advertising, and other services should be confirmed with Brad for your property. The final plan depends on the listing and your goals; a sale price or sale date is not guaranteed.</p></aside>${sellerPreparation()}`;
}

export function sellerConversationChoices() {
  const descriptions = [
    'Explore the property’s position and questions about its value.',
    'Discuss presentation, preparation, and the steps before launch.',
    'Talk through a proposed presentation and outreach plan.'
  ];
  return `<section class="seller-conversation" aria-labelledby="conversation-heading"><p class="eyebrow">Start where you are</p><h2 id="conversation-heading">What would you like to discuss?</h2><p>Choose a starting point for your conversation with Brad.</p><div>${sellerGoals.map((goal, i) => `<a href="#inquiry" data-seller-goal="${goal}"><span class="conversation-number" aria-hidden="true">0${i + 1}</span><h3>${goal}</h3><p>${descriptions[i]}</p><span class="conversation-action">Start this conversation <span aria-hidden="true">→</span></span></a>`).join('')}</div></section>`;
}
