// Pure helpers for scripts/backup.mjs so the logic can be tested without Cloudflare access.
import {createHash} from 'node:crypto';
import {mkdir, readFile, stat, writeFile} from 'node:fs/promises';
import path from 'node:path';

export const photoKeyPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/listing-[0-9a-f-]{36}\.(jpg|png|webp)$/;

// `wrangler d1 execute --json` prints an array of result sets.
export function parsePhotoRows(output) {
  const sets = JSON.parse(output);
  const rows = Array.isArray(sets) ? (sets[0]?.results ?? []) : [];
  return rows.map(row => {
    if (!photoKeyPattern.test(row.key) || !Number.isInteger(row.bytes) || row.bytes < 0) {
      throw new Error('Unexpected photo record: ' + JSON.stringify(row).slice(0, 120));
    }
    return {key: row.key, bytes: row.bytes};
  });
}

export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

// Downloads every registered photo and checks size, so a partial backup is never reported as complete.
export async function backupPhotos({photos, outDir, download}) {
  const results = [];
  const problems = [];
  for (const photo of photos) {
    const target = path.join(outDir, 'photos', photo.key);
    await mkdir(path.dirname(target), {recursive: true});
    try {
      await download(photo.key, target);
      const bytes = await readFile(target);
      if (bytes.length !== photo.bytes) {
        problems.push(`${photo.key}: expected ${photo.bytes} bytes, got ${bytes.length}`);
        continue;
      }
      results.push({key: photo.key, bytes: bytes.length, sha256: sha256(bytes)});
    } catch (error) {
      problems.push(`${photo.key}: ${error.message}`);
    }
  }
  return {results, problems};
}

export async function writeManifest({outDir, databaseFile, photos, problems, now = new Date()}) {
  const database = await readFile(path.join(outDir, databaseFile));
  const manifest = {
    createdAt: now.toISOString(),
    complete: problems.length === 0,
    database: {file: databaseFile, bytes: (await stat(path.join(outDir, databaseFile))).size, sha256: sha256(database)},
    photoCount: photos.length,
    photos,
    problems
  };
  await writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  return manifest;
}

// Re-hash an existing backup folder; returns a list of problems (empty when intact).
export async function verifyBackup(outDir) {
  const manifest = JSON.parse(await readFile(path.join(outDir, 'manifest.json'), 'utf8'));
  const problems = [...manifest.problems];
  if (!manifest.complete) problems.push('Manifest says the backup is incomplete');
  const database = await readFile(path.join(outDir, manifest.database.file)).catch(() => null);
  if (!database || sha256(database) !== manifest.database.sha256) problems.push('Database export missing or changed');
  for (const photo of manifest.photos) {
    const bytes = await readFile(path.join(outDir, 'photos', photo.key)).catch(() => null);
    if (!bytes || sha256(bytes) !== photo.sha256) problems.push('Photo missing or changed: ' + photo.key);
  }
  return problems;
}
