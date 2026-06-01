// ============================================================
// Shared Discogs API client -- zero dependencies (native fetch).
// Auth headers, throttled GET with rate-limit/backoff retry, and a
// self-hosting image downloader. Used by scripts/sync-discogs.mjs.
// ============================================================

import fs from 'node:fs';

const API = 'https://api.discogs.com';
const USER_AGENT = 'JonathanMKellyCrates/1.0 +https://www.jonathanmkelly.com';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function makeClient(token, { throttleMs = 1100, maxRetries = 4 } = {}) {
  const headers = {
    Authorization: `Discogs token=${token}`,
    'User-Agent': USER_AGENT,
    Accept: 'application/json',
  };

  async function get(pathOrUrl) {
    const url = pathOrUrl.startsWith('http') ? pathOrUrl : API + pathOrUrl;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      let r;
      try {
        // 25s timeout so a stuck connection can never hang the job.
        r = await fetch(url, { headers, signal: AbortSignal.timeout(25000) });
      } catch (e) {
        await sleep(1500 * attempt);
        continue;
      }
      if (r.status === 429) {
        const retryAfter = Number(r.headers.get('Retry-After')) || 60;
        await sleep((retryAfter + 1) * 1000);
        continue;
      }
      if (r.status === 404) return null;
      if (!r.ok) {
        await sleep(1200 * attempt);
        continue;
      }
      return r.json();
    }
    throw new Error(`GET failed after ${maxRetries} attempts: ${url}`);
  }

  return { get, sleep, throttleMs };
}

export async function downloadImage(url, destPath) {
  const r = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(30000),
  });
  if (!r.ok) throw new Error(`image HTTP ${r.status}`);
  const ct = r.headers.get('content-type') || '';
  if (!ct.startsWith('image/')) throw new Error(`not an image (${ct})`);
  fs.writeFileSync(destPath, Buffer.from(await r.arrayBuffer()));
}
