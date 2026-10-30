import {jsPDF} from 'jspdf';
import {contact} from './contact.js';
// Shared by the build-time blank download and the private, browser-only filled export.
export function sellerPdf({groups, notes = ''}) {
  const doc = new jsPDF({unit: 'pt', format: 'letter', compress: true});
  const green = [23, 63, 71],
    gold = [151, 113, 38],
    ink = [36, 48, 51];
  const clean = s =>
    String(s || '')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201c\u201d]/g, '"')
      .replace(/\u2014|\u2013/g, '-')
      .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
  const text = (value, x, y, size = 11, color = ink, font = 'helvetica', style = 'normal') => {
    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.text(clean(value), x, y);
  };
  function header(kicker, title, subtitle) {
    doc.setFillColor(...green);
    doc.rect(0, 0, 612, 12, 'F');
    text('BRAD HAZEN', 42, 44, 12, green, 'helvetica', 'bold');
    text('REAL ESTATE BROKER  /  REALTY PRO, INC.', 42, 61, 8);
    text(kicker, 42, 93, 9, gold, 'helvetica', 'bold');
    text(title, 42, 126, 27, green, 'times');
    text(subtitle, 42, 148, 10);
    doc.setDrawColor(...gold);
    doc.line(42, 163, 570, 163);
  }
  for (let page = 0; page < 2; page++) {
    if (page) doc.addPage();
    header(
      'YOUR SELLER CONVERSATION',
      page ? 'Shape the listing plan.' : 'Start with what matters.',
      page
        ? 'Preparation, presentation and the questions to settle together.'
        : 'A practical plan to bring to your conversation with Brad.'
    );
    groups.slice(page * 3, page * 3 + 3).forEach((group, index) => {
      const y = 191 + index * 166;
      text(String(page * 3 + index + 1).padStart(2, '0'), 42, y, 11, gold, 'helvetica', 'bold');
      text(group.title, 70, y, 17, green, 'times');
      group.items.forEach((item, j) => {
        const top = y + 24 + j * 31;
        doc.setDrawColor(130, 145, 145);
        doc.setLineWidth(0.7);
        doc.roundedRect(45, top - 8, 10, 10, 1, 1);
        if (item.reviewed) {
          doc.setDrawColor(...green);
          doc.setLineWidth(1.4);
          doc.line(47, top - 3, 50, top);
          doc.line(50, top, 54, top - 6);
        }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        doc.setTextColor(...ink);
        doc.text(doc.splitTextToSize(clean(item.label), 488), 66, top);
      });
      text('Notes', 45, y + 122, 8, [90, 104, 106]);
      doc.setDrawColor(200, 208, 206);
      doc.setLineWidth(0.5);
      doc.line(79, y + 124, 566, y + 124);
      doc.line(45, y + 145, 566, y + 145);
    });
    text(
      page
        ? 'Next step: bring this plan to Brad and agree on priorities together.'
        : 'Use the boxes to mark topics reviewed. Leave room for questions.',
      42,
      706,
      10,
      green
    );
  }
  if (notes.trim()) {
    doc.addPage();
    header(
      'YOUR SELLER CONVERSATION',
      'Your questions & notes.',
      'Your entries from the website. Nothing has been sent to Brad.'
    );
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    let y = 193;
    for (const line of doc.splitTextToSize(clean(notes.slice(0, 1200)), 520)) {
      if (y > 700) {
        doc.addPage();
        header('YOUR SELLER CONVERSATION', 'Notes, continued.', '');
        y = 193;
      }
      text(line, 42, y);
      y += 17;
    }
  }
  for (let p = 1; p <= doc.getNumberOfPages(); p++) {
    doc.setPage(p);
    doc.setDrawColor(200, 208, 206);
    doc.line(42, 730, 570, 730);
    text('bradhazen.com  |  ' + contact.phone + '  |  ' + contact.email, 42, 749, 9, green);
    text('Keep sensitive documents and access codes separate.', 42, 765, 8);
    text(p + ' / ' + doc.getNumberOfPages(), 548, 765, 8);
  }
  doc.setProperties({
    title: 'Seller Conversation Checklist | Brad Hazen',
    author: 'Brad Hazen | Realty Pro, Inc.',
    subject: 'Seller preparation and conversation planning'
  });
  return doc;
}
