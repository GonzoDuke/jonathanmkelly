// CRATES -- the crate-digging browser. Hydrated island (client:load).
// Client-side search + faceted filters + sort over the full collection,
// with a cover grid and a detail panel. ~230 records => instant, no
// virtualization needed.

import { useState, useMemo, useEffect, useCallback } from 'react';
import CoverTile from './CoverTile.jsx';

const GOLD = '#d4822a';
const TXT = 'rgba(255,255,255,0.86)';
const MUT = 'rgba(255,255,255,0.45)';
const MUT2 = 'rgba(255,255,255,0.62)';
const LINE = 'rgba(255,255,255,0.08)';
const CARD = 'rgba(255,255,255,0.03)';
const CARDB = 'rgba(255,255,255,0.09)';

const SORTS = [
  { id: 'added-desc', label: 'Recently added' },
  { id: 'added-asc', label: 'First added' },
  { id: 'year-desc', label: 'Newest release' },
  { id: 'year-asc', label: 'Oldest release' },
  { id: 'artist', label: 'Artist A–Z' },
];

const GROUPS = [
  { key: 'folders', label: 'Collection' },
  { key: 'decades', label: 'Decade' },
  { key: 'genres', label: 'Genre' },
  { key: 'styles', label: 'Style' },
  { key: 'flags', label: 'Format' },
];

export default function CratesBrowser({ records, facets }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ folders: [], decades: [], genres: [], styles: [], flags: [] });
  const [sort, setSort] = useState('added-desc');
  const [selected, setSelected] = useState(null);
  const [openGroups, setOpenGroups] = useState({
    folders: true,
    decades: true,
    genres: true,
    styles: false,
    flags: false,
  });

  const toggle = useCallback((group, val) => {
    setFilters((prev) => {
      const cur = prev[group];
      const next = cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val];
      return { ...prev, [group]: next };
    });
  }, []);

  const activeCount =
    filters.folders.length +
    filters.decades.length +
    filters.genres.length +
    filters.styles.length +
    filters.flags.length;
  const clearAll = () => {
    setFilters({ folders: [], decades: [], genres: [], styles: [], flags: [] });
    setQuery('');
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let res = records.filter((r) => {
      if (filters.folders.length && !filters.folders.includes(r.folder)) return false;
      if (filters.decades.length && !filters.decades.includes(r.decade)) return false;
      if (filters.genres.length && !r.genres.some((g) => filters.genres.includes(g))) return false;
      if (filters.styles.length && !(r.styles || []).some((s) => filters.styles.includes(s))) return false;
      if (filters.flags.length && !r.flags.some((f) => filters.flags.includes(f))) return false;
      if (q) {
        const hay = `${r.artist} ${r.title} ${r.label} ${r.catalog} ${r.genres.join(' ')} ${(r.styles || []).join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const cmp = {
      'added-desc': (a, b) => b.dateAdded.localeCompare(a.dateAdded),
      'added-asc': (a, b) => a.dateAdded.localeCompare(b.dateAdded),
      'year-desc': (a, b) => (b.releasedYear || 0) - (a.releasedYear || 0),
      'year-asc': (a, b) => (a.releasedYear || 9999) - (b.releasedYear || 9999),
      artist: (a, b) => a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title),
    }[sort];
    return [...res].sort(cmp);
  }, [query, filters, sort, records]);

  // Close detail panel on Escape.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  const facetGroups = GROUPS.filter((g) => (facets[g.key] || []).length > 0);

  return (
    <div>
      <style>{`
        .crate-tile { transition: transform .18s ease, box-shadow .18s ease; }
        .crate-tile:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,.55); }
        .crate-tile:focus-visible { outline: 2px solid ${GOLD}; outline-offset: 3px; }
        .crate-chip:hover { border-color: rgba(212,130,42,.6) !important; color: #fff !important; }
        .crate-input::placeholder { color: rgba(255,255,255,.3); }
        @media (prefers-reduced-motion: reduce) {
          .crate-tile { transition: none; }
          .crate-tile:hover { transform: none; }
        }
      `}</style>

      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', marginBottom: 22 }}>
        <input
          type="search"
          className="crate-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search artist, title, label, genre, catalog #"
          aria-label="Search the collection"
          style={{
            flex: '1 1 260px',
            background: '#0c0c0e',
            border: `1px solid ${CARDB}`,
            borderRadius: 8,
            padding: '12px 16px',
            color: TXT,
            fontFamily: 'var(--body)',
            fontSize: 16,
            outline: 'none',
          }}
        />
        <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: -9999 }}>Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              appearance: 'none',
              background: '#0c0c0e',
              border: `1px solid ${CARDB}`,
              borderRadius: 8,
              padding: '12px 38px 12px 16px',
              color: TXT,
              fontFamily: 'var(--mono)',
              fontSize: 13,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id} style={{ background: '#15151a' }}>
                {s.label}
              </option>
            ))}
          </select>
          <span style={{ position: 'absolute', right: 14, pointerEvents: 'none', color: MUT, fontSize: 10 }}>
            v
          </span>
        </label>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 22 }}>
        {facetGroups.map((g) => {
          const vals = facets[g.key];
          const open = openGroups[g.key];
          return (
            <div key={g.key}>
              <button
                onClick={() => setOpenGroups((p) => ({ ...p, [g.key]: !p[g.key] }))}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: MUT2,
                  marginBottom: 9,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                }}
                aria-expanded={open}
              >
                <span style={{ color: GOLD, fontSize: 9 }}>{open ? '▼' : '▶'}</span>
                {g.label}
                {filters[g.key].length > 0 && (
                  <span style={{ color: GOLD }}>({filters[g.key].length})</span>
                )}
              </button>
              {open && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {vals.map((v) => {
                    const on = filters[g.key].includes(v);
                    return (
                      <button
                        key={v}
                        className="crate-chip"
                        onClick={() => toggle(g.key, v)}
                        aria-pressed={on}
                        style={{
                          fontFamily: 'var(--mono)',
                          fontSize: 12,
                          padding: '6px 13px',
                          borderRadius: 999,
                          cursor: 'pointer',
                          border: `1px solid ${on ? GOLD : CARDB}`,
                          background: on ? 'rgba(212,130,42,0.16)' : 'transparent',
                          color: on ? '#fff' : MUT2,
                          transition: 'all .15s ease',
                        }}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Result count */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
          fontFamily: 'var(--mono)',
          fontSize: 12,
          color: MUT2,
        }}
      >
        <span>
          {visible.length} of {records.length} records
        </span>
        {(activeCount > 0 || query) && (
          <button
            onClick={clearAll}
            style={{
              background: 'none',
              border: 'none',
              color: GOLD,
              cursor: 'pointer',
              fontFamily: 'var(--mono)',
              fontSize: 12,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            clear all
          </button>
        )}
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <div style={{ padding: '60px 0', textAlign: 'center', fontFamily: 'var(--serif)', fontSize: 22, color: MUT }}>
          No records match.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))',
            gap: 16,
          }}
        >
          {visible.map((r) => (
            <button
              key={r.id}
              className="crate-tile"
              onClick={() => setSelected(r)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: '#15151a',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                }}
              >
                <CoverTile rec={r} />
              </div>
              <div style={{ padding: '0 2px' }}>
                <div
                  style={{
                    fontFamily: 'var(--body)',
                    fontSize: 13,
                    color: TXT,
                    lineHeight: 1.25,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={r.title}
                >
                  {r.title}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 10.5,
                    color: MUT,
                    lineHeight: 1.3,
                    marginTop: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={r.artist}
                >
                  {r.artist}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && <DetailPanel rec={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function DetailPanel({ rec, onClose }) {
  const rows = [
    ['Artist', rec.artist],
    ['Title', rec.title],
    ['Label', rec.label],
    ['Catalog #', rec.catalog],
    ['Format', rec.format],
    ['Released', rec.releasedYear || 'Unknown'],
    ['Collection', rec.folder],
    ['Added', rec.dateAdded ? rec.dateAdded.slice(0, 10) : ''],
    ['Media', rec.media],
    ['Sleeve', rec.sleeve],
    ['Genres', rec.genres && rec.genres.length ? rec.genres.join(', ') : ''],
    ['Styles', rec.styles && rec.styles.length ? rec.styles.join(', ') : ''],
  ].filter(([, v]) => v !== '' && v != null);

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${rec.artist} - ${rec.title}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(0,0,0,0.78)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#101013',
          border: `1px solid ${CARDB}`,
          borderRadius: 12,
          maxWidth: 640,
          width: '100%',
          maxHeight: '88vh',
          overflow: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ flex: '1 1 240px', minWidth: 220, aspectRatio: '1', background: '#15151a' }}>
          <CoverTile rec={rec} />
        </div>
        <div style={{ flex: '1 1 280px', padding: '26px 26px 30px', position: 'relative' }}>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'none',
              border: `1px solid ${CARDB}`,
              borderRadius: 6,
              width: 30,
              height: 30,
              color: MUT2,
              cursor: 'pointer',
              fontFamily: 'var(--mono)',
              fontSize: 14,
              lineHeight: 1,
            }}
          >
            x
          </button>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 24, color: '#fff', lineHeight: 1.15, paddingRight: 34 }}>
            {rec.title}
          </div>
          <div style={{ fontFamily: 'var(--body)', fontSize: 16, color: GOLD, marginTop: 4 }}>
            {rec.artist}
          </div>

          {rec.flags && rec.flags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
              {rec.flags.map((f) => (
                <span
                  key={f}
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '4px 9px',
                    borderRadius: 4,
                    border: `1px solid ${CARDB}`,
                    color: MUT2,
                  }}
                >
                  {f}
                </span>
              ))}
            </div>
          )}

          <dl style={{ margin: '20px 0 0', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '9px 16px' }}>
            {rows.map(([k, v]) => (
              <div key={k} style={{ display: 'contents' }}>
                <dt
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 10.5,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: MUT,
                    paddingTop: 2,
                  }}
                >
                  {k}
                </dt>
                <dd style={{ margin: 0, fontFamily: 'var(--body)', fontSize: 14.5, color: TXT, lineHeight: 1.4 }}>
                  {v}
                </dd>
              </div>
            ))}
          </dl>

          {rec.notes && (
            <p
              style={{
                marginTop: 18,
                paddingTop: 16,
                borderTop: `1px solid ${LINE}`,
                fontFamily: 'var(--serif)',
                fontStyle: 'italic',
                fontSize: 16,
                color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.45,
                whiteSpace: 'pre-line',
              }}
            >
              {rec.notes}
            </p>
          )}

          {rec.discogsUrl && (
            <a
              href={rec.discogsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: 22,
                fontFamily: 'var(--mono)',
                fontSize: 12,
                letterSpacing: '0.04em',
                color: GOLD,
                textDecoration: 'none',
                borderBottom: `1px solid rgba(212,130,42,0.5)`,
                paddingBottom: 2,
              }}
            >
              View on Discogs
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
