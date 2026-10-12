// Minimal static server for dist/ with directory indexes and the generated 404 page.
import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../dist');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain',
  '.json': 'application/json'
};
// Same security headers the deployed site sends, so CSP problems show up here.
const headersFile = await readFile(path.join(root, '_headers'), 'utf8');
const globalHeaders = {};
for (const line of headersFile.split('\n').slice(1)) {
  if (/^\S/.test(line)) break;
  const m = line.trim().match(/^([\w-]+):\s*(.+)$/);
  if (m) globalHeaders[m[1]] = m[2];
}
async function find(url) {
  const clean = decodeURIComponent(new URL(url, 'http://x').pathname),
    target = path.normalize(path.join(root, clean));
  if (!target.startsWith(root)) return null;
  for (const candidate of [target, path.join(target, 'index.html')]) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {}
  }
  return null;
}
http
  .createServer(async (request, response) => {
    const file = await find(request.url),
      status = file ? 200 : 404,
      body = await readFile(file || path.join(root, '404.html'));
    response.writeHead(status, {
      ...globalHeaders,
      'Content-Type': types[path.extname(file || 'x.html')] || 'application/octet-stream'
    });
    response.end(body);
  })
  .listen(Number(process.env.PORT) || 4173);
