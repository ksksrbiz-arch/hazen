const menu = document.querySelector('.mobile-nav');
if (menu) {
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
  document.addEventListener('click', event => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  menu.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => {
      menu.open = false;
    })
  );
  menu.addEventListener('focusout', () =>
    queueMicrotask(() => {
      if (!menu.contains(document.activeElement)) menu.open = false;
    })
  );
  window.matchMedia('(min-width: 1151px)').addEventListener('change', event => {
    if (event.matches) menu.open = false;
  });
}

// Draft only: no inquiry data is uploaded or stored by the website.
document.querySelectorAll('[data-inquiry]').forEach(form => {
  const backup = form.querySelector('.email-backup'),
    status = form.querySelector('.form-status');
  const interest = form.elements.interest,
    location = form.elements.location,
    sellerContext = form.querySelector('.seller-context');
  const errorsPanel = form.querySelector('[data-inquiry-errors]');
  let validationAttempted = false,
    lastIssuesSignature = '';
  const stepItems = [...form.closest('.inquiry-panel').querySelectorAll('.inquiry-steps li')];
  const setInquiryStage = stage =>
    stepItems.forEach((item, i) => {
      if (i === stage - 1) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
  const errorFor = field => {
    if (field.disabled) return '';
    if (field.required && !field.value.trim())
      return (
        {
          name: 'Enter your name.',
          email: 'Enter your email address.',
          interest: 'Choose a topic for your conversation.',
          location: 'Enter the property address for your assessment.'
        }[field.name] || 'Complete this field.'
      );
    if (!field.checkValidity())
      return field.type === 'email'
        ? 'Enter a valid email address, such as name@example.com.'
        : 'Check this field before continuing.';
    return '';
  };
  const renderInquiryErrors = () => {
    const issues = [];
    for (const field of form.querySelectorAll(
      '.inquiry-fields input,.inquiry-fields select,.inquiry-fields textarea'
    )) {
      const message = validationAttempted ? errorFor(field) : '',
        wrapper = field.closest('.inquiry-field'),
        id = field.id + '-error';
      let note = wrapper.querySelector('.inquiry-field-error');
      if (!note) {
        note = document.createElement('p');
        note.className = 'inquiry-field-error';
        note.id = id;
        wrapper.append(note);
      }
      if (note.textContent !== message) note.textContent = message;
      note.hidden = !message;
      const described = (field.getAttribute('aria-describedby') || '')
        .split(/\s+/)
        .filter(value => value && value !== id);
      if (message) {
        field.setAttribute('aria-invalid', 'true');
        described.push(id);
        issues.push({field, message});
      } else field.removeAttribute('aria-invalid');
      if (described.length) field.setAttribute('aria-describedby', described.join(' '));
      else field.removeAttribute('aria-describedby');
    }
    const signature = JSON.stringify(issues.map(({field, message}) => [field.id, message]));
    const list = errorsPanel.querySelector('[data-inquiry-error-list]');
    if (signature !== lastIssuesSignature) {
      list.replaceChildren();
      for (const {field, message} of issues) {
        const row = document.createElement('li'),
          link = document.createElement('a');
        link.href = '#' + field.id;
        link.textContent = message;
        link.addEventListener('click', event => {
          event.preventDefault();
          field.focus();
        });
        row.append(link);
        list.append(row);
      }
      lastIssuesSignature = signature;
    }
    const count = errorsPanel.querySelector('[data-inquiry-error-count]'),
      countText =
        issues.length +
        ' ' +
        (issues.length === 1 ? 'field needs' : 'fields need') +
        ' a quick check. Your other details are still here.';
    if (count.textContent !== countText) count.textContent = countText;
    errorsPanel.hidden = !issues.length;
    if (validationAttempted) {
      const feedback = issues.length
        ? 'Review the highlighted fields to prepare your draft. Nothing has been sent.'
        : 'Your details are ready to review. Nothing has been sent.';
      if (status.textContent !== feedback) status.textContent = feedback;
    }
    return issues;
  };
  setInquiryStage(1);

  if (form.dataset.inquiry === 'contact' && !interest.value) {
    const startingPoint = communityInquiryContext(window.location.search, inquiryCommunities);
    if (startingPoint) {
      interest.value = startingPoint.interest;
      if (!location.value) location.value = startingPoint.location;
      const context = form.closest('.inquiry-panel')?.querySelector('[data-inquiry-context]');
      if (context) {
        context.textContent =
          'Starting with ' + startingPoint.location + '. You can change the topic or location below.';
        context.hidden = false;
      }
    }
  }
  const goalLinks = [...document.querySelectorAll('[data-seller-goal]')];
  const syncGoal = () =>
    goalLinks.forEach(link => {
      if (interest.value === 'Selling a home' && link.dataset.sellerGoal === form.elements.sellerGoal.value)
        link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  const invalidateDraft = () => {
    if (!backup.hidden) {
      backup.hidden = true;
      form.classList.remove('reviewing-draft');
      setInquiryStage(1);
      backup.querySelector('[data-open-email]').removeAttribute('href');
      status.textContent = 'Your details changed. Review your draft again before opening an email.';
    }
  };
  const updateTopic = () => {
    const sellerRelated = ['Selling a home', 'A home assessment'].includes(interest.value);
    sellerContext.hidden = !sellerRelated;
    sellerContext.querySelectorAll('input,select,textarea').forEach(control => (control.disabled = !sellerRelated));
    syncGoal();
    const assessment = interest.value === 'A home assessment',
      address = assessment || ['Selling a home', 'Request a showing', 'A property inquiry'].includes(interest.value);
    location.required = assessment;
    location.setCustomValidity('');
    form.querySelector('[data-location-label]').textContent = address
      ? 'Property address' + (assessment ? ' *' : ' (optional)')
      : interest.value === 'Buying a home'
        ? 'Preferred communities (optional)'
        : 'Property or community (optional)';
    form.querySelector('#location-hint').textContent = address
      ? 'Include the city, if you know it.'
      : interest.value === 'Buying a home'
        ? 'Share the places you are considering.'
        : 'Add a place or property, if relevant.';
  };
  interest.addEventListener('change', () => {
    invalidateDraft();
    updateTopic();
    if (validationAttempted) renderInquiryErrors();
  });
  updateTopic();
  goalLinks.forEach(link =>
    link.addEventListener('click', () => {
      if (!sellerGoals.includes(link.dataset.sellerGoal)) return;
      interest.value = 'Selling a home';
      form.elements.sellerGoal.value = link.dataset.sellerGoal;
      updateTopic();
      invalidateDraft();
      sellerContext.open = true;
      form.elements.name.focus({preventScroll: true});
    })
  );
  form.querySelector('button[type="submit"]').disabled = false;
  form.addEventListener('input', event => {
    if (event.target.matches('input,select,textarea')) event.target.setCustomValidity('');
    invalidateDraft();
    syncGoal();
    if (validationAttempted) renderInquiryErrors();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    validationAttempted = true;
    const issues = renderInquiryErrors();
    if (issues.length) {
      status.textContent = 'Review the highlighted fields to prepare your draft. Nothing has been sent.';
      issues[0].field.focus();
      return;
    }
    setInquiryStage(2);
    const data = new FormData(form);
    const value = key => String(data.get(key) || '').trim();
    const body = inquiryDraftBody(data);
    const href =
      contact.emailHref +
      '?subject=' +
      encodeURIComponent('Website inquiry: ' + value('interest')) +
      '&body=' +
      encodeURIComponent(body);
    backup.hidden = false;
    form.classList.add('reviewing-draft');
    backup.querySelector('textarea').value = body;
    backup.querySelector('[data-open-email]').href = href;
    backup.querySelector('[data-email-subject]').textContent = 'Subject: Website inquiry: ' + value('interest');
    status.textContent = 'Your draft is ready to review. Nothing has been sent.';
    backup.querySelector('h3').focus({preventScroll: true});
    backup.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  });
  form.querySelector('.edit-inquiry').addEventListener('click', () => {
    backup.hidden = true;
    form.classList.remove('reviewing-draft');
    backup.querySelector('[data-open-email]').removeAttribute('href');
    setInquiryStage(1);
    validationAttempted = false;
    renderInquiryErrors();
    status.textContent = 'Update your details, then review the draft again.';
    form.elements.name.focus();
  });
  form.querySelector('.copy-message').addEventListener('click', async () => {
    const field = form.querySelector('.email-backup textarea');
    try {
      await navigator.clipboard.writeText(field.value);
      form.querySelector('.form-status').textContent =
        'Message copied. Paste it into an email to ' + contact.email + ' and send it.';
    } catch {
      field.focus();
      field.select();
      form.querySelector('.form-status').textContent =
        'Select and copy the prepared message, then paste it into your email.';
    }
  });
  form.noValidate = true;
  form.inert = false;
});

// Property tools enhance ordinary image links; the page remains usable without JavaScript.
const property = document.querySelector('[data-property]');
if (property) {
  const print = property.querySelector('[data-print-property]');
  print.hidden = false;
  print.addEventListener('click', () => window.print());
  if (property.dataset.preview !== 'true') {
    const share = property.querySelector('[data-share-property]'),
      message = property.querySelector('[data-share-status]'),
      fallback = property.querySelector('[data-share-fallback]');
    const url = window.location.origin + window.location.pathname,
      title = document.querySelector('h1').textContent;
    share.hidden = false;
    share.addEventListener('click', async () => {
      share.disabled = true;
      fallback.hidden = true;
      try {
        if (navigator.share) {
          await navigator.share({title, url});
          message.textContent = 'Listing shared.';
        } else {
          await navigator.clipboard.writeText(url);
          message.textContent = 'Listing link copied.';
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          try {
            await navigator.clipboard.writeText(url);
            message.textContent = 'Listing link copied.';
          } catch {
            fallback.hidden = false;
            const input = fallback.querySelector('input');
            input.value = url;
            input.focus();
            input.select();
            message.textContent = 'Copy the listing link below to share it.';
          }
        }
      } finally {
        share.disabled = false;
      }
    });
    const email = property.querySelector('[data-showing-email]');
    if (email) {
      const href = new URL(email.href);
      href.searchParams.set(
        'body',
        'I would like to ask about this property:\n' +
          title +
          '\n' +
          url +
          '\n\nMy preferred times:\nMy name:\nMy phone number:'
      );
      email.href = href.href;
    }
  }
  const links = [...property.querySelectorAll('[data-gallery-photo]')];
  if (links.length && typeof HTMLDialogElement !== 'undefined') {
    const dialog = document.createElement('dialog');
    dialog.className = 'photo-viewer';
    dialog.setAttribute('aria-label', 'Property photo viewer');
    dialog.innerHTML =
      '<div class="viewer-toolbar"><p class="viewer-count" role="status" aria-live="polite"></p><button type="button" class="viewer-close" autofocus>Close Photos</button></div><figure><img alt=""><figcaption></figcaption></figure><p class="viewer-error" role="status"></p><div class="viewer-navigation"><button type="button" class="viewer-prev" aria-label="Previous photo">← Previous</button><p>Use arrow keys to browse</p><button type="button" class="viewer-next" aria-label="Next photo">Next →</button></div>';
    document.body.append(dialog);
    const image = dialog.querySelector('img'),
      caption = dialog.querySelector('figcaption'),
      count = dialog.querySelector('.viewer-count'),
      error = dialog.querySelector('.viewer-error');
    let index = 0,
      opener = null,
      touch = null;
    const show = next => {
      index = (next + links.length) % links.length;
      const original = links[index].querySelector('img');
      error.textContent = '';
      image.alt = original.alt;
      image.src = links[index].href;
      caption.textContent = original.alt;
      count.textContent = 'Photo ' + (index + 1) + ' of ' + links.length;
    };
    image.addEventListener('error', () => {
      error.textContent = 'This photo could not load. Try another photo or close the viewer.';
    });
    dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
    for (const [selector, step] of [
      ['.viewer-prev', -1],
      ['.viewer-next', 1]
    ]) {
      const button = dialog.querySelector(selector);
      button.disabled = links.length < 2;
      button.addEventListener('click', () => show(index + step));
    }
    links.forEach((link, i) =>
      link.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        opener = link;
        show(i);
        dialog.showModal();
        document.body.classList.add('gallery-open');
      })
    );
    dialog.addEventListener('close', () => {
      document.body.classList.remove('gallery-open');
      opener?.focus();
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)
        dialog.close();
    });
    dialog.addEventListener('keydown', event => {
      const next =
        event.key === 'ArrowRight'
          ? index + 1
          : event.key === 'ArrowLeft'
            ? index - 1
            : event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? links.length - 1
                : null;
      if (next !== null) {
        event.preventDefault();
        show(next);
      }
    });
    image.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch') touch = {x: event.clientX, y: event.clientY, id: event.pointerId};
    });
    image.addEventListener('pointerup', event => {
      if (!touch || touch.id !== event.pointerId) return;
      const dx = event.clientX - touch.x,
        dy = event.clientY - touch.y;
      touch = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(index + (dx < 0 ? 1 : -1));
    });
    image.addEventListener('pointercancel', () => {
      touch = null;
    });
  }
}

// A page-only worksheet: no account, storage, or network submission.
const worksheet = document.querySelector('[data-conversation-worksheet], [data-seller-worksheet]');
if (worksheet) {
  worksheet.classList.add('worksheet-enhanced');
  const checks = [...worksheet.querySelectorAll('input[type="checkbox"]')],
    notes = worksheet.querySelector('#worksheet-notes'),
    printNotes = worksheet.querySelector('[data-worksheet-print-notes]'),
    progress = worksheet.querySelector('[data-worksheet-progress]');
  const meter = worksheet.querySelector('[data-worksheet-meter]'),
    progressPanel = worksheet.querySelector('[data-worksheet-progress-panel]'),
    noteCount = worksheet.querySelector('[data-worksheet-note-count]'),
    sections = [...worksheet.querySelectorAll('.worksheet-card')].map(card => ({
      card,
      checks: [...card.querySelectorAll('input[type="checkbox"]')],
      count: card.querySelector('[data-worksheet-section-progress]')
    }));
  let worksheetExported = false;
  const updateWorksheet = () => {
    const reviewed = checks.filter(check => check.checked).length,
      progressText =
        reviewed +
        ' of ' +
        checks.length +
        ' prompts reviewed' +
        (reviewed === checks.length ? ' · Bring your questions to the conversation.' : '.');
    if (progress.textContent !== progressText) progress.textContent = progressText;
    if (meter) {
      meter.max = checks.length;
      if (meter.value !== reviewed) meter.value = reviewed;
      meter.setAttribute('aria-valuetext', reviewed + ' of ' + checks.length + ' prompts reviewed');
    }
    for (const section of sections) {
      const count = section.checks.filter(check => check.checked).length;
      section.card.classList.toggle('is-reviewed', count === section.checks.length);
      if (section.count) {
        const text = count + ' of ' + section.checks.length + ' reviewed';
        if (section.count.textContent !== text) section.count.textContent = text;
        section.count.hidden = false;
      }
    }
    if (noteCount) {
      noteCount.hidden = false;
      noteCount.textContent = notes.value.length + ' of ' + notes.maxLength.toLocaleString() + ' characters';
    }
    printNotes.textContent =
      notes.value.trim() || 'Questions / notes: __________________________________________________________';
  };
  worksheet.addEventListener('input', updateWorksheet);
  worksheet.addEventListener('change', updateWorksheet);
  window.addEventListener('pageshow', updateWorksheet);
  window.addEventListener('beforeprint', updateWorksheet);
  const printButton = worksheet.querySelector('[data-print-worksheet]'),
    resetButton = worksheet.querySelector('[data-reset-worksheet]'),
    downloadButton = worksheet.querySelector('[data-download-worksheet]'),
    feedback = worksheet.querySelector('[data-worksheet-feedback]');
  printButton.hidden = resetButton.hidden = progress.hidden = false;
  if (progressPanel) progressPanel.hidden = false;
  if (downloadButton) {
    downloadButton.hidden = false;
    downloadButton.addEventListener('click', () => {
      const content = worksheetText({
        title: document.querySelector('h1').textContent,
        items: checks.map(check => ({
          label: check.closest('label').querySelector('.worksheet-check-text').textContent,
          reviewed: check.checked
        })),
        notes: notes.value
      });
      const url = URL.createObjectURL(new Blob([content], {type: 'text/plain;charset=utf-8'})),
        link = document.createElement('a');
      link.href = url;
      link.download =
        (window.location.pathname.includes('buyer-checklist') ? 'buyer' : 'seller') + '-conversation-worksheet.txt';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      worksheetExported = true;
      feedback.textContent =
        'Your worksheet was downloaded with the current checks and notes. Nothing was sent to Brad.';
    });
    worksheet.addEventListener('input', () => {
      if (worksheetExported)
        feedback.textContent = 'Your worksheet changed. Download it again to keep the latest checks and notes.';
      else if (feedback.textContent) feedback.textContent = '';
    });
  }
  printButton.addEventListener('click', () => {
    updateWorksheet();
    window.print();
  });
  resetButton.addEventListener('click', () => {
    if ((checks.some(check => check.checked) || notes.value) && !confirm('Clear this page’s checks and notes?')) return;
    checks.forEach(check => (check.checked = false));
    notes.value = '';
    worksheetExported = false;
    if (feedback) feedback.textContent = 'Checks and notes cleared on this page.';
    updateWorksheet();
    checks[0]?.focus();
  });
  updateWorksheet();
}

const photoGuidePrint = document.querySelector('[data-print-guide]');
if (photoGuidePrint) {
  photoGuidePrint.hidden = false;
  photoGuidePrint.addEventListener('click', () => window.print());
}

// Filter the public guide hub in place; links remain available without JavaScript.
const resourceFinder = document.querySelector('[data-resource-finder]');
if (resourceFinder) {
  const search = resourceFinder.querySelector('#resource-search'),
    topic = resourceFinder.querySelector('#resource-topic'),
    count = resourceFinder.querySelector('[data-resource-count]'),
    empty = document.querySelector('[data-resource-empty]');
  const groups = [...document.querySelectorAll('.resource-group')].map(group => ({
    group,
    cards: [...group.querySelectorAll('.resource-card')].map(card => ({
      card,
      text: card.textContent.toLocaleLowerCase()
    }))
  }));
  const update = () => {
    const terms = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let matches = 0;
    for (const {group, cards} of groups) {
      let visible = 0;
      for (const {card, text} of cards) {
        const show = (topic.value === 'all' || topic.value === group.id) && terms.every(term => text.includes(term));
        card.hidden = !show;
        if (show) visible++;
      }
      group.hidden = visible === 0;
      matches += visible;
    }
    empty.hidden = matches !== 0;
    count.textContent =
      matches + ' of ' + groups.reduce((total, {cards}) => total + cards.length, 0) + ' guides shown.';
  };
  resourceFinder.hidden = false;
  search.addEventListener('input', update);
  topic.addEventListener('change', update);
  resourceFinder.querySelector('[data-resource-clear]').addEventListener('click', () => {
    search.value = '';
    topic.value = 'all';
    update();
    search.focus();
  });
  const categoryLinks = document.querySelector('.page-sections');
  categoryLinks?.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    const category = link.getAttribute('href')?.slice(1);
    if (!groups.some(({group}) => group.id === category)) return;
    topic.value = category;
    search.value = '';
    update();
  });
  window.addEventListener('pageshow', update);
  update();
}

// Temporary shortlist of public community guides, with an allowlisted inquiry handoff.
const communityCompare = document.querySelector('[data-community-compare]');
if (communityCompare) {
  const choices = [...communityCompare.querySelectorAll('input[type="checkbox"]')],
    cards = [...communityCompare.querySelectorAll('[data-compare-card]')],
    status = communityCompare.querySelector('[data-compare-status]'),
    clear = communityCompare.querySelector('[data-compare-clear]'),
    contact = communityCompare.querySelector('[data-compare-contact]'),
    link = communityCompare.querySelector('[data-compare-inquiry]'),
    empty = communityCompare.querySelector('[data-compare-empty]');
  const update = () => {
    // Browser history can restore controls; keep the same three-community limit.
    const selected = choices.filter(choice => choice.checked);
    selected.slice(3).forEach(choice => (choice.checked = false));
    const slugs = selected.slice(0, 3).map(choice => choice.value);
    choices.forEach(choice => (choice.disabled = slugs.length === 3 && !choice.checked));
    cards.forEach(card => (card.hidden = !slugs.includes(card.dataset.compareCard)));
    status.textContent =
      slugs.length +
      ' of 3 communities selected.' +
      (slugs.length === 3 ? ' Uncheck one to choose a different area.' : '');
    clear.disabled = slugs.length === 0;
    empty.hidden = slugs.length !== 0;
    contact.hidden = slugs.length === 0;
    link.href = slugs.length
      ? '/contact/?communities=' + encodeURIComponent(slugs.join(',')) + '#inquiry'
      : '/contact/#inquiry';
  };
  communityCompare.hidden = false;
  const jump = document.querySelector('[data-compare-jump]');
  if (jump) jump.hidden = false;
  communityCompare.addEventListener('change', update);
  clear.addEventListener('click', () => {
    choices.forEach(choice => (choice.checked = false));
    update();
    choices[0]?.focus();
  });
  window.addEventListener('pageshow', update);
  update();
}

// Native question disclosures remain usable without JavaScript.
for (const faqSection of document.querySelectorAll('.faq-section')) {
  const toggle = faqSection.querySelector('[data-toggle-faq]'),
    answers = [...faqSection.querySelectorAll('#faq-answers details')];
  if (!toggle || !answers.length) continue;
  const update = () => {
    const label = answers.every(answer => answer.open) ? 'Hide All Answers' : 'Show All Answers';
    if (toggle.textContent !== label) toggle.textContent = label;
  };
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    const open = !answers.every(answer => answer.open);
    answers.forEach(answer => (answer.open = open));
    update();
  });
  answers.forEach(answer => answer.addEventListener('toggle', update));
  update();
}

// Keep the selected on-page link clear and let native anchors handle scrolling.
for (const sectionNav of document.querySelectorAll('.page-sections[aria-label="On this page"]')) {
  const entries = [...sectionNav.querySelectorAll('a[href^="#"]')]
    .map(link => ({link, target: document.getElementById(link.getAttribute('href').slice(1))}))
    .filter(entry => entry.target);
  const update = () =>
    entries.forEach(({link}) => {
      if (link.getAttribute('href') === window.location.hash) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  entries.forEach(({target}) => {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  });
  window.addEventListener('hashchange', update);
  update();
}
