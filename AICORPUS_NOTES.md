# /AIcorpus — Deployment & Maintenance Notes

Status handoff for the **Working Corpus explorer** deployed at `/AIcorpus`. Covers the deployment, what was deliberately not touched, verification, and how to update it going forward. (Scope: this page only — unrelated site work is excluded.)

---

## What this is

A single, self-contained static HTML file: an interactive explorer for a research corpus (42 annotated sources, faceted search, a d3 force-directed relation graph). No build step, no backend, no database, no env vars — all data is embedded in the page. Its one external dependency is **d3 7.8.5 loaded from `cdnjs.cloudflare.com`**.

- **Live URL:** https://jonathanmkelly.com/AIcorpus
- **Source of truth in repo:** `public/AIcorpus/index.html`
- **Artifact identity:** 50,164 bytes · SHA256 `bc53c0d4768b7425d820bf3f1584cfa4946df00d4293c4afdd4647bfdfead980`
- **Visibility:** public but unlisted — anyone with the exact link can view it; not in any nav, sitemap, or internal link. The file's `<head>` carries `<meta name="robots" content="noindex, nofollow">`.

## Repo / hosting context

- Repo `github.com/GonzoDuke/jonathanmkelly`, branch `main`.
- **Astro static site on Vercel**, auto-deploying on every push to `main`. Anything in `public/` is emitted to the site root verbatim and served **bypassing the Astro router** — which is exactly why `public/AIcorpus/index.html` serves byte-for-byte at `/AIcorpus`.

---

## Deployment decisions

**Placement → `public/AIcorpus/index.html`** (NOT a web-root `AIcorpus/` folder).
Reason: this repo is unambiguously a framework project (Astro: `astro.config.mjs`, `src/pages/*` routes, sitemap + React integrations, a build step). The correct location for a verbatim static artifact in that case is the framework's public/static dir. A web-root folder would be the "plain static files" path, which doesn't apply here.

**The HTML was never modified.** Placed via a byte-faithful filesystem move/copy (no Read+Write, no reformatting). Proven: source, built `dist/`, and the live URL all share SHA256 `bc53c0d4…`. (Vercel builds on Linux and preserved the original LF line endings, so even the byte count is identical.)

**Deliberately NOT done (per brief):**
- **Sitemap:** no change. Astro's `@astrojs/sitemap` only enumerates generated routes, never `public/` assets, so `/AIcorpus` is excluded *by construction*. Verified: live sitemap has 40 URLs, 0 referencing AIcorpus.
- **robots.txt:** left alone (none exists; did not create one — a `Disallow` line would only advertise the path).
- **CSP:** the site sends no Content-Security-Policy, so nothing was needed for cdnjs/d3.
- **`X-Robots-Tag` response header:** skipped (optional in the brief). There is no `vercel.json` today and the Vercel build config was recently delicate; the `noindex` meta already covers indexing, so adding header config wasn't worth the risk.

---

## Acceptance checks (run against the live URL — all PASS)

1. ✅ Page loads (HTTP 200); header reads **"The Working Corpus."**
2. ✅ d3 graph: d3 7.8.5 `<script>` served; cdnjs reachable (200); `forceSimulation/forceLink/forceManyBody/forceCenter` + `.call(d3.drag…)` present.
3. ✅ Search: `id="search"` input present; "friction" appears 20× in the embedded corpus; opacity-based dim logic present.
4. ✅ View-source: `<meta name="robots" content="noindex, nofollow">` present in live HTML.
5. ✅ Not in sitemap (0 of 40 URLs) and not linked anywhere on the site.

> Caveat on #2 and #3: these are interactive behaviors. The deploy environment had no headless browser, so every *prerequisite* was verified (deps load, code paths and data are present in the served bytes) but the actual on-screen drag/dim was not executed. A ~10-second eyeball in a real browser is the only thing not machine-confirmed.

---

## Relevant commits (on `main`, deployed)

```
090a767  tooling: add /update-corpus slash command (owner-authorized deploy)
b693d6e  tooling: one-command corpus updater + track deploy brief
ccb3326  Deploy Working Corpus explorer at /AIcorpus (hidden, noindex)
```

`DEPLOY_BRIEF.md` (the original spec) is now tracked in the repo root.

---

## How to update the corpus when it grows

The recurring routine is just: replace the file, commit, deploy. Three ways exist, lightest first.

### Option A — GitHub web upload (the chosen day-to-day method; no terminal)
1. Open: `https://github.com/GonzoDuke/jonathanmkelly/upload/main/public/AIcorpus`
2. Drag in the new file — **named exactly `index.html`** (same name = clean overwrite; a different name creates a stray second file).
3. Scroll to "Commit changes," keep "Commit directly to `main`," commit.
4. Vercel auto-redeploys in ~1–2 min. Hard-refresh `https://jonathanmkelly.com/AIcorpus`.
- Works from any browser, including mobile. **Trade-off:** this path does **not** validate that the uploaded file is really the corpus explorer — upload the right file.

### Option B — local script (adds a safety net)
```
npm run corpus:update -- path/to/new-index.html   # or just `npm run corpus:update` (defaults to ./index.html at repo root)
```
`scripts/update-corpus.mjs` byte-faithfully copies into `public/AIcorpus/index.html`, **refuses** anything that doesn't look like the corpus explorer (checks robots-noindex meta + "The Working Corpus" header + d3/cdnjs), reports the sha256, and prints the exact `git add/commit/push` commands. It only ever copies — it never edits the HTML.

### Option C — Claude Code slash command (one step, owner-authorized auto-deploy)
`/update-corpus [path]` → runs the script (copy + verify), then commits, pushes to `main`, lets Vercel deploy, and live-checks. Defined in `.claude/commands/update-corpus.md`. The owner explicitly authorized this command to push to production.

> A "button on the `/AIcorpus` page itself" was considered and ruled out: the brief forbids modifying that HTML, and a static page can't update its own deployment (that would require a separate, authenticated serverless endpoint + a write target). Option A delivers a browser-based update with zero new code or attack surface.

---

## Notes / open items

- Treat any future "update the corpus explorer" request as exactly the replace-file → commit → deploy routine above. Nothing else (no sitemap edits, no robots changes, no layout injection).
- The `noindex` meta inside the file must stay; do not remove it.
- Keep the artifact standalone and byte-faithful (line-ending normalization by Git/Vercel is acceptable and expected).
