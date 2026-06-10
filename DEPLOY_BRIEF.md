# Deploy Brief: Working Corpus Explorer at /AIcorpus

## What this is

A single self-contained static HTML file: an interactive explorer for a research corpus (42 annotated sources, faceted search, a d3 force-directed relation graph). No build step, no backend, no database, no environment variables. All data is embedded in the page. Its one external dependency is d3 loaded from cdnjs.cloudflare.com.

The deliverable file is `index.html`, shipped alongside this brief.

## Required outcome

1. The page is live at **https://jonathanmkelly.com/AIcorpus** (the file is named `index.html` so it serves at the clean directory path).
2. It is **not discoverable**: not in any nav, menu, footer, homepage, or internal link, and excluded from any sitemap this site generates. The page already carries `<meta name="robots" content="noindex, nofollow">` in its head. Do not remove it.
3. It is otherwise a normal public URL: anyone with the exact link can view it. No auth.

## Placement (decide based on this repo)

- If the site is plain static files: create an `AIcorpus/` directory at the web root and place `index.html` inside it.
- If the site is a framework project on Vercel (Next.js, Astro, etc.): place it at `public/AIcorpus/index.html` (or this framework's equivalent static-assets directory) so it is served verbatim at `/AIcorpus`, bypassing the router.
- Match the path casing exactly: `AIcorpus`.

## Constraints

- **Do not modify the HTML file.** No reformatting, no injecting site analytics, headers, footers, or shared layout into it. It is a standalone artifact and must stay byte-faithful except where Vercel/Git normalizes line endings.
- **Do not add it to sitemap.xml.** If sitemap generation is automatic, exclude this path.
- **robots.txt:** leave it alone. Do not add a Disallow line for /AIcorpus (that would advertise the path; the meta tag already handles indexing).
- **CSP check:** if this site sends a Content-Security-Policy header, confirm `script-src` permits `https://cdnjs.cloudflare.com` for this path, or the graph will not render. If the site sends no CSP, do nothing.
- Optional, nice to have: add an `X-Robots-Tag: noindex, nofollow` response header for `/AIcorpus` via `vercel.json` headers config, as a belt-and-suspenders duplicate of the meta tag. Skip if it complicates anything.

## Acceptance checks before declaring done

1. https://jonathanmkelly.com/AIcorpus loads; the header reads "The Working Corpus."
2. The relation graph renders (d3 loaded successfully) and nodes are draggable.
3. Typing `friction` in the search box dims most of the graph and the right panel lists matching sources.
4. View source on the live page: the robots meta tag is present.
5. The path appears in no sitemap and no internal link anywhere on the site.

## Recurring update routine (this will happen periodically)

The owner will hand you a replacement `index.html` when the corpus grows. The update is: overwrite `AIcorpus/index.html` with the new file, commit, deploy. Nothing else. Treat any request to "update the corpus explorer" as exactly this operation.
