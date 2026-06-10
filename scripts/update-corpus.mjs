#!/usr/bin/env node
// ============================================================
// AIcorpus -- one-command updater for the hidden Working Corpus
// explorer served at /AIcorpus.
//
//   npm run corpus:update                     (reads ./index.html at repo root)
//   npm run corpus:update -- path/to/new.html (explicit source)
//
// Byte-faithfully overwrites public/AIcorpus/index.html with the new
// standalone artifact -- a pure copy, never an edit. Before copying it
// sanity-checks the source REALLY is the corpus explorer (robots noindex
// meta + "The Working Corpus" header + d3 from cdnjs), so a stray/wrong
// file can't clobber the deploy. Prints a hash + marker report and the
// exact commit/deploy commands. See DEPLOY_BRIEF.md for the full routine.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DEST = path.join(ROOT, 'public', 'AIcorpus', 'index.html');

function fail(msg) {
  console.error(`\n  ✗ ${msg}\n`);
  process.exit(1);
}

const SRC = path.resolve(ROOT, process.argv[2] || 'index.html');

if (!fs.existsSync(SRC)) {
  fail(
    `No source file at ${path.relative(ROOT, SRC)}.\n` +
      `  Drop the new explorer at the repo root as index.html and run\n` +
      `    npm run corpus:update\n` +
      `  or pass its path explicitly:\n` +
      `    npm run corpus:update -- path/to/new-index.html`
  );
}
if (path.resolve(SRC) === path.resolve(DEST)) {
  fail('Source and destination are the same file -- nothing to do.');
}

const bytes = fs.readFileSync(SRC);
const text = bytes.toString('utf8');

// Guard: the source must look like the Working Corpus explorer.
const markers = [
  ['robots noindex meta', /<meta\s+name=["']robots["']\s+content=["']\s*noindex/i],
  ['"The Working Corpus" header', /The Working Corpus/],
  ['d3 from cdnjs', /cdnjs\.cloudflare\.com\/ajax\/libs\/d3\//i],
];
const missing = markers.filter(([, re]) => !re.test(text));
if (missing.length) {
  fail(
    `That file doesn't look like the corpus explorer. Missing:\n` +
      missing.map(([n]) => `      - ${n}`).join('\n') +
      `\n  Refusing to overwrite ${path.relative(ROOT, DEST)}.`
  );
}

const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const prev = fs.existsSync(DEST) ? fs.readFileSync(DEST) : null;
const prevSha = prev ? sha(prev) : null;
const newSha = sha(bytes);

fs.mkdirSync(path.dirname(DEST), { recursive: true });
fs.copyFileSync(SRC, DEST); // byte-faithful: no parsing, no reformatting

console.log(`\n  ✓ ${path.relative(ROOT, DEST)}`);
console.log(`     from   ${path.relative(ROOT, SRC)}`);
console.log(`     size   ${bytes.length} bytes`);
console.log(`     sha256 ${newSha}`);

if (prevSha === newSha) {
  console.log(`\n  Identical to the file already deployed -- nothing to commit.\n`);
  process.exit(0);
}

console.log(prevSha ? `     (was   ${prevSha})` : `     (new file)`);
console.log(`\n  Markers OK: robots noindex, "The Working Corpus", d3/cdnjs.`);
console.log(`\n  Next -- commit & deploy:`);
console.log(`     git add public/AIcorpus/index.html`);
console.log(`     git commit -m "Update Working Corpus explorer at /AIcorpus"`);
console.log(`     git push origin main\n`);
