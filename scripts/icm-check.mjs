#!/usr/bin/env node
// icm-check: verifies a project follows the ICM layout (see README.md and principles.md).
// Zero dependencies. Usage:
//   node bin/icm-check.mjs [projectDir] [--root-only]
//
// Rules (defaults; override in <projectDir>/.icmcheck.json):
//   - CLAUDE.md exists and is a router: <= rootMax lines (80)
//   - CLAUDE.md has a "Load | Do not load" table and an exclusion rule
//   - <context>/references/*.md are <= refMax lines (200)       (context = "context" or ".ai")
//   - every <context>/workflows/**/CONTEXT.md has Input, Process, Output, Completion sections
//     (and Stop conditions when "requireStopConditions" is true)
//   - every top-level workflow has its own "Load | Do not load" table
//   - every top-level workflow directory is routed from CLAUDE.md
//   - backticked repo paths and `npm run` scripts named in CLAUDE.md and context files exist
// --root-only checks only the root router (for repos that are not themselves ICM projects).
import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs';
import {join, relative, resolve} from 'node:path';

export const DEFAULTS = {rootMax: 80, refMax: 200, requireStopConditions: false, contextDirs: ['context', '.ai']};

const lineCount = text => text.replace(/\n$/, '').split('\n').length;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (name === 'node_modules' || name === '.git') continue;
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}

export function check(projectDir, options = {}) {
  const root = resolve(projectDir);
  const problems = [];
  const fail = msg => problems.push(msg);
  const rel = p => relative(root, p).split('\\').join('/');

  let cfg = {...DEFAULTS};
  const cfgPath = join(root, '.icmcheck.json');
  if (existsSync(cfgPath)) {
    try {
      cfg = {...cfg, ...JSON.parse(readFileSync(cfgPath, 'utf8'))};
    } catch (e) {
      fail(`.icmcheck.json is not valid JSON: ${e.message}`);
    }
  }

  // Root router.
  const claudePath = join(root, 'CLAUDE.md');
  if (!existsSync(claudePath)) {
    fail('CLAUDE.md is missing (the root router)');
    return {problems, summary: null};
  }
  const claude = readFileSync(claudePath, 'utf8');
  const rootLines = lineCount(claude);
  if (rootLines > cfg.rootMax) fail(`CLAUDE.md is ${rootLines} lines; router cap is ${cfg.rootMax}`);
  if (!/\|\s*Load\s*\|\s*Do not load\s*\|/i.test(claude))
    fail('CLAUDE.md needs a table with "Load" and "Do not load" columns');
  if (!/exclusion/i.test(claude)) fail('CLAUDE.md needs an explicit exclusion rule (say what NOT to load)');

  if (options.rootOnly) {
    return {problems, summary: `root router ${rootLines}/${cfg.rootMax} lines (root-only check)`};
  }

  // Context directory.
  const ctxName = cfg.contextDirs.find(d => existsSync(join(root, d)) && statSync(join(root, d)).isDirectory());
  if (!ctxName) {
    fail(`no context directory found (looked for: ${cfg.contextDirs.join(', ')})`);
    return {problems, summary: null};
  }
  const ctx = join(root, ctxName);
  const ctxFiles = [...walk(ctx)].filter(p => p.endsWith('.md'));

  // References stay small.
  const refDir = join(ctx, 'references');
  const refs = existsSync(refDir) ? ctxFiles.filter(p => p.startsWith(refDir)) : [];
  for (const f of refs) {
    const n = lineCount(readFileSync(f, 'utf8'));
    if (n > cfg.refMax) fail(`${rel(f)} is ${n} lines; reference cap is ${cfg.refMax}`);
  }

  // Workflow contracts.
  const wfRoot = join(ctx, 'workflows');
  const contracts = existsSync(wfRoot) ? ctxFiles.filter(p => p.startsWith(wfRoot) && p.endsWith('CONTEXT.md')) : [];
  const sections = [
    [/^## Inputs?\b/m, 'Input'],
    [/^## Process\b/m, 'Process'],
    [/^## Outputs?\b/m, 'Output'],
    [/^## Completion\b/m, 'Completion']
  ];
  if (cfg.requireStopConditions) sections.push([/^## Stop conditions\b/m, 'Stop conditions']);
  for (const f of contracts) {
    const text = readFileSync(f, 'utf8');
    for (const [re, name] of sections) if (!re.test(text)) fail(`${rel(f)} is missing "## ${name}"`);
  }
  const topLevelDirs = existsSync(wfRoot)
    ? readdirSync(wfRoot).filter(n => statSync(join(wfRoot, n)).isDirectory())
    : [];
  for (const w of topLevelDirs) {
    const f = join(wfRoot, w, 'CONTEXT.md');
    if (!existsSync(f)) {
      fail(`${ctxName}/workflows/${w}/ has no CONTEXT.md`);
      continue;
    }
    if (!/\|\s*Load\s*\|\s*Do not load\s*\|/i.test(readFileSync(f, 'utf8')))
      fail(`${rel(f)} needs a "Load | Do not load" table`);
    if (!claude.includes(`${ctxName}/workflows/${w}/`) && !claude.includes(`workflows/${w}/`)) {
      fail(`CLAUDE.md does not route to ${ctxName}/workflows/${w}/`);
    }
  }

  // Named paths and npm scripts exist.
  let scripts = null;
  const pkgPath = join(root, 'package.json');
  if (existsSync(pkgPath)) {
    try {
      scripts = JSON.parse(readFileSync(pkgPath, 'utf8')).scripts || {};
    } catch {
      fail('package.json is not valid JSON');
    }
  }
  const docs = [claudePath, ...ctxFiles];
  const skipToken = t => /[*<>{}…]|\.\.\./.test(t);
  for (const f of docs) {
    const text = readFileSync(f, 'utf8');
    for (const m of text.matchAll(/`([^`\s]+)`/g)) {
      const t = m[1].replace(/[.,;:]+$/, '');
      if (skipToken(t)) continue;
      if (t.startsWith(`${ctxName}/`)) {
        if (!existsSync(join(root, t))) fail(`${rel(f)} names a path that does not exist: ${t}`);
      } else if (/^(workflows|references)\//.test(t)) {
        if (!existsSync(join(ctx, t))) fail(`${rel(f)} names a context path that does not exist: ${ctxName}/${t}`);
      }
    }
    if (scripts) {
      for (const m of text.matchAll(/npm run ([a-z0-9:_-]+)/gi)) {
        if (!scripts[m[1]]) fail(`${rel(f)} names an npm script that does not exist: ${m[1]}`);
      }
    }
  }

  return {
    problems,
    summary: `router ${rootLines}/${cfg.rootMax} lines, ${contracts.length} workflow contracts, ${refs.length} references (context dir: ${ctxName}/)`
  };
}

// CLI
const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname);
if (isMain) {
  const args = process.argv.slice(2);
  const rootOnly = args.includes('--root-only');
  const dir = args.find(a => !a.startsWith('--')) || '.';
  const {problems, summary} = check(dir, {rootOnly});
  if (problems.length) {
    console.error(`ICM check FAILED for ${resolve(dir)}:\n - ${problems.join('\n - ')}`);
    process.exit(1);
  }
  console.log(`ICM check OK: ${summary}`);
}
