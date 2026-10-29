const escape = value =>
  String(value).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]);
const dateOK = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '') && new Date(value).toISOString().slice(0, 10) === value;
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
export function blogCards(posts) {
  return `<div class="notes-grid">${posts.map(post => `<article><p class="eyebrow"><time datetime="${escape(post.publishedOn)}">${escape(post.publishedOn)}</time></p><h2><a href="/blog/${escape(post.slug)}/">${escape(post.title)}</a></h2><p>${escape(post.summary)}</p></article>`).join('')}</div>`;
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
      customBody: `<article class="real-estate-note"><p>By Brad Hazen · <time datetime="${escape(post.publishedOn)}">${escape(post.publishedOn)}</time></p>${post.sections.map(section => `<section><h2>${escape(section.heading)}</h2>${section.paragraphs.map(text => `<p>${escape(text)}</p>`).join('')}</section>`).join('')}<a href="/contact/#inquiry">Talk with Brad about your next move</a><p><a href="/blog/">All real estate notes</a></p></article>`
    }))
  ];
}
export const latestNotes = posts =>
  posts.length
    ? `<section class="section"><p class="eyebrow">From Brad</p><h2>Real estate notes</h2>${blogCards(posts.slice(0, 2))}</section>`
    : '';
