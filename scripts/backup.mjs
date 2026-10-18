// Exports the production listing database and every registered photo to a local folder.
//   npm run backup                       -> backups/<date>/
//   npm run backup -- --out some/folder  -> custom folder
//   npm run backup -- --verify some/folder
// Needs `wrangler` authenticated for the Cloudflare account that owns the Hazen D1 database and R2 bucket.
// Backups contain private authorization notes and unpublished drafts: keep them off the public repository.
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {backupPhotos, parsePhotoRows, verifyBackup, writeManifest} from './backup-lib.mjs';

const run = promisify(execFile);
const args = process.argv.slice(2);
const option = name => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};
const database = option('--db') ?? 'hazen-listings';
const bucket = option('--bucket') ?? 'hazen-listing-photos';
const remote = args.includes('--local') ? '--local' : '--remote';
// Run the installed wrangler with this Node binary: `npx` is npx.cmd on Windows and cannot be spawned without a shell.
const wranglerBin = fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js', import.meta.url));
const wrangler = (...wranglerArgs) =>
  run(process.execPath, [wranglerBin, ...wranglerArgs], {maxBuffer: 64 * 1024 * 1024});

if (option('--verify')) {
  const problems = await verifyBackup(option('--verify'));
  if (problems.length) {
    console.error('Backup problems:\n' + problems.join('\n'));
    process.exit(1);
  }
  console.log('Backup verified: all files match the manifest.');
  process.exit(0);
}

const outDir = option('--out') ?? `backups/${new Date().toISOString().slice(0, 10)}`;
await mkdir(outDir, {recursive: true});
console.log(`Exporting ${database} and ${bucket} to ${outDir} (${remote.slice(2)})`);

await wrangler('d1', 'export', database, remote, '--output', `${outDir}/database.sql`);
const listing = await wrangler(
  'd1',
  'execute',
  database,
  remote,
  '--json',
  '--command',
  'SELECT key, bytes FROM photos ORDER BY key'
);
const photos = parsePhotoRows(listing.stdout);
const {results, problems} = await backupPhotos({
  photos,
  outDir,
  download: (key, target) => wrangler('r2', 'object', 'get', `${bucket}/${key}`, remote, '--file', target)
});
const manifest = await writeManifest({outDir, databaseFile: 'database.sql', photos: results, problems});
console.log(`Database exported. Photos: ${results.length} of ${photos.length} saved.`);
if (!manifest.complete) {
  console.error('Backup INCOMPLETE:\n' + problems.join('\n'));
  process.exit(1);
}
console.log('Backup complete. Verify later with: npm run backup -- --verify ' + outDir);
