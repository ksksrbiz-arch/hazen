import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync, readFileSync, existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
// Browser and server modules are only ever executed in a browser/Worker, so a syntax error can ship unnoticed.
const dirs = ['src', 'server', 'functions', 'scripts'];
function jsFiles(dir) {
  const found = [];
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...jsFiles(full));
    else if (/\.(m?js)$/.test(entry.name)) found.push(full);
  }
  return found;
}
for (const file of dirs.flatMap(jsFiles)) {
  test(`parses as an ES module: ${file}`, () => {
    const result = spawnSync(process.execPath, ['--input-type=module', '--check'], {input: readFileSync(file)});
    assert.equal(result.status, 0, result.stderr.toString());
  });
}
test('every built browser script parses (when dist exists)', {skip: !existsSync('dist')}, () => {
  for (const file of jsFiles('dist')) {
    const result = spawnSync(process.execPath, ['--input-type=module', '--check'], {input: readFileSync(file)});
    assert.equal(result.status, 0, file + '\n' + result.stderr.toString());
  }
});

test(
  'every relative import in built browser modules resolves to a built file (when dist exists)',
  {skip: !existsSync('dist')},
  () => {
    const missing = [];
    for (const file of jsFiles('dist')) {
      for (const match of readFileSync(file, 'utf8').matchAll(/^import .* from '(\.[^']+)'/gm)) {
        if (!existsSync(path.join(path.dirname(file), match[1]))) missing.push(`${file} imports ${match[1]}`);
      }
    }
    assert.deepEqual(missing, []);
  }
);
