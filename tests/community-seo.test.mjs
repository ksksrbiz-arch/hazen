import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {communityGuides} from '../scripts/community-guides.mjs';
import {pageSeo, structuredData} from '../scripts/seo.mjs';
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
  assert.equal(posts.length, 3);
  for (const post of posts) {
    assert.equal(post.status, 'draft');
    assert.equal(post.approvedByBrad, false);
    assert.ok(post.sections.length >= 4);
  }
  assert.deepEqual(publishedPosts(posts), []);
});

test('community shares use the matching licensed photograph with a descriptive alternative', async () => {
  const photos = JSON.parse(await readFile(new URL('../src/community-photos.json', import.meta.url), 'utf8'));
  for (const [slug, photo] of Object.entries(photos)) {
    const seo = pageSeo({slug: `communities/${slug}`, title: slug, photo}, 'fallback');
    assert.equal(seo.image, `https://bradhazen.com/assets/${photo.file}`);
    assert.equal(seo.imageAlt, photo.caption);
  }
  const home = pageSeo({slug: '', title: 'Home'}, 'description');
  assert.match(home.imageAlt, /Illustrative/);
});

test('community structured data retains the breadcrumb hierarchy and cannot close its script element', () => {
  const page = {slug: 'communities/camas', title: 'Camas'};
  const seo = pageSeo(page, 'description');
  seo.description = '</script><script>alert(1)</script>';
  const markup = structuredData(page, seo);
  assert.equal((markup.match(/<script/g) || []).length, 1);
  const graph = JSON.parse(markup.slice(markup.indexOf('>') + 1, markup.lastIndexOf('</script>')))['@graph'];
  const trail = graph.find(node => node['@type'] === 'BreadcrumbList');
  assert.deepEqual(
    trail.itemListElement.map(item => item.name),
    ['Home', 'Communities', 'Camas']
  );
  assert.equal(graph.find(node => node['@type'] === 'WebPage').description, seo.description);
});

test('community structured data describes the community and preserves the actual photo credit', async () => {
  const photos = JSON.parse(await readFile(new URL('../src/community-photos.json', import.meta.url), 'utf8'));
  for (const [slug, photo] of Object.entries(photos)) {
    const page = {slug: `communities/${slug}`, title: slug, photo};
    const seo = pageSeo(page, 'description');
    const markup = structuredData(page, seo);
    const graph = JSON.parse(markup.slice(markup.indexOf('>') + 1, markup.lastIndexOf('</script>')))['@graph'];
    const webpage = graph.find(node => node['@type'] === 'WebPage');
    const subject = graph.find(node => node['@id'] === webpage.about['@id']);
    assert.equal(subject['@type'], 'Place');
    assert.equal(subject.name, `${slug}, Washington`);
    assert.equal(graph.find(node => node['@id'] === webpage.publisher['@id']).name, 'Brad Hazen');
    const image = graph.find(node => node['@id'] === webpage.primaryImageOfPage['@id']);
    assert.equal(image.contentUrl, seo.image);
    assert.equal(image.caption, photo.caption);
    assert.equal(image.creditText, `${photo.author} · ${photo.license}`);
    assert.equal(image.license, photo.licenseUrl);
    assert.equal(image.isBasedOn, photo.source);
  }
});
