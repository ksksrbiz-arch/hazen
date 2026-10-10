import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=new URL('../dist/',import.meta.url).pathname;
async function files(dir){const entries=await readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(x=>x.isDirectory()?files(path.join(dir,x.name)):path.join(dir,x.name)))).flat();}
const all=await files(root);let pages=0;
for(const file of all.filter(x=>x.endsWith('.html'))){
 const html=await readFile(file,'utf8');pages++;
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${file}: exactly one primary heading`);
 assert(html.includes('name="viewport"'),`${file}: viewport required`);
 assert(html.includes('noindex'),`${file}: preview must not be indexed`);
 for(const match of html.matchAll(/href="((?:\/[^"#]*)?)#([^" ]+)"/g)){
  const target=match[1]?path.join(root,match[1],match[1].endsWith('/')?'index.html':''):file;
  const destination=await readFile(target,'utf8');
  assert(destination.includes(`id="${match[2]}"`),`${file}: broken anchor ${match[0]}`);
 }
 for(const match of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)){
  const target=path.join(root,match[1]);assert((await stat(target)).isFile()||match[1].endsWith('/'),`${file}: broken ${match[1]}`);
  if(match[1].endsWith('/'))assert((await stat(path.join(target,'index.html'))).isFile());
 }
}
const home=await readFile(path.join(root,'index.html'),'utf8');assert(home.includes('fetchpriority="high"'));assert(!home.includes('REAL TIME HOME SEARCH'));
for(const slug of ['contact','buy','sell','home-valuation']){
 const html=await readFile(path.join(root,slug,'index.html'),'utf8');
 assert(html.includes('type="submit" disabled'),`${slug}: draft form requires JavaScript before enabling`);
 assert(html.includes('<noscript>'),`${slug}: direct contact fallback required`);
}
const studio=await readFile(path.join(root,'studio/index.html'),'utf8');
assert(studio.includes('Draft prototype.')&&studio.includes('no login or website publishing access'));
assert(!studio.includes('type="submit">Publish'));
const contact=await readFile(path.join(root,'contact/index.html'),'utf8');assert(contact.includes('tel:+13609219484'));assert(contact.includes('mailto:b.hazen@hotmail.com'));assert(contact.includes('aria-current="page"'));
for(const image of all.filter(x=>/\.(webp|png|jpg)$/.test(x)))assert((await stat(image)).size<400000,`Oversized image: ${image}`);
console.log(`Checked ${pages} pages: routes, assets, headings, preview restrictions, contact links, and image budget.`);
