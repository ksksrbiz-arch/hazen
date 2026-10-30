import test from 'node:test';
import assert from 'node:assert/strict';
import {publishedPosts, blogPages, latestNotes} from '../scripts/blog.mjs';
const approved = {
  slug: 'test-note',
  title: 'Test <title>',
  summary: 'Summary',
  status: 'published',
  approvedByBrad: true,
  approvedOn: '2026-10-28',
  publishedOn: '2026-10-29',
  sourceReference: 'private interview',
  privateNotes: 'NEVER PUBLIC',
  sections: [{heading: 'A heading', paragraphs: ['A <script> is text.']}]
};
test('drafts never create public routes or reveal private notes', () => {
  assert.deepEqual(blogPages(publishedPosts([{...approved, status: 'draft'}])), []);
});
test('publication requires actual approval and source', () => {
  for (const update of [
    {approvedByBrad: false},
    {approvedByBrad: 'false'},
    {sourceReference: ''},
    {approvedOn: '2026-02-30'},
    {approvedOn: '2026-13-01'},
    {publishedOn: '2026-00-10'},
    {slug: '../secret'}
  ])
    assert.throws(() => publishedPosts([{...approved, ...update}], '2026-10-29'));
});
test('future articles stay unpublished and duplicate slugs fail', () => {
  assert.equal(publishedPosts([{...approved, publishedOn: '2026-11-01'}], '2026-10-29').length, 0);
  assert.throws(() => publishedPosts([approved, approved], '2026-10-29'));
});
test('rendered articles escape content and omit editorial metadata', () => {
  const pages = blogPages(publishedPosts([approved], '2026-10-29'));
  const html = pages.map(p => p.customBody).join('');
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('NEVER PUBLIC'));
  assert.ok(!html.includes('private interview'));
  assert.ok(!html.includes('<script>'));
});
test('out-of-range dates fail with the publication error, not a RangeError', () => {
  for (const approvedOn of ['2026-13-01', '2026-00-10'])
    assert.throws(
      () => publishedPosts([{...approved, approvedOn}], '2026-10-29'),
      /Published articles require source, Brad approval, dates and content/
    );
});
test('homepage note cards nest under the section heading as h3', () => {
  const home = latestNotes(publishedPosts([approved], '2026-10-29'));
  assert.match(home, /<h2>Real estate notes<\/h2>/);
  assert.match(home, /<h3><a href="\/blog\/test-note\/">/);
  assert.doesNotMatch(home.replace('<h2>Real estate notes</h2>', ''), /<h2/);
  assert.match(blogPages(publishedPosts([approved], '2026-10-29'))[0].customBody, /<h2><a href="\/blog\/test-note\/">/);
});

test('article sources and related tools render safely with section navigation', () => {
  const post = {
    ...approved,
    sources: [
      {title: 'County <records>', url: 'https://clark.wa.gov/records'},
      {title: 'Unsafe', url: 'javascript:alert(1)'},
      {title: 'Credentials', url: 'https://user:pass@example.com/'}
    ],
    relatedLinks: [
      {label: 'Buyer worksheet', href: '/buyer-checklist/'},
      {label: 'External', href: '//example.com/'},
      {label: 'Injection', href: '/bad" onclick="alert(1)'}
    ]
  };
  const html = blogPages(publishedPosts([post], '2026-10-29'))[1].customBody;
  assert.match(html, /County &lt;records&gt;/);
  assert.match(html, /href="https:\/\/clark.wa.gov\/records"/);
  assert.match(html, /href="\/buyer-checklist\/"/);
  assert.match(html, /href="#note-section-1"/);
  assert.match(html, /id="note-section-1" tabindex="-1"/);
  assert.match(html, /1 min read/);
  assert.doesNotMatch(html, /javascript:|user:pass|onclick|href="\/\/example/);
  assert.doesNotMatch(html, /private interview|NEVER PUBLIC/);
});
