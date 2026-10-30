import {contact} from '../src/contact.js';
const e = value =>
  String(value ?? '').replace(
    /[&<>"']/g,
    c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]
  );
export function conversationWorksheet({
  label,
  groups,
  download,
  notesLabel,
  notesPlaceholder,
  notesHint,
  nextTitle,
  nextText,
  nextHref,
  nextLabel
}) {
  return `<section class="seller-worksheet" data-conversation-worksheet aria-label="${e(label)}"><div class="worksheet-toolbar"><div><p class="eyebrow">Your personal planning session</p><h2>A clearer next move starts here.</h2><p>Check the prompts you’ve reviewed and add questions for Brad. This page does not upload or save your entries. Download or print your worksheet to retain them.</p></div><div class="worksheet-actions"><button type="button" data-download-worksheet hidden>Download My Worksheet</button><button type="button" data-print-worksheet hidden>Print Checklist</button><button type="button" data-reset-worksheet hidden>Clear Checks and Notes</button><a href="${e(download)}" download>${download.endsWith('.pdf') ? 'Download Blank PDF' : 'Download Blank Text Version'}</a></div></div><div class="worksheet-progress-panel" data-worksheet-progress-panel hidden><p class="worksheet-progress" data-worksheet-progress role="status" aria-live="polite" hidden></p><progress data-worksheet-meter aria-label="Worksheet prompts reviewed" max="${groups.reduce((total, group) => total + group[2].length, 0)}" value="0"></progress></div><p class="worksheet-feedback" data-worksheet-feedback role="status" aria-live="polite"></p><noscript><p>Use your browser’s Print command to print this checklist. The checkboxes and notes can be used without JavaScript.</p></noscript><nav class="worksheet-topic-nav" aria-label="Worksheet sections">${groups.map(([title], i) => `<a href="#worksheet-section-${i}"><span aria-hidden="true">0${i + 1}</span>${e(title)}</a>`).join('')}<a href="#worksheet-notes">Your notes</a></nav><div class="worksheet-grid">${groups.map(([title, detail, prompts], i) => `<section class="worksheet-card" id="worksheet-section-${i}" tabindex="-1" aria-labelledby="worksheet-topic-${i}"><div class="worksheet-card-top"><span class="worksheet-number" aria-hidden="true">0${i + 1}</span><span class="worksheet-section-progress" data-worksheet-section-progress hidden></span></div><h3 id="worksheet-topic-${i}">${e(title)}</h3><p>${e(detail)}</p><div>${prompts.map((prompt, j) => `<label><input type="checkbox" id="worksheet-check-${i}-${j}"><span class="worksheet-check-text">${e(prompt)}</span></label>`).join('')}</div></section>`).join('')}</div><section class="worksheet-notes"><label for="worksheet-notes">${e(notesLabel)}</label><textarea id="worksheet-notes" rows="4" maxlength="1200" aria-describedby="worksheet-notes-hint worksheet-note-count" placeholder="${e(notesPlaceholder)}"></textarea><p class="worksheet-print-notes" data-worksheet-print-notes></p><div class="worksheet-note-meta"><small id="worksheet-notes-hint">${e(notesHint)}</small><small id="worksheet-note-count" data-worksheet-note-count hidden></small></div></section><div class="worksheet-next"><div><h2>${e(nextTitle)}</h2><p>${e(nextText)}</p></div><a class="button" href="${e(nextHref)}">${e(nextLabel)}</a></div><p class="worksheet-print-contact">Brad Hazen · Real Estate Broker · Realty Pro, Inc.<br>${contact.phone} · ${contact.email}</p></section>`;
}
