#!/usr/bin/env node
// ============================================================
// CRATES -- Discogs enrichment + cover downloader (run locally)
//
//   npm run records:update
//
// Reads src/data/crates/collection.csv, and for every release_id NOT
// already cached (or whose cover file is missing), calls the Discogs
// API to fetch genres/styles + the primary cover image. Covers are
// downloaded and self-hosted under public/crates/covers/{id}.jpg, and
// genre/style data is written to src/data/crates/enriched.json.
//
// Incremental: adding N records fetches only those N. Outputs are
// committed, so the Vercel build stays a pure static build with no
// secret and no network access.
//
// Requires a free Discogs personal access token:
//   Discogs -> Settings -> Developers -> Generate token
//   then put it in a local .env file:  DISCOGS_TOKEN=xxxxxxxx
//   (run with: npm run records:update, which loads .env via Node)
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCsv } from './lib/parse-csv.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CSV_PATH = path.join(ROOT, 'src/data/crates/collection.csv');
const ENRICHED_PATH = path.join(ROOT, 'src/data/crates/enriched.json');
const COVERS_DIR = path.join(ROOT, 'public/crates/covers');

const TOKEN = process.env.DISCOGS_TOKEN;
const USER_AGENT = 'JonathanMKellyCrates/1.0 +https://www.jonathanmkelly.com';
const API = 'https://api.discogs.com/releases/';
const THROTTLE_MS = 1200; // < 60 req/min, with headroom
const MAX_RETRIES = 3;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

function loadJson(p, fallback) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
}

function saveEnriched(data) {
  const sorted = {};
  for (const k of Object.keys(data).sort((a, b) => Number(a) - Number(b))) {
    sorted[k] = data[k];
  }
  fs.writeFileSync(ENRICHED_PATH, JSON.stringify(sorted, null, 2) + '\n');
}

async function fetchRelease(id) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    let resp;
    try {
      resp = await fetch(API + id, {
        headers: {
          Authorization: `Discogs token=${TOKEN}`,
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
        },
      });
    } catch (err) {
      console.warn(`  network error (${id}), attempt ${attempt}: ${err.message}`);
      await sleep(2000 * attempt);
      continue;
    }

    if (resp.status === 429) {
      const retryAfter = Number(resp.headers.get('Retry-After')) || 60;
      console.warn(`  rate-limited; backing off ${retryAfter}s...`);
      await sleep((retryAfter + 1) * 1000);
      continue; // retry same id without counting it as an attempt cost
    }
    if (resp.status === 404) {
      console.warn(`  ${id}: not found (404) -- caching empty.`);
      return { genres: [], styles: [], hasCover: false };
    }
    if (!resp.ok) {
      console.warn(`  ${id}: HTTP ${resp.status}, attempt ${attempt}`);
      await sleep(1500 * attempt);
      continue;
    }
    return resp.json();
  }
  console.warn(`  ${id}: giving up after ${MAX_RETRIES} attempts (will retry next run).`);
  return null;
}

async function downloadCover(url, destPath) {
  const resp = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!resp.ok) throw new Error(`cover HTTP ${resp.status}`);
  const type = resp.headers.get('content-type') || '';
  if (!type.startsWith('image/')) throw new Error(`not an image (${type})`);
  const buf = Buffer.from(await resp.arrayBuffer());
  fs.writeFileSync(destPath, buf);
}

async function main() {
  if (!TOKEN) {
    console.error(
      '\n  Missing DISCOGS_TOKEN.\n' +
        '  Create a token at Discogs -> Settings -> Developers, then add it to a\n' +
        '  local .env file at the repo root:\n\n' +
        '      DISCOGS_TOKEN=your_token_here\n\n' +
        '  and run:  npm run records:update\n'
    );
    process.exit(1);
  }

  fs.mkdirSync(COVERS_DIR, { recursive: true });
  const csv = fs.readFileSync(CSV_PATH, 'utf8');
  const rows = parseCsv(csv);
  const enriched = loadJson(ENRICHED_PATH, {});

  // Unique numeric release_ids in CSV order.
  const seen = new Set();
  const ids = [];
  for (const r of rows) {
    const id = (r['release_id'] || '').trim();
    if (/^\d+$/.test(id) && !seen.has(id)) {
      seen.add(id);
      ids.push(id);
    }
  }

  // Worklist: not cached, OR cached-with-cover but the file went missing.
  const work = ids.filter((id) => {
    const cached = enriched[id];
    if (!cached) return true;
    if (cached.hasCover && !fs.existsSync(path.join(COVERS_DIR, `${id}.jpg`))) return true;
    return false;
  });

  console.log(`\n  ${ids.length} releases in collection, ${work.length} to fetch.\n`);
  if (work.length === 0) {
    console.log('  Nothing to do -- enrichment is up to date.\n');
    return;
  }

  let done = 0;
  try {
    for (const id of work) {
      done++;
      process.stdout.write(`  [${done}/${work.length}] ${id} ... `);
      const data = await fetchRelease(id);
      if (data === null) {
        await sleep(THROTTLE_MS);
        continue; // leave uncached -> retried next run
      }

      const genres = Array.isArray(data.genres) ? data.genres : [];
      const styles = Array.isArray(data.styles) ? data.styles : [];

      let hasCover = false;
      const images = Array.isArray(data.images) ? data.images : [];
      const cover = images.find((im) => im.type === 'primary') || images[0];
      const coverUrl = cover && (cover.uri || cover.resource_url);
      if (coverUrl) {
        try {
          await downloadCover(coverUrl, path.join(COVERS_DIR, `${id}.jpg`));
          hasCover = true;
        } catch (err) {
          console.warn(`(cover failed: ${err.message}) `);
        }
      }

      enriched[id] = { genres, styles, hasCover };
      console.log(
        `${genres.join('/') || 'no genre'}${hasCover ? ' +cover' : ''}`
      );
      await sleep(THROTTLE_MS);
    }
  } finally {
    saveEnriched(enriched);
    console.log(`\n  Wrote ${ENRICHED_PATH}`);
    console.log(`  Covers in ${COVERS_DIR}\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
