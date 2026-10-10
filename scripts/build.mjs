import {readFile, mkdir, writeFile, rm, copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const content=JSON.parse(await readFile(path.join(root,'src/content.json'),'utf8'));
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nav=[['','Home'],['about','About'],['buy','Buy'],['sell','Sell'],['communities','Communities'],['contact','Contact']];
await rm(path.join(root,'dist'),{recursive:true,force:true});
await mkdir(path.join(root,'dist'),{recursive:true});
await copyFile(path.join(root,'src/styles.css'),path.join(root,'dist/styles.css'));
for(const page of content.pages){
 const dir=path.join(root,'dist',page.slug);await mkdir(dir,{recursive:true});
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escape(page.title)} | Brad Hazen</title><meta name="description" content="${escape(page.intro)}"><link rel="stylesheet" href="/styles.css"></head><body><a class="skip" href="#main">Skip to content</a><div class="notice">Development preview · Content and contact details awaiting approval</div><header><a class="brand" href="/">Brad Hazen</a><nav aria-label="Main navigation">${nav.map(([slug,label])=>`<a href="/${slug}${slug?'/':''}" ${slug===page.slug?'aria-current="page"':''}>${label}</a>`).join('')}</nav></header><main id="main"><p class="eyebrow">Your next chapter</p><h1>${escape(page.title)}</h1><p class="intro">${escape(page.intro)}</p>${page.slug==='contact'?`<p><a href="${escape(content.agentDetails.phoneHref)}">${escape(content.agentDetails.phone)}</a><br><a href="mailto:${escape(content.agentDetails.email)}">${escape(content.agentDetails.email)}</a></p>`:'<a class="button" href="/contact/">Start a conversation</a>'}<div class="grid">${page.sections.map(([title,text])=>`<section class="card"><h2>${escape(title)}</h2><p>${escape(text)}</p></section>`).join('')}</div></main><footer><a href="/properties/">Featured properties</a><a href="/home-valuation/">Home assessment</a><a href="/testimonials/">Testimonials</a><a href="/privacy/">Privacy</a><p>Brad Hazen · Real Estate Broker · Realty Pro, Inc. · License details pending confirmation</p></footer></body></html>`;
 await writeFile(path.join(dir,'index.html'),html);
}
await writeFile(path.join(root,'dist/robots.txt'),'User-agent: *\nDisallow: /\n');
console.log(`Built ${content.pages.length} routes. Preview only: indexing disabled.`);

await writeFile(path.join(root,'dist/_headers'), '/*\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n');
