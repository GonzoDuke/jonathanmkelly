# Claude Code Brief: Poetry Section Redesign


## Project context


This is a full redesign of the Poetry section of jonathanmkelly.com, an author site built on Astro and deployed via Vercel. The repo is at github.com/GonzoDuke/jonathanmkelly. The existing site uses Astro with client-side React components.


The Poetry section currently displays ten poems (down from eleven — "Satori in a Paper Cup" is being removed) as a uniform 3-column grid of dark rectangular cards. This redesign replaces that grid with:


1. A redesigned Poetry index page where each poem is a horizontal band displaying the poem in a compressed version of that poem's unique full-page aesthetic.
2. Ten individual poem pages, each with its own bespoke visual treatment matching the poem's voice and content.


The ten poems are **not homogeneous**. Each has its own weather — its own palette, typography, animation behavior, and atmosphere. No two poem pages should look the same.


Claude Code should not conform all poems to a single template.


## Scope boundaries


**In scope:**
- New Poetry index page at `/poetry` replacing the existing grid
- Ten individual poem pages at their existing URLs, redesigned with bespoke treatments
- New font additions and assets required for the above
- Preserving existing navigation (JMK logo, top nav, back links)
- Responsive/mobile variants of all new pages


**Out of scope:**
- Any changes to other sections of the site (detourist, A&A, Projects, About)
- Changes to site-wide header/footer
- Changes to the other sites in the GonzoDuke org (b-side-of-everything, rowan-black)
- Removing the "Satori in a Paper Cup" poem from the codebase — that's a separate task. For this brief, simply do not include it in the new index.


## Architecture


### Index page (`/poetry`)


A single column of ten horizontal bands, stacked vertically. Each band is approximately 50-60vh tall (tune to what reads well), occupies the full width of the content area, and displays that poem's visual treatment in a compressed form. Each band shows:


- The poem title, styled in that poem's signature typography
- The year, small and in that poem's mono or secondary typeface
- A pulled line (see "Pulled lines" below), styled to match the poem's body typography
- Any atmospheric elements belonging to that poem's treatment (ember layer for "To Become What Burns," red scanlines for "Brake Check," etc.) — reduced in intensity so the band doesn't overwhelm the page


Clicking a band navigates to the full poem page, which continues the aesthetic at full intensity and displays the complete poem.


The page has a masthead at the top: a small uppercase "POETRY" label, the tagline "The work that started it all. The work that won't stop." in italic serif, and a horizontal rule. Masthead is restrained — the poems should be the loudest thing on the page.


**Order of bands (top to bottom, reverse chronological):**


1. Brake Check This, Motherfucker (2025)
2. To Become What Burns (2025)
3. Wisdom Teeth (2024-25)
4. This Machine Kills Democracy (2024)
5. Kerouac is Chilling on My Couch (2024)
6. Potheads Don't Believe in Time (2024-25)
7. Briefcase Full of Rainbows (2023)
8. sleepwrong (2019)
9. And the Living is Easy (2015)
10. Metrolined (1999)


The visual gap between "And the Living is Easy" (2015) and "Metrolined" (1999) represents sixteen years of silence in the work. Do not label this gap or add any visual marker to it. Just let the empty space between the bands be present.


### Individual poem pages


Each poem URL (e.g., `/brake-check-this-motherfucker`, `/metrolined`) receives a full redesign. The page is a continuation of that poem's aesthetic at full intensity. The poem's full text displays in a readable single column. Every poem page has:


- A small "← Poetry" link at the top, styled to harmonize with that poem's palette
- The poem title in that poem's signature typography
- The year
- The full poem, preserving all line breaks, stanza breaks, indentation, and special formatting from the source Markdown
- A "Next poem →" link at the bottom, leading to the next poem in the index order, styled to harmonize with that poem's palette. The final poem (Metrolined) has no next link, or links back to the index.
- Any atmospheric elements (canvas layers, CSS animations, SVG filters) belonging to the poem's treatment


## Content source


All poem text and formatting is authoritative from the Markdown source the author has provided (uploaded to this project). **Do not re-type poems from any rendered HTML source.** Use the Markdown files directly, preserving:


- Line breaks (every newline in the source is a real line break)
- Stanza breaks (blank lines = stanza breaks)
- Indentation (spaces matter — see "And the Living is Easy" and "Kerouac is Chilling on My Couch")
- Italics (`*asterisks*` in the source)
- Em-dashes, special characters, asterism glyphs (✽)


For rendering poem bodies, use CSS `white-space: pre-wrap` on the container so indentation survives, or split the poem into paragraphs per stanza with explicit `<br>` elements for line breaks. Either approach is fine, but the result must be faithful to the source.


## Pulled lines (for index bands)


These are the fragments that appear on each band. Do not alter them.


1. **Brake Check** — "Stay the fuck out of this stanza. / This is for people / who want to move forward."
2. **To Become What Burns** — "Not warmth— / flame. / Not healing— / heat."
3. **Wisdom Teeth** — "O, you beautiful, pretentious idiot—"
4. **This Machine Kills Democracy** — "They don't stop fascism. / They commodify it."
5. **Kerouac** — "stinking up the living room / with your cigarettes / and Catholicism"
6. **Potheads** — "this is already a rerun. This exact night. This exact conversation. It's already happened."
7. **Briefcase** — "an attitude of gratitude is not just a platitude."
8. **sleepwrong** — "the internet arrived in screams—"
9. **And the Living is Easy** — "I will cross it when I get to it."
10. **Metrolined** — "And yet, / here in Aberdeen, / the churches are all the same"


---


## Per-poem treatments


### 1. Brake Check This, Motherfucker (2025) — Tier B: Emergency lights + traffic jam


**Palette:** Deep near-black with red tint (#1a0604). Accent: emergency-light red (#ff3c28), warning-cyan (#30d9ff) for glitch chromatic aberration. Text: off-white (#FFE4D6), amber-cream for secondary (#ffb89a).


**Typography:** Title in Impact, Anton, or Oswald (load via Google Fonts) — heavy, condensed, uppercase, 96px+ on full-page, 48-56px on index band. Body in monospace (JetBrains Mono or Space Mono) to maintain the dashboard/warning feel.


**Full-page treatment:**
- Horizontal scanline overlay at 3-4px repeat, very subtle red tint (suggests dashcam/broken monitor)
- A thin red bar at the top of the viewport that pulses intermittently (1.8s cycle, flashes for ~200ms at a time) — brake-light aesthetic
- Title glitches every 3-4 seconds: SVG filter chromatic aberration (red/cyan split), brief translateX shift of 2-3px, then settles
- At the bottom of the viewport on the full-page treatment, a row of small red SVG dots — 6-10 of them — pulsing at slightly varying rates, suggesting brake lights of cars ahead in traffic. Each dot has its own pulse timing (use CSS `animation-delay` with randomized values)
- The stanza "Stay the fuck out of this stanza. / This is for people / who want to move forward." gets an accented callout: 3px solid red left border, subtle rgba red background tint, mono type
- At the stanza "What if you're right? / What if I'm the problem?" — the entire page desaturates briefly (CSS filter: saturate(0.3) transition over ~1.5s), scanlines calm, background shifts closer to neutral gray. At "No. Fuck that. Move." — full saturation slams back, scanlines return to full intensity. Use scroll-position triggers (IntersectionObserver on those stanza elements) to drive the transition.


**Index band:** Same palette and scanlines, reduced intensity. Title at 48-56px. Pulled line in the mono callout style. Red brake-light pulse at the top of the band only (not full-page).


---


### 2. To Become What Burns (2025) — Tier B: Ash field


**Palette:** True black (#000000). Text: warm cream (#F4EBD4). Accent: warm amber for embers (#FFA04A).


**Typography:** Serif throughout — Cormorant Garamond or similar (elegant, slightly condensed). Title at 80-96px, body at 22-24px. Generous letter-spacing. Italic for the final line "Fire was mercy against silence."


**Full-page treatment:**
- Black background. Canvas element positioned fixed behind content.
- Canvas renders drifting embers: 8-15 small warm amber dots rising slowly upward, each with randomized x-position, upward velocity, and fade curve. Embers fade in from the bottom of the viewport and fade out before the top. Use `requestAnimationFrame` loop. The ember count should build up as you scroll — start with 3-5 embers visible at the top of the page, reaching 12-15 by the final stanza.
- Each stanza appears slightly brighter than the previous one — modulate opacity of stanza container elements via scroll position (from 0.75 at the first stanza to 1.0 at the final line).
- The final line ("Fire was mercy against silence. / Against silence, always.") is in italics and the word "Fire" is in a brighter amber (#FFA04A) than the surrounding cream.
- Absolutely no other animation. The page breathes slowly.


**Index band:** True black background. Ember canvas reduced to 3-5 embers at a time. Title in serif, pulled line in serif italic. Understated.


---


### 3. Wisdom Teeth (2024-25) — Tier A: Recovered scripture


**Palette:** Cream/parchment background (#F2EADA). Text: deep ink (#1A1714). Accent: rubric red for section markers (#8B2416). Marginalia: pencil gray (#6B6258).


**Typography:** Title in a classical serif (Crimson Text, EB Garamond, or Libre Caslon), 64-72px, bold. Section subtitles ("The Gospel According to Napkin #7," etc.) in italics at 20-22px. Body in the same serif at 18-20px, line-height 1.7. The ✽ glyph renders in rubric red, slightly larger than body.


**Full-page treatment:**
- Cream page, no dark backgrounds anywhere
- Very subtle paper grain texture (low-opacity noise or a tiled paper texture image from the public folder)
- Each section marked by the ✽ glyph in rubric red, with italic subtitle next to it. When the reader scrolls into a new section (IntersectionObserver), the ✽ gets a subtle glow animation — a 2-second fade-in of a soft amber halo around the glyph, then the glyph settles back to red. Like a candle being lit.
- Parenthetical asides (Remember \*\*\*\*\*, who told you...) render in slightly smaller text, pencil gray (#6B6258), as if handwritten marginalia
- The P.S. Appendix section at the end renders with slight indentation and a small rule above, like an endnote
- No heavy animation. This is a reading experience. Honor the length.


**Index band:** Parchment background, title in classical serif, pulled line ("O, you beautiful, pretentious idiot—") in italic. One small ✽ glyph in rubric red as a visual anchor.


---


### 4. This Machine Kills Democracy (2024) — Tier B: Printing press / broadsheet


**Palette:** Harsh off-white paper (#F5F2EA). Text: deep ink black (#0F0C0A). Accent: overprint red (#B82418), slightly off-register.


**Typography:** Title in a heavy slab serif or condensed sans (Knockout, Druk, or as free alternatives: Oswald 700, Anton, or Bebop One). Headline scale: 80-96px. Body in a humanist serif (Source Serif Pro or Lora) at 18px, line-height 1.6. Single column, max-width ~680px, left-aligned. **No columns.**


**Full-page treatment:**
- Paper background with subtle grain (low-opacity noise texture)
- Specific words get a red-ink "overprint" treatment — they render in #B82418 with a subtle 1-2px horizontal offset from their "true" position, simulating a misregistered second pass of red ink. Apply to these words specifically: `genocide`, `fascism`, `tyranny`, `cage`, `corpse in a suit`. Implementation: wrap each word in a `<span class="overprint">` with a CSS `::before` pseudo-element containing the same word in red, positioned -2px to the left with slight rotation (0.5deg).
- The title "This Machine Kills Democracy" gets the same overprint treatment at larger scale
- On page load, a subtle "press settling" animation: the whole page shifts 1-2 pixels horizontally, then settles. Runs once, under 500ms. Feels like the paper just came off the roller.
- The final line "This machine kills democracy." at the end of the poem gets its own line, the same overprint red treatment, heavy weight. Sits alone.


**Index band:** Paper background, title with overprint effect, pulled line "They don't stop fascism. / They commodify it." — with "fascism" in overprint red.


---


### 5. Kerouac is Chilling on My Couch (2024) — Tier B: Window scene / lamplight apartment


**Palette:** Deep warm brown-amber (#2B1E13) primary, with radial warmth (#4A2E1C) bleeding from upper right. Text: warm cream (#F4EBD4). Accent: amber (#D4A574), warmer glow for emphasis (#FFCC88).


**Typography:** Title in italic serif (Cormorant Garamond Italic, or Playfair Display Italic), 64-72px. Body in serif, 20-22px, line-height 1.75. Section markers (I, II, III, IV) in mono, small, in amber.


**Full-page treatment:**
- Warm brown background with a radial gradient in the upper right simulating lamplight falling from off-screen
- **Four-section atmospheric progression:** Each section corresponds to deepening night.
  - Section I: lamplight is warm and full, background slightly lighter (#36251A tint)
  - Section II: light slightly recedes, background deepens (#2B1E13)
  - Section III: light further dims (#24190F)
  - Section IV: near-dark, only the faintest glow remains (#1C140D), text settles into cream
  - Transition between sections driven by IntersectionObserver on section headers
- Parallax window scene behind the text: three layers on a fixed-position container
  - Far layer: very faint suggestion of distant city lights or windows (low-opacity dots in amber/warm white)
  - Middle layer: silhouette of a plant on a windowsill, rendered in SVG, very dark brown against the warm background
  - Near layer: the text itself
  - Parallax scroll offsets: far layer moves slowly (-0.1 multiplier), middle layer moves moderately (-0.3), near layer moves with scroll (1.0)
- The indented cascade in Section I ("to rattle the locks / to wake the ghosts") must preserve the staggered indentation from source


**Index band:** Warm brown background, lamplight glow in upper right, title in italic serif, pulled line "stinking up the living room / with your cigarettes / and Catholicism" in serif. Quiet, domestic.


---


### 6. Potheads Don't Believe in Time (2024-25) — Tier C: Lava lamp + color-temperature canvas


**Palette:** This one shifts. Base is near-black (#0A0A0F). Shifts through:
- 1995 basement: warm amber/red CRT glow (#2E1008, accent #FF5522)
- Photograph fading: warm sepia (#2A2416)
- Internet/digital: cool blue-white (#0A1824, accent #2A5AC8)
- Coda: back to basement amber, slightly dimmer


**Typography:** Title in serif (match Wisdom Teeth / Cormorant) at 72px. Body in serif at 20-22px, line-height 1.75. Section markers (I through V, Coda) in mono, small.


**Full-page treatment:**
- Fixed-position canvas behind text for:
  1. **Metaball lava lamp** in the bottom-right or lower-left corner. Real metaball physics — not a CSS animation. Use a canvas 2D implementation with 3-5 "blobs" that attract and repel each other with surface tension, rendered via a smoothing/threshold function to give the liquid-merging effect. Colors: warm orange-red at the core, fading to transparent at the edges. Slow, dreamlike. 6-10 second cycle per blob rise/fall.
  2. **Color-temperature background.** Overall page background crossfades between palettes based on scroll position:
     - Section I-II: basement amber
     - Section III (the internet section): shifts gradually to cool blue-white as the reader scrolls through
     - Section IV: shifts back to warm basement
     - Section V: basement dimming
     - Coda: lowest light, nearly fully dark
- The lava lamp responds to scroll velocity: faster scrolling = slightly faster blob motion; when scrolling stops, blobs settle into slow idle behavior
- Reduced-motion alternative: if `prefers-reduced-motion: reduce` is set, show a static gradient background and a stylized SVG lava lamp silhouette instead of the animated canvas


**Performance:** Use `client:visible` on the canvas component so it only initializes when scrolled into view. The canvas should pause animation when the page is not in focus (`document.visibilityState === 'hidden'`).


**Index band:** Same base palette as section I (amber basement). Lava lamp in miniature, simpler (2-3 blobs, no full metaball shader required at this scale). Title in serif, pulled line in serif.


---


### 7. Briefcase Full of Rainbows (2023) — Tier B: Fluorescent to prism / Mike's colors


**Palette:** Starts fluorescent gray (#C4C0B8, institutional white). Text: black ink (#1A1714). Accent: oil-slick spectrum (see below).


**Typography:** Title in a clean humanist sans or slab (e.g., Source Sans Pro 600, or a slab like Arvo). Body in serif at 19-20px for warmth. The recurring mantra line "an attitude of gratitude is not just a platitude" should appear in a slightly different treatment when it recurs — italics the second and third time it appears, progressively warmer in color.


**Full-page treatment:**
- Background starts as cool fluorescent gray (#C4C0B8) at the top. As the reader scrolls, the background subtly warms — by the end of the poem it has a slight cream tint (#D8D2C2).
- A narrow vertical strip (about 8-12px wide) along the left margin renders as an oil-slick spectrum gradient — not rainbow stripes, but a flowing prismatic color shift (purple → blue → teal → green → amber → coral → pink → purple, on a slow vertical loop). CSS animated gradient, ~20s cycle. Subtle.
- When the reader scrolls past the line "Mike, who became Rainbow Man," the oil-slick strip briefly widens to 16-20px and brightens for about 2 seconds, then returns to normal. IntersectionObserver trigger.
- When "an attitude of gratitude is not just a platitude" appears (three times in the poem), each occurrence uses a progressively warmer color for the line — first occurrence in ink black, second in a warm brown-gold (#8B6A2A), third (the final line before "and goddamn it, / you were right.") in a brighter amber (#D4A574).
- No other atmospheric effects. Keep it institutional except for Mike.


**Index band:** Fluorescent gray background, left-edge oil-slick ribbon visible at small scale. Title in clean sans, pulled line in serif.


---


### 8. sleepwrong (2019) — Tier C: Tuning dial / analog static


**Palette:** Deep midnight blue-black (#07090F). Text: signal-cream (#E8E4DA) where clear, degrading to muted gray (#5A5E65) at edges. Static: neutral gray noise.


**Typography:** Title in serif italic at 56-64px (this poem is only four stanzas — title can command). Body in serif at 22-24px.


**Full-page treatment:**
- Full-screen canvas generating animated noise/static — low-amplitude, warm-tinted static that feels like an analog signal rather than pure random pixels. Use Perlin noise or a time-variant function to keep it organic.
- The four stanzas are positioned vertically down the page, each occupying its own scroll "frequency." Each stanza starts semi-obscured by static (opacity mask / blur filter). As the stanza approaches center-viewport, the static in its area calms and the stanza becomes fully readable. As the reader scrolls past, the stanza fades back into noise.
- The final stanza ("for us, / the last to know both worlds.") stays clear when reached — the static in its area quiets completely and doesn't return.
- Use IntersectionObserver with a threshold array (e.g., [0.2, 0.5, 0.8, 1.0]) to drive the mask opacity per stanza.
- Reduced-motion alternative: static is replaced with a faint grain overlay, stanzas are always fully readable.


**Performance:** Canvas must pause on tab blur. Mobile fallback: reduce noise density to 30-40% of desktop.


**Index band:** Deep blue-black background with low-intensity static. Title in serif italic. Pulled line "the internet arrived in screams—" in serif, with a subtle glitch on the em-dash.


---


### 9. And the Living is Easy (2015) — Tier A: Trail notes + elevation gain + contour lines


**Palette:** Warm ivory paper (#F5EFE0). Text: deep forest ink (#1C2818). Accent: warm tan for trail markers (#A68A56), muted forest green (#4A5A3C).


**Typography:** Title in a clean serif (Lora or Source Serif) at 64px. Body in the same serif at 20px, line-height 1.7.


**Full-page treatment:**
- Ivory background with very faint topographic contour line texture (low-opacity SVG lines, suggesting elevation without dominating)
- Small SVG trail markers as section dividers — a minimal pine-tree icon or arrow glyph, in warm tan (#A68A56), between stanza groups
- **Elevation gain effect:** The poem's text container has subtle vertical position tracking. The first stanza sits with more bottom-margin (text lower in the viewport when first visible). As the reader scrolls through the poem, subsequent stanzas progressively anchor higher in their viewport space. By the summit lines ("I can see it" / "I have arrived"), the text sits near the top of its viewport. Very subtle — should be felt, not obvious.
- Small trail-marker progress indicator in the far-right margin (visible only on desktop >1024px wide). A thin vertical line with a small amber dot that tracks the reader's scroll progress. At the final "I have arrived." line, the dot reaches a small summit marker (triangle glyph) at the bottom of the line.
- The indented "rock to rock" lines MUST preserve their whitespace exactly. Use `<pre>` or `white-space: pre` to maintain the `rock       to       rock` physical spacing.


**Index band:** Ivory background with faint contour texture, title in serif, pulled line "I will cross it when I get to it." in serif. Minimal accent — maybe a single small pine glyph in the corner.


---


### 10. Metrolined (1999) — Tier B: Train-window reflection


**Palette:** Deep indigo-black (#0A0C1A) as train car interior. Accent: dim warm filament (#C8A468) as distant cabin lights. Text: cream (#E8DED0).


**Typography:** Serif throughout — Times New Roman or a similar early-web era serif, to root the poem in 1999. Title at 56-64px. Body at 18-20px.


**Layout:** **Every line centered on the page.** This is the only poem in the set with center-aligned body text. Do not left-align.


**Full-page treatment:**
- Dark indigo background
- Fixed-position layer behind text renders a very faint suggestion of a train window at night:
  - A subtle rectangular frame (the window edges), very low opacity
  - Occasional small warm yellow "lights" drifting horizontally across the background (stations, houses) — SVG dots that animate slowly from right to left with randomized vertical positions and speeds, fading in and out
  - A barely-visible reflection of the "cabin" — perhaps a hint of text ghost (the poem's own text, at ~5% opacity, horizontally mirrored) along the outer edge
- The drifting lights slow down and speed up at different points — tie to scroll position or use a long irregular cycle. Feels like a train that occasionally passes a station or a highway.
- At the poem's final lines ("And this is the wild sea, / on land, this transport— / so how could it be, / no revelations / while in DC?") the lights stop drifting and settle. The train has stopped.


**Index band:** Dark indigo background. Title centered, in serif. Pulled line centered, in serif. Very faint window-edge frame. No drifting lights on the band — just the still atmosphere.


---


## Implementation notes


### Astro/React architecture


Each poem should be its own Astro page component importing any React/canvas components it needs. Use `client:visible` on interactive/canvas components so they don't all initialize on the index page simultaneously.


For the index page: each band should be an Astro component that imports the poem's atmospheric elements in a reduced-intensity "preview" mode. Do not simply scale down the full-page treatment — some effects (the lava lamp, the noise static) should be visually simplified rather than just resized.


### Fonts


Load required Google Fonts via the existing font-loading mechanism. Likely additions:
- Impact alternative: Anton or Oswald 700 (Brake Check)
- Slab serif or condensed sans: Druk alternative — Bebas Neue or Oswald 700 (This Machine)
- Classical serif: Cormorant Garamond, Crimson Text, or EB Garamond (Wisdom Teeth, Kerouac, Burns)
- Humanist serif: Source Serif Pro or Lora (This Machine body, Living, Briefcase)
- Mono: JetBrains Mono or Space Mono (Brake Check, various UI)


Confirm which fonts are already loaded via the existing site's `<head>` before adding duplicates.


### Responsive/mobile


Build mobile-first for layout. For atmospheric effects:
- Canvas-based effects (ash field, lava lamp, tuning dial static) should reduce particle/noise density by 40-60% on mobile
- Scanline effects and overlays are fine on mobile as-is
- Parallax effects (Kerouac window scene) should simplify on mobile — reduce to single layer or disable entirely if it causes scroll jank
- Test all pages on an actual phone before calling done


### Accessibility


- Respect `prefers-reduced-motion: reduce`. When set, disable canvas animations, pulsing effects, parallax, elevation shifts. Static fallbacks for all atmospheric effects.
- Maintain color contrast: WCAG AA for body text on all backgrounds
- All poem text must be selectable and copyable. Do not use `user-select: none` anywhere except decorative atmosphere elements.
- Ensure each poem page has proper `<h1>` for title, semantic `<article>` wrapping, etc.


### Recommended build order


Start with the lowest-risk, highest-architecture-value pieces and work outward:


1. Build the new `/poetry` index page structure first — the ten band containers with basic typography, no atmospheric effects yet. Confirm routing works, nav works, navigation between band → poem → back works cleanly.
2. Build one Tier A poem page as proof (Wisdom Teeth is a good candidate — long-form test of typography and readability). Once it's right, use it as the pattern for other Tier A pages.
3. Build the other Tier A and Tier B poem pages in order of simplicity: Burns, Living, Briefcase, Kerouac, Brake Check, This Machine, Metrolined. Iterate on each.
4. Build the Tier C pages last: sleepwrong (tuning dial), Potheads (lava lamp). These are the most technically complex and benefit from the pattern being well-established in the simpler poems first.
5. Only after all poem pages work at full intensity, return to the index page and add the reduced-intensity atmospheric effects to each band. Tune intensity so the index doesn't become overwhelming when all ten are present.


### Iteration expectations


Expect the author to review each poem page after the first build and request tuning:
- "The embers are too sparse / too dense"
- "The scanlines are too aggressive / not aggressive enough"
- "The lava lamp is too fast / too slow"
- "The window lights are too busy"


Build each treatment so these parameters are easy to adjust (named CSS custom properties, clear JS variables at the top of components) rather than deeply embedded magic numbers.


### Commit discipline


Commit after each poem page is in a working state. Use descriptive messages: "Build Brake Check page: emergency lights + traffic jam brake lights." Don't batch all ten poems into a single commit — you want granular history so individual treatments can be reverted or compared.


### Do not


- Do not apply the same template to all poems
- Do not use multi-column layouts for any poem body text
- Do not re-center any poem except Metrolined
- Do not alter the source text, line breaks, or indentation
- Do not add social-share buttons or "Read More" CTAs — the design is the invitation
- Do not add date-written or "x minute read" metadata
- Do not touch anything outside `/poetry` and the individual poem pages


---


## Final note on philosophy


This is an archive of living poetry. Each poem is its own object, with its own voice and its own weather. The old grid treated them as interchangeable entries in a database. The new design should make a visitor stop at the first band and feel the specific energy of that specific poem — and then want to see what the next poem feels like. The design isn't decoration; it's a continuation of what each poem is doing.


The author has given this project a lot of care. The code should match.


---