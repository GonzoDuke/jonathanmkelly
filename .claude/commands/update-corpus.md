---
description: Swap in a new /AIcorpus explorer index.html, then commit, push, and deploy
argument-hint: "[path-to-new-index.html]  (defaults to ./index.html at repo root)"
---

The owner is handing over a replacement for the hidden **Working Corpus explorer** served at `/AIcorpus`. The owner has explicitly authorized this command to commit, push to `main`, and deploy. Perform EXACTLY this routine (see `DEPLOY_BRIEF.md`) — nothing more, nothing creative:

1. Run: `npm run corpus:update -- $ARGUMENTS`
   (With no argument the script defaults to `./index.html` at the repo root.) The script byte-faithfully copies the new file to `public/AIcorpus/index.html` and verifies it really is the corpus explorer (robots `noindex` meta, "The Working Corpus" header, d3 from cdnjs). **Never edit the HTML** — it is a standalone artifact.

2. If the script reports the file is **identical / nothing to commit**, stop and tell the owner there's nothing to deploy.

3. Otherwise commit & deploy:
   - `git add public/AIcorpus/index.html`
   - `git commit -m "Update Working Corpus explorer at /AIcorpus"`
   - `git push origin main` (if the push is rejected, `git pull --rebase origin main` then push again — this repo also receives an automated weekly Discogs sync commit).

4. Do **not** touch the sitemap, robots.txt, or add a CSP/header. The page is excluded from the sitemap by construction (Astro never enumerates `public/` assets), and its `noindex` meta already handles indexing.

5. After Vercel redeploys, confirm live: poll `https://jonathanmkelly.com/AIcorpus` until it serves the new file, then verify HTTP 200 with the `<h1>The Working Corpus</h1>` header and the `robots` `noindex,nofollow` meta tag present. Report the deployed commit hash and the live-check result.
