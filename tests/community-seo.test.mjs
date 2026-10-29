import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {communityGuides} from '../scripts/community-guides.mjs';
import {pageSeo} from '../scripts/seo.mjs';
import {publishedPosts} from '../scripts/blog.mjs';

test('six community guides have distinct sourced content and usable search metadata', () => {
  assert.equal(Object.keys(communityGuides).length, 6);
  const titles = new Set();
  for (const [slug, sections] of Object.entries(communityGuides)) {
    assert.ok(sections.length >= 4);
    assert.ok(sections.filter(section => section[2]).length >= 2);
    for (const [, , source] of sections) if (source) assert.equal(new URL(source).protocol, 'https:');
    const title = slug.replaceAll('-', ' ');
    const seo = pageSeo({slug: `communities/${slug}`, title}, 'fallback');
    assert.ok(seo.title.includes('WA Community Guide'));
    assert.ok(seo.description.includes(title));
    assert.ok(seo.title.length < 75);
    titles.add(seo.title);
  }
  assert.equal(titles.size, 6);
});

test('researched blog drafts cannot publish without Brad approval', async () => {
  const posts = JSON.parse(await readFile(new URL('../src/posts.json', import.meta.url), 'utf8'));
  assert.equal(posts.length, 2);
  for (const post of posts) {
    assert.equal(post.status, 'draft');
    assert.equal(post.approvedByBrad, false);
    assert.ok(post.sections.length >= 4);
  }
  assert.deepEqual(publishedPosts(posts), []);
});
