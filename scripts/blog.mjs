const escape = value =>
  String(value).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]);
const dateOK = value => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};
export function publishedPosts(posts, today = new Date().toISOString().slice(0, 10)) {
  const seen = new Set();
  return posts
    .filter(post => {
      if (post.status !== 'published') return false;
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug) || seen.has(post.slug))
        throw new Error('Invalid or duplicate blog slug');
      seen.add(post.slug);
      if (
        post.approvedByBrad !== true ||
        !dateOK(post.approvedOn) ||
        !dateOK(post.publishedOn) ||
        !post.sourceReference?.trim() ||
        !post.title?.trim() ||
        !post.summary?.trim() ||
        !post.sections?.length
      )
        throw new Error('Published articles require source, Brad approval, dates and content');
      if (post.approvedOn > today || post.approvedOn > post.publishedOn)
        throw new Error('Invalid article approval date');
      if (
        post.sections.some(
          section =>
            !section.heading?.trim() ||
            !Array.isArray(section.paragraphs) ||
            !section.paragraphs.length ||
            section.paragraphs.some(text => typeof text !== 'string' || !text.trim())
        )
      )
        throw new Error('Article sections require headings and paragraphs');
      return post.publishedOn <= today;
    })
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
}
export function blogCards(posts, heading = 'h2') {
  return `<div class="notes-grid">${posts.map(post => `<article><p class="eyebrow"><time datetime="${escape(post.publishedOn)}">${escape(post.publishedOn)}</time></p><${heading}><a href="/blog/${escape(post.slug)}/">${escape(post.title)}</a></${heading}><p>${escape(post.summary)}</p></article>`).join('')}</div>`;
}
export function blogPages(posts) {
  if (!posts.length) return [];
  return [
    {
      slug: 'blog',
      title: 'Real estate notes',
      intro: 'Practical perspectives from Brad Hazen.',
      sections: [],
      customBody: blogCards(posts)
    },
    ...posts.map(post => ({
      slug: `blog/${post.slug}`,
      title: post.title,
      intro: post.summary,
      sections: [],
      customBody: articleBody(post)
    }))
  ];
}
const sourceURL = value => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
};
export function articleBody(post) {
  const minutes = Math.max(
    1,
    Math.ceil(
      post.sections
        .flatMap(s => s.paragraphs)
        .join(' ')
        .split(/\s+/).length / 200
    )
  );
  const sources = (post.sources || []).filter(source => source.title?.trim() && sourceURL(source.url));
  const links = (post.relatedLinks || []).filter(
    link => link.label?.trim() && /^\/(?!\/)[a-z0-9/-]+(?:#[a-z0-9-]+)?$/.test(link.href)
  );
  return `<article class="real-estate-note"><p class="note-meta">By Brad Hazen · <time datetime="${escape(post.publishedOn)}">${escape(post.publishedOn)}</time> · ${minutes} min read</p><nav class="note-contents" aria-label="In this article"><h2>In this article</h2><ol>${post.sections.map((section, i) => `<li><a href="#note-section-${i + 1}">${escape(section.heading)}</a></li>`).join('')}</ol></nav>${post.sections.map((section, i) => `<section id="note-section-${i + 1}" tabindex="-1"><h2>${escape(section.heading)}</h2>${section.paragraphs.map(text => `<p>${escape(text)}</p>`).join('')}</section>`).join('')}${sources.length ? `<aside class="note-sources" aria-labelledby="note-sources-heading"><h2 id="note-sources-heading">Sources and further reading</h2><p>Check the original resources for current information.</p><ul>${sources.map(source => `<li><a href="${escape(source.url)}">${escape(source.title)}</a></li>`).join('')}</ul></aside>` : ''}${links.length ? `<nav class="note-next" aria-label="Related guides and tools"><h2>Put this into practice</h2>${links.map(link => `<a href="${escape(link.href)}">${escape(link.label)} <span aria-hidden="true">→</span></a>`).join('')}</nav>` : ''}<div class="note-contact"><h2>Talk through your next move</h2><p>Bring your questions and the details that matter to you.</p><a class="button" href="/contact/#inquiry">Start a conversation with Brad</a></div><p><a href="/blog/">← All real estate notes</a></p></article>`;
}
export const latestNotes = posts =>
  posts.length
    ? `<section class="section"><p class="eyebrow">From Brad</p><h2>Real estate notes</h2>${blogCards(posts.slice(0, 2), 'h3')}</section>`
    : '';
