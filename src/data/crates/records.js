// ============================================================
// CRATES -- build-time data module
//
// Runs once, in Node, during `astro build`/`astro dev`. Parses the
// Discogs CSV export, repairs its mojibake, parses the packed Format
// strings, joins locally-cached cover/genre enrichment, and exposes:
//
//   RECORDS          normalized per-record objects
//   BROWSER_RECORDS  slim payload for the client island
//   AGGREGATES       precomputed numbers for the static data-story
//   FACETS           distinct filter values for the browser chips
//
// No parsing code ships to the client -- the page serializes the
// finished objects as props.
// ============================================================

import rawCsv from './collection.csv?raw';
import enriched from './enriched.json';
import { parseCsv } from '../../../scripts/lib/parse-csv.mjs';

// -- Mojibake repair -----------------------------------------
// The export double-encoded UTF-8 (bytes written, then read back as
// Latin-1). Two-byte accented sequences (Jose, Bjork, Bonzai) and the
// Devanagari title survived intact and are reversed by a byte
// re-decode. The control continuation bytes of em-dash / curly quotes /
// O-with-stroke were stripped on export, leaving lone 0xE2 / 0xC3 --
// repaired by surrounding context first. Implemented purely with
// char codes (no non-ASCII source literals) so the file is robust.
const CH = (n) => String.fromCharCode(n);
const isAlnum = (c) =>
  (c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
const isWordish = (c) => isAlnum(c) || c === 46 || c === 44 || c === 33 || c === 63;

function fixMojibake(str) {
  if (!str) return str;
  let hasHigh = false;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) >= 0x80) { hasHigh = true; break; }
  }
  if (!hasHigh) return str;

  // 1) Rescue lossy lone remnants into sentinels (codes 1..4) that
  //    survive the byte re-decode untouched.
  //    0xE2 = lone "a-circumflex"  (was em dash / curly quote)
  //    0xC3 = lone "A-tilde"       (was O-with-stroke)
  let out = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code === 0xe2) {
      const prev = str.charCodeAt(i - 1);
      const next = str.charCodeAt(i + 1);
      if (prev === 0x20 && next === 0x20) out += CH(1);   // " -- " em dash
      else if (isAlnum(next)) out += CH(2);                // opening quote
      else if (isWordish(prev)) out += CH(3);              // closing quote
      else out += CH(1);                                   // default em dash
    } else if (code === 0xc3) {
      const next = str.charCodeAt(i + 1);
      // Valid 2-byte UTF-8 pair (continuation 0x80..0xBF) -> keep.
      if (next >= 0x80 && next <= 0xbf) out += str[i];
      else out += CH(4);                                   // lone -> O-stroke
    } else {
      out += str[i];
    }
  }

  // 2) Reverse the UTF-8-as-Latin-1 corruption on the survivors.
  const bytes = Uint8Array.from([...out].map((c) => c.charCodeAt(0) & 0xff));
  const decoded = new TextDecoder('utf-8').decode(bytes);

  // 3) Restore sentinels to real Unicode; drop unrecoverable remnants.
  let res = '';
  for (const ch of decoded) {
    const c = ch.charCodeAt(0);
    if (c === 1) res += CH(0x2014);       // em dash
    else if (c === 2) res += CH(0x201c);  // left double quote
    else if (c === 3) res += CH(0x201d);  // right double quote
    else if (c === 4) res += CH(0x00d8);  // O with stroke
    else if (c === 0xfffd) { /* drop replacement char */ }
    else res += ch;
  }
  return res;
}

// -- Format parsing ------------------------------------------
// Recognized descriptor codes -> human flag. Matched on exact, trimmed
// tokens only, so "RE" never trips on "Remastered". Unrecognized
// 3-letter tokens (pressing-plant codes like Ter/Pit/Scr) are ignored.
const FLAG_CODES = {
  Gat: 'Gatefold',
  RE: 'Reissue',
  RM: 'Remastered',
  RP: 'Repress',
  Ltd: 'Limited',
  Num: 'Numbered',
  RSD: 'Record Store Day',
  Mono: 'Mono',
  Unofficial: 'Bootleg',
  Pic: 'Picture Disc',
  Comp: 'Compilation',
  Promo: 'Promo',
  Dlx: 'Deluxe',
  '180': '180g',
  'S/Edition': 'Special Edition',
};

// Curated, reasonably-unambiguous colored-vinyl codes -> label + swatch.
// Black and cryptic/plant codes are deliberately excluded so the
// "colored vinyl" count never overstates.
const COLOR_CODES = {
  Red: ['Red', '#c0392b'],
  Blu: ['Blue', '#2f6fb0'],
  Gre: ['Green', '#3f8f55'],
  Yel: ['Yellow', '#e3c027'],
  Ora: ['Orange', '#d4822a'],
  Pur: ['Purple', '#7e57c2'],
  Pin: ['Pink', '#d96fa3'],
  Whi: ['White', '#e8e8ea'],
  Cle: ['Clear', '#c3ccd2'],
  Gol: ['Gold', '#c8a24a'],
  Sil: ['Silver', '#b6bbc1'],
  Mar: ['Marbled', '#9aa0a6'],
  Tur: ['Turquoise', '#1fb8b0'],
  Cok: ['Coke Bottle', '#7fa07a'],
  Cob: ['Cobalt', '#2747a8'],
  Opa: ['Opaque', '#d6cfbf'],
  Bei: ['Beige', '#d8c8a6'],
  Tra: ['Translucent', '#a9c2cf'],
  Spl: ['Splatter', '#b07d57'],
  Cre: ['Cream', '#ece3cf'],
  Col: ['Colored', '#c98fd0'],
};

function parseFormat(rawFormat) {
  const fmt = rawFormat || '';
  const segments = fmt.split(' + ');
  let discCount = 0;
  for (const seg of segments) {
    const m = seg.match(/^\s*(\d+)x/i);
    discCount += m ? parseInt(m[1], 10) : 1;
  }
  if (discCount === 0) discCount = 1;

  const tokens = fmt.split(/[,+]/).map((t) => t.trim()).filter(Boolean);

  // Media type (priority order).
  let mediaType = 'LP';
  if (/12"/.test(fmt)) mediaType = '12"';
  if (/10"/.test(fmt)) mediaType = '10"';
  if (/\bLP\b/.test(fmt)) mediaType = 'LP';
  else if (/7"/.test(fmt)) mediaType = '7"';
  const isSingle = /(7"|10"|12")/.test(fmt) && !/\bLP\b/.test(fmt);

  // Flags.
  const flags = [];
  for (const t of tokens) {
    if (FLAG_CODES[t] && !flags.includes(FLAG_CODES[t])) flags.push(FLAG_CODES[t]);
  }

  // Color (first known color token wins).
  let color = null;
  for (const t of tokens) {
    if (COLOR_CODES[t]) {
      color = { name: COLOR_CODES[t][0], hex: COLOR_CODES[t][1] };
      break;
    }
  }
  if (color && !flags.includes('Colored Vinyl')) flags.unshift('Colored Vinyl');
  if (discCount >= 3 && !flags.includes('Box Set')) flags.push('Box Set');
  if (isSingle && !flags.includes('Single')) flags.push('Single');

  return { discCount, mediaType, isSingle, flags, color };
}

const firstOf = (s) => (s || '').split(',')[0].trim();
const decadeOf = (y) => (y == null ? null : `${Math.floor(y / 10) * 10}s`);

// -- Normalize every row -------------------------------------
const rows = parseCsv(rawCsv);

export const RECORDS = rows.map((r, i) => {
  const idRaw = (r['release_id'] || '').trim();
  const isNumericId = /^\d+$/.test(idRaw);
  const id = isNumericId ? idRaw : `row-${i}`;

  const yearNum = parseInt(r['Released'], 10);
  const releasedYear = Number.isFinite(yearNum) && yearNum > 0 ? yearNum : null;

  const fmt = parseFormat(r['Format']);
  const catalogRaw = fixMojibake(r['Catalog#'] || '');
  const catalog = catalogRaw.toLowerCase() === 'none' ? '' : firstOf(catalogRaw);

  const enr = (isNumericId && enriched[idRaw]) || {};
  const genres = enr.genres || [];
  const styles = enr.styles || [];
  const hasCover = !!enr.hasCover;

  return {
    id,
    artist: fixMojibake(r['Artist'] || ''),
    title: fixMojibake(r['Title'] || ''),
    label: fixMojibake(r['Label'] || ''),
    labelFirst: firstOf(fixMojibake(r['Label'] || '')),
    catalog,
    folder: (r['CollectionFolder'] || '').trim(),
    format: fixMojibake(r['Format'] || ''),
    discCount: fmt.discCount,
    mediaType: fmt.mediaType,
    isSingle: fmt.isSingle,
    flags: fmt.flags,
    color: fmt.color,
    releasedYear,
    decade: decadeOf(releasedYear),
    dateAdded: (r['Date Added'] || '').trim(),
    monthAdded: (r['Date Added'] || '').slice(0, 7),
    media: (r['Collection Media Condition'] || '').trim(),
    sleeve: (r['Collection Sleeve Condition'] || '').trim(),
    notes: fixMojibake((r['Collection Notes'] || '').trim()),
    genres,
    styles,
    hasCover,
    coverSrc: hasCover ? `/crates/covers/${idRaw}.jpg` : null,
    discogsUrl: isNumericId ? `https://www.discogs.com/release/${idRaw}` : null,
  };
});

// -- Aggregates for the data-story ---------------------------
function countBy(arr, keyFn) {
  const m = new Map();
  for (const x of arr) {
    const k = keyFn(x);
    if (k == null || k === '') continue;
    m.set(k, (m.get(k) || 0) + 1);
  }
  return m;
}
const sortedEntries = (m) =>
  [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

const years = RECORDS.map((r) => r.releasedYear).filter((y) => y != null);
const unknownYearCount = RECORDS.filter((r) => r.releasedYear == null).length;

// Growth over time (cumulative records by month added).
const byMonth = countBy(RECORDS, (r) => r.monthAdded);
const months = [...byMonth.keys()].filter(Boolean).sort();
let running = 0;
const growth = months.map((month) => {
  running += byMonth.get(month);
  return { month, added: byMonth.get(month), cumulative: running };
});

// Decades.
const decadeMap = countBy(RECORDS, (r) => r.decade);
const decades = [...decadeMap.entries()]
  .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
  .map(([decade, count]) => ({ decade, count }));

// Top artists / labels.
const topArtists = sortedEntries(countBy(RECORDS, (r) => r.artist))
  .slice(0, 12)
  .map(([name, count]) => ({ name, count }));
const topLabels = sortedEntries(countBy(RECORDS, (r) => r.labelFirst))
  .slice(0, 12)
  .map(([name, count]) => ({ name, count }));

// Format flexing.
const hasFlag = (r, f) => r.flags.includes(f);
const colorSwatchMap = new Map();
for (const r of RECORDS) {
  if (r.color) {
    const prev = colorSwatchMap.get(r.color.name) || { ...r.color, count: 0 };
    prev.count += 1;
    colorSwatchMap.set(r.color.name, prev);
  }
}
const formats = {
  total: RECORDS.length,
  colored: RECORDS.filter((r) => r.color).length,
  colorSwatches: [...colorSwatchMap.values()].sort((a, b) => b.count - a.count),
  gatefold: RECORDS.filter((r) => hasFlag(r, 'Gatefold')).length,
  limited: RECORDS.filter((r) => hasFlag(r, 'Limited') || hasFlag(r, 'Numbered')).length,
  boxset: RECORDS.filter((r) => hasFlag(r, 'Box Set')).length,
  bootleg: RECORDS.filter((r) => hasFlag(r, 'Bootleg')).length,
  pictureDisc: RECORDS.filter((r) => hasFlag(r, 'Picture Disc')).length,
  singles: RECORDS.filter((r) => r.isSingle).length,
  reissue: RECORDS.filter((r) => hasFlag(r, 'Reissue')).length,
};

// Genres (from enrichment -- may be empty until `records:update` runs).
const genreMap = countBy(
  RECORDS.flatMap((r) => r.genres.map((g) => ({ g }))),
  (x) => x.g
);
const genres = sortedEntries(genreMap).map(([name, count]) => ({ name, count }));
const genreKnownCount = RECORDS.filter((r) => r.genres.length > 0).length;

// Folders as mini-collections.
const folderNames = [...new Set(RECORDS.map((r) => r.folder).filter(Boolean))];
const folders = folderNames
  .map((name) => {
    const recs = RECORDS.filter((r) => r.folder === name);
    const topDecade = [...countBy(recs, (r) => r.decade).entries()].sort(
      (a, b) => b[1] - a[1]
    )[0];
    const topArtist = [...countBy(recs, (r) => r.artist).entries()].sort(
      (a, b) => b[1] - a[1]
    )[0];
    const topGenre = [
      ...countBy(recs.flatMap((r) => r.genres.map((g) => ({ g }))), (x) => x.g).entries(),
    ].sort((a, b) => b[1] - a[1])[0];
    // Representative covers: newest additions that have art (fallback: newest).
    const byNewest = [...recs].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
    const reps = byNewest.filter((r) => r.hasCover).slice(0, 3);
    const repCovers = (reps.length ? reps : byNewest.slice(0, 3)).map((r) => ({
      id: r.id,
      coverSrc: r.coverSrc,
      artist: r.artist,
      title: r.title,
    }));
    return {
      name,
      count: recs.length,
      discs: recs.reduce((s, r) => s + r.discCount, 0),
      topDecade: topDecade ? topDecade[0] : null,
      topArtist: topArtist ? topArtist[0] : null,
      topGenre: topGenre ? topGenre[0] : null,
      repCovers,
    };
  })
  .sort((a, b) => b.count - a.count);

// Notable one-offs.
const withYear = RECORDS.filter((r) => r.releasedYear != null);
const oldest = withYear.length
  ? withYear.reduce((a, b) => (a.releasedYear <= b.releasedYear ? a : b))
  : null;
const newest = withYear.length
  ? withYear.reduce((a, b) => (a.releasedYear >= b.releasedYear ? a : b))
  : null;
const recentAddition = [...RECORDS].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))[0];
const noteworthy = RECORDS.filter((r) => r.notes && r.notes.length > 0);

function pick(r) {
  if (!r) return null;
  return {
    id: r.id,
    artist: r.artist,
    title: r.title,
    labelFirst: r.labelFirst,
    releasedYear: r.releasedYear,
    dateAdded: r.dateAdded,
    coverSrc: r.coverSrc,
    notes: r.notes,
    discogsUrl: r.discogsUrl,
  };
}

export const AGGREGATES = {
  totalRecords: RECORDS.length,
  totalDiscs: RECORDS.reduce((s, r) => s + r.discCount, 0),
  yearMin: years.length ? Math.min(...years) : null,
  yearMax: years.length ? Math.max(...years) : null,
  unknownYearCount,
  folderCount: folderNames.length,
  labelCount: new Set(RECORDS.map((r) => r.labelFirst).filter(Boolean)).size,
  artistCount: new Set(RECORDS.map((r) => r.artist).filter(Boolean)).size,
  growth,
  decades,
  topArtists,
  topLabels,
  formats,
  genres,
  genreKnownCount,
  folders,
  notable: {
    oldest: pick(oldest),
    newest: pick(newest),
    recentAddition: pick(recentAddition),
    noteworthy: noteworthy.map(pick),
  },
};

// -- Facets for the browser chips ----------------------------
const presentFlags = [
  'Colored Vinyl',
  'Gatefold',
  'Limited',
  'Numbered',
  'Reissue',
  'Bootleg',
  'Picture Disc',
  'Box Set',
  'Single',
  'Mono',
  'Compilation',
].filter((f) => RECORDS.some((r) => r.flags.includes(f)));

// Styles are the granular tags (Prog Rock, Indie Rock, Downtempo...).
// Limit the facet to styles on 2+ records so the chip list stays usable;
// rarer styles are still reachable via text search.
const styleMap = countBy(
  RECORDS.flatMap((r) => r.styles.map((s) => ({ s }))),
  (x) => x.s
);
const styleFacet = sortedEntries(styleMap)
  .filter(([, c]) => c >= 2)
  .map(([name]) => name);

export const FACETS = {
  folders: [...folderNames].sort(),
  decades: decades.map((d) => d.decade),
  genres: genres.map((g) => g.name),
  styles: styleFacet,
  flags: presentFlags,
};

// -- Slim payload for the client island ----------------------
export const BROWSER_RECORDS = RECORDS.map((r) => ({
  id: r.id,
  artist: r.artist,
  title: r.title,
  label: r.label,
  labelFirst: r.labelFirst,
  catalog: r.catalog,
  folder: r.folder,
  format: r.format,
  mediaType: r.mediaType,
  flags: r.flags,
  color: r.color,
  releasedYear: r.releasedYear,
  decade: r.decade,
  dateAdded: r.dateAdded,
  media: r.media,
  sleeve: r.sleeve,
  notes: r.notes,
  genres: r.genres,
  styles: r.styles,
  hasCover: r.hasCover,
  coverSrc: r.coverSrc,
  discogsUrl: r.discogsUrl,
}));
