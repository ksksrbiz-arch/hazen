import test from 'node:test';
import assert from 'node:assert/strict';
import {publishedPosts, blogPages} from '../scripts/blog.mjs';
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
