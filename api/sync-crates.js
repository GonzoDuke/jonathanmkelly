// ============================================================
// CRATES -- manual "update now" trigger (Vercel serverless function)
//
// The /crates page has an Update button that POSTs here. This function
// fires the `sync-crates.yml` GitHub Action via the workflow_dispatch API
// -- the same job that runs weekly -- so the collection re-syncs from
// Discogs on demand. The job commits any changes, which makes Vercel
// redeploy, so the page picks up new records automatically.
//
// The GitHub token never reaches the browser: it lives only in this
// server-side function as an env var.
//
// Required Vercel environment variables:
//   GITHUB_DISPATCH_TOKEN   fine-grained PAT with "Actions: write" on
//                           GonzoDuke/jonathanmkelly
//   CRATES_SYNC_PASSPHRASE  shared secret the button must send; without
//                           it set, this endpoint refuses to run (so a
//                           public visitor can never trigger a sync).
// ============================================================

const OWNER = 'GonzoDuke';
const REPO = 'jonathanmkelly';
const WORKFLOW = 'sync-crates.yml';
const REF = 'main';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  const token = process.env.GITHUB_DISPATCH_TOKEN;
  const passphrase = process.env.CRATES_SYNC_PASSPHRASE;

  if (!token || !passphrase) {
    return res.status(503).json({
      ok: false,
      error:
        'Update endpoint is not configured. Set GITHUB_DISPATCH_TOKEN and CRATES_SYNC_PASSPHRASE in Vercel.',
    });
  }

  // Body may arrive parsed (object) or raw (string) depending on runtime.
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  const supplied = (body && body.passphrase) || req.headers['x-crates-passphrase'];

  if (supplied !== passphrase) {
    return res.status(401).json({ ok: false, error: 'Wrong passphrase.' });
  }

  try {
    const gh = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'crates-update-button',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ref: REF }),
      },
    );

    if (gh.status === 204) {
      return res.status(202).json({ ok: true, message: 'Sync started.' });
    }

    const detail = await gh.text();
    return res.status(502).json({
      ok: false,
      error: `GitHub rejected the request (${gh.status}).`,
      detail: detail.slice(0, 300),
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err && err.message) });
  }
}
