// ============================================================
// RFC-4180 CSV parser -- zero dependencies.
// Shared by the build-time data module (records.js) and the local
// Discogs enrichment script (fetch-discogs.mjs).
//
// Handles: quoted fields, commas inside quotes, escaped quotes
// ("" -> "), and newlines inside quoted fields (the Beach Boys
// "In Concert" notes field contains a literal newline).
// ============================================================

/**
 * Parse CSV text into an array of string-cell rows.
 * @param {string} text
 * @returns {string[][]} rows of raw string cells
 */
export function parseCsvRows(text) {
  // Strip a leading UTF-8 BOM, then normalize line endings to \n.
  let src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  src = src.replace(/\r\n?/g, '\n');

  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < src.length; i++) {
    const c = src[i];

    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"'; // escaped quote
          i++;
        } else {
          inQuotes = false; // closing quote
        }
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }

  // Flush trailing field/row (file may not end in a newline).
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

/**
 * Parse CSV text into an array of objects keyed by the header row.
 * Trims whitespace on cell values.
 * @param {string} text
 * @returns {Record<string, string>[]}
 */
export function parseCsv(text) {
  const rows = parseCsvRows(text);
  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim());
  const out = [];
  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    // Skip fully empty lines.
    if (cells.length === 1 && cells[0].trim() === '') continue;
    const obj = {};
    for (let c = 0; c < headers.length; c++) {
      obj[headers[c]] = (cells[c] ?? '').trim();
    }
    out.push(obj);
  }
  return out;
}
