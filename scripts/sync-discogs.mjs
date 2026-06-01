#!/usr/bin/env node
// ============================================================
// CRATES -- Discogs collection sync (the auto-update engine)
//
//   npm run sync                  (local, reads DISCOGS_TOKEN from .env)
//   node scripts/sync-discogs.mjs (CI, reads DISCOGS_TOKEN from env)
//
// Pulls the ENTIRE collection straight from the Discogs API -- no manual
// CSV export needed. Writes a clean, normalized src/data/crates/collection.json
// (artist/title/labels/formats/year/genres/styles/folder/date/conditions),
// and incrementally downloads any NEW cover art to public/crates/covers/.
//
// The username is derived from the token (oauth/identity), so the only
// secret required is DISCOGS_TOKEN. Set DISCOGS_USERNAME to override.
//
// This runs in the weekly GitHub Action (.github/workflows/sync-crates.yml),
// which commits the result -- Vercel then redeploys automatically. The data
// the API returns is clean UTF-8 with genres, styles, full format
// descriptions, and accurate vinyl colors.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeClient, downloadImage } from './lib/discogs.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_JSON = path.join(ROOT, 'src/data/crates/collection.json');
const COVERS_DIR = path.join(ROOT, 'public/crates/covers');

const TOKEN = process.env.DISCOGS_TOKEN;

async function main() {
  if (!TOKEN) {
    console.error(
      '\n  Missing DISCOGS_TOKEN.\n' +
        '  Local: add it to a .env file at the repo root (DISCOGS_TOKEN=...) and run `npm run sync`.\n' +
        '  CI: set it as a GitHub Actions secret named DISCOGS_TOKEN.\n'
    );
    process.exit(1);
  }

  fs.mkdirSync(COVERS_DIR, { recursive: true });
  const client = makeClient(TOKEN);

  // Username from the token, unless explicitly overridden.
  let user = process.env.DISCOGS_USERNAME;
  if (!user) {
    const id = await client.get('/oauth/identity');
    if (!id || !id.username) throw new Error('Could not resolve username from token.');
    user = id.username;
  }
  console.log(`\n  Syncing collection for: ${user}`);

  // Folder id -> name (so we can label each record's collection).
  const folders = await client.get(`/users/${user}/collection/folders`);
  const folderName = new Map((folders.folders || []).map((f) => [f.id, f.name]));

  // Collection field id -> name (Media Condition / Sleeve Condition / Notes).
  const fieldName = new Map();
  try {
    const ff = await client.get(`/users/${user}/collection/fields`);
    (ff.fields || []).forEach((f) => fieldName.set(f.id, f.name));
  } catch {
    /* fields are optional */
  }

  // Paginate the whole collection (folder 0 = All).
  const items = [];
  let pageUrl =
    `/users/${user}/collection/folders/0/releases` +
    `?per_page=100&page=1&sort=added&sort_order=desc`;
  while (pageUrl) {
    const data = await client.get(pageUrl);
    if (!data) break;
    items.push(...(data.releases || []));
    pageUrl = data.pagination?.urls?.next || null;
    if (pageUrl) await client.sleep(client.throttleMs);
  }
  console.log(`  Collection items: ${items.length}`);

  // Normalize + incrementally fetch covers.
  const records = [];
  let fetched = 0;
  let skipped = 0;
  let failed = 0;
  for (const it of items) {
    const bi = it.basic_information || {};
    const id = bi.id;
    if (!id) continue;

    const coverPath = path.join(COVERS_DIR, `${id}.jpg`);
    let hasCover = fs.existsSync(coverPath);
    if (hasCover) {
      skipped++;
    } else if (bi.cover_image) {
      try {
        await downloadImage(bi.cover_image, coverPath);
        hasCover = true;
        fetched++;
        await client.sleep(300);
      } catch (e) {
        failed++;
        console.warn(`  cover failed (${id}): ${e.message}`);
      }
    }

    // Conditions / notes come from per-item collection fields.
    let media = '';
    let sleeve = '';
    let notes = '';
    for (const n of it.notes || []) {
      const name = fieldName.get(n.field_id);
      if (name === 'Media Condition') media = n.value;
      else if (name === 'Sleeve Condition') sleeve = n.value;
      else if (name === 'Notes') notes = n.value;
    }

    records.push({
      id,
      artist: (bi.artists || []).map((a) => a.name).join(', '),
      title: bi.title || '',
      labels: (bi.labels || []).map((l) => ({ name: l.name, catno: l.catno })),
      formats: bi.formats || [],
      year: bi.year || 0,
      genres: bi.genres || [],
      styles: bi.styles || [],
      folder: folderName.get(it.folder_id) || '',
      dateAdded: it.date_added || '',
      rating: it.rating || 0,
      media,
      sleeve,
      notes,
      hasCover,
    });
  }

  // Stable order (by release id) keeps git diffs minimal between runs.
  records.sort((a, b) => a.id - b.id);
  fs.writeFileSync(OUT_JSON, JSON.stringify(records, null, 2) + '\n');

  console.log(
    `  Wrote ${records.length} records to collection.json\n` +
      `  Covers: ${fetched} new, ${skipped} cached, ${failed} failed\n`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
