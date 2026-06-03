// CRATES -- the data-story, laid out as a full-width bento dashboard.
// Rendered by Astro WITHOUT a client directive, so this ships as static
// HTML + inline SVG (zero client JS). Every number comes precomputed from
// AGGREGATES in src/data/crates/records.js.

import CoverTile from './CoverTile.jsx';

// -- Palette (teal/aqua -- distinct from the detourist gold) --
const ACCENT = '#2dd4bf';
const ACCENT_DEEP = '#0d9488';
const ACCENT_SOFT = 'rgba(45,212,191,0.35)';
const TXT = 'rgba(255,255,255,0.86)';
const MUT = 'rgba(255,255,255,0.42)';
const MUT2 = 'rgba(255,255,255,0.62)';
const LINE = 'rgba(255,255,255,0.08)';
const CARD = 'rgba(255,255,255,0.025)';
const CARDB = 'rgba(255,255,255,0.07)';

const Dot = () => (
  <span
    style={{
      display: 'inline-block',
      width: 3,
      height: 3,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.3)',
      verticalAlign: 'middle',
      margin: '0 9px',
    }}
  />
);

const Kicker = ({ children }) => (
  <div
    style={{
      fontFamily: 'var(--mono)',
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: ACCENT,
      marginBottom: 12,
    }}
  >
    {children}
  </div>
);

const PanelTitle = ({ children }) => (
  <h2
    style={{
      fontFamily: 'var(--serif)',
      fontSize: 'clamp(19px, 1.7vw, 25px)',
      fontWeight: 500,
      color: '#fff',
      letterSpacing: '-0.015em',
      lineHeight: 1.12,
      margin: '0 0 22px',
    }}
  >
    {children}
  </h2>
);

const Note = ({ children }) => (
  <p
    style={{
      fontFamily: 'var(--mono)',
      fontSize: 11,
      color: MUT,
      marginTop: 20,
      letterSpacing: '0.02em',
      lineHeight: 1.5,
    }}
  >
    {children}
  </p>
);

// A bento card. `span` maps to a CSS class controlling its column width.
const Panel = ({ kicker, title, span = 12, children, note }) => (
  <section className={`crate-panel span-${span}`}>
    <Kicker>{kicker}</Kicker>
    <PanelTitle>{title}</PanelTitle>
    {children}
    {note && <Note>{note}</Note>}
  </section>
);

// -- 1. Hero stats (full-width KPI strip) --------------------
function HeroStats({ agg }) {
  const stats = [
    { n: agg.totalRecords, label: 'records' },
    { n: agg.totalDiscs, label: 'discs' },
    { n: `${agg.yearMin}–${agg.yearMax}`, label: 'years spanned', small: true },
    { n: agg.folderCount, label: 'collections' },
    { n: agg.artistCount, label: 'artists' },
    { n: agg.labelCount, label: 'labels' },
  ];
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1px',
        background: LINE,
        border: `1px solid ${LINE}`,
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      {stats.map((s) => (
        <div key={s.label} style={{ background: '#0b0b0d', padding: '28px 22px' }}>
          <div
            style={{
              fontFamily: 'var(--serif)',
              fontSize: s.small ? 'clamp(26px, 4vw, 40px)' : 'clamp(36px, 6vw, 60px)',
              fontWeight: 500,
              color: ACCENT,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {s.n}
          </div>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: MUT2,
              marginTop: 10,
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// -- 2. Growth sparkline -------------------------------------
function Growth({ agg }) {
  const g = agg.growth;
  if (!g.length) return null;
  const W = 1000;
  const H = 230;
  const PADB = 26;
  const n = g.length;
  const maxCum = Math.max(...g.map((d) => d.cumulative), 1);
  const maxAdd = Math.max(...g.map((d) => d.added), 1);
  const x = (i) => (n === 1 ? W / 2 : (i / (n - 1)) * W);
  const y = (v) => H - PADB - (v / maxCum) * (H - PADB - 12);
  const pts = g.map((d, i) => `${x(i).toFixed(1)},${y(d.cumulative).toFixed(1)}`);
  const line = 'M' + pts.join(' L');
  const area = `M${x(0).toFixed(1)},${H - PADB} L` + pts.join(' L') + ` L${x(n - 1).toFixed(1)},${H - PADB} Z`;
  const fmtMonth = (m) => {
    const [yy, mm] = m.split('-');
    const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${names[parseInt(mm, 10) - 1]} ${yy.slice(2)}`;
  };

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: 230, display: 'block', overflow: 'visible' }}
        role="img"
        aria-label="Cumulative records added over time"
      >
        <defs>
          <linearGradient id="cratesGrowth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.32" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* monthly add bars (faint) */}
        {g.map((d, i) => {
          const bw = (W / n) * 0.5;
          const bh = (d.added / maxAdd) * 42;
          return (
            <rect
              key={d.month}
              x={(x(i) - bw / 2).toFixed(1)}
              y={(H - PADB - bh).toFixed(1)}
              width={bw.toFixed(1)}
              height={bh.toFixed(1)}
              fill="rgba(255,255,255,0.07)"
            />
          );
        })}
        <path d={area} fill="url(#cratesGrowth)" />
        <path
          d={line}
          fill="none"
          stroke={ACCENT}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {g.map((d, i) => (
          <circle
            key={d.month}
            cx={x(i).toFixed(1)}
            cy={y(d.cumulative).toFixed(1)}
            r="2.5"
            fill="#0a0a0a"
            stroke={ACCENT}
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--mono)',
          fontSize: 11,
          color: MUT,
          marginTop: 8,
        }}
      >
        <span>{fmtMonth(g[0].month)}</span>
        <span style={{ color: MUT2 }}>
          {g[g.length - 1].cumulative} records, {g.length} months in
        </span>
        <span>{fmtMonth(g[g.length - 1].month)}</span>
      </div>
    </div>
  );
}

// -- 3. Decades ----------------------------------------------
function Decades({ agg }) {
  const max = Math.max(...agg.decades.map((d) => d.count), 1);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 'clamp(5px, 1.4vw, 14px)',
        height: 220,
      }}
    >
      {agg.decades.map((d) => (
        <div
          key={d.decade}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}
        >
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: MUT2, marginBottom: 8 }}>
            {d.count}
          </div>
          <div
            style={{
              width: '100%',
              maxWidth: 64,
              height: `${(d.count / max) * 100}%`,
              background: `linear-gradient(180deg, ${ACCENT}, rgba(45,212,191,0.32))`,
              borderRadius: '3px 3px 0 0',
              minHeight: 3,
            }}
          />
          <div
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(13px, 1.6vw, 16px)',
              color: TXT,
              marginTop: 12,
            }}
          >
            {d.decade}
          </div>
        </div>
      ))}
    </div>
  );
}

// -- 4. Bar lists (artists / labels / genres) ----------------
function BarList({ items }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {items.map((it) => (
        <div key={it.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              flex: '0 0 42%',
              fontFamily: 'var(--serif)',
              fontSize: 16,
              color: TXT,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={it.name}
          >
            {it.name}
          </div>
          <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                width: `${(it.count / max) * 100}%`,
                height: '100%',
                background: ACCENT,
                borderRadius: 4,
              }}
            />
          </div>
          <div style={{ flex: '0 0 auto', fontFamily: 'var(--mono)', fontSize: 12, color: MUT2, width: 22, textAlign: 'right' }}>
            {it.count}
          </div>
        </div>
      ))}
    </div>
  );
}

// -- 5. Format flexing ---------------------------------------
function Formats({ agg }) {
  const f = agg.formats;
  const chips = [
    { n: f.colored, label: 'colored vinyl' },
    { n: f.gatefold, label: 'gatefold' },
    { n: f.limited, label: 'limited / numbered' },
    { n: f.reissue, label: 'reissues' },
    { n: f.boxset, label: 'box sets (3xLP+)' },
    { n: f.singles, label: '7" / 12" singles' },
    { n: f.pictureDisc, label: 'picture discs' },
    { n: f.bootleg, label: 'bootlegs' },
  ].filter((c) => c.n > 0);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(128px, 1fr))', gap: 12 }}>
        {chips.map((c) => (
          <div
            key={c.label}
            style={{
              background: CARD,
              border: `1px solid ${CARDB}`,
              borderRadius: 10,
              padding: '18px 18px',
            }}
          >
            <div style={{ fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 500, color: '#fff', lineHeight: 1 }}>
              {c.n}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUT2, marginTop: 9 }}>
              {c.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -- 6. Genres -----------------------------------------------
function Genres({ agg }) {
  if (!agg.genreKnownCount) {
    return (
      <div
        style={{
          background: CARD,
          border: `1px dashed ${CARDB}`,
          borderRadius: 8,
          padding: '26px 24px',
          fontFamily: 'var(--body)',
          fontSize: 16,
          color: MUT2,
          fontStyle: 'italic',
        }}
      >
        Genre data appears here once album art is fetched from Discogs.
        Run <span style={{ fontFamily: 'var(--mono)', fontStyle: 'normal', fontSize: 13, color: ACCENT }}>npm run sync</span> to populate it.
      </div>
    );
  }
  const top = agg.genres.slice(0, 9);
  return (
    <div>
      <BarList items={top} />
      {agg.genreKnownCount < agg.totalRecords && (
        <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: MUT, marginTop: 18 }}>
          {agg.genreKnownCount} of {agg.totalRecords} records tagged.
        </p>
      )}
    </div>
  );
}

// -- 7. Folders ----------------------------------------------
function FolderCard({ folder }) {
  const covers = folder.repCovers || [];
  const character = [folder.topDecade, folder.topArtist, folder.topGenre].filter(Boolean);
  return (
    <div
      style={{
        background: CARD,
        border: `1px solid ${CARDB}`,
        borderRadius: 10,
        padding: 22,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      {/* fanned covers */}
      <div style={{ position: 'relative', height: 96 }}>
        {covers.map((c, i) => {
          const rot = [-9, 0, 9][i] ?? 0;
          const left = [6, 50, 94][i] ?? 50;
          return (
            <div
              key={c.id}
              style={{
                position: 'absolute',
                left: `${left}px`,
                top: i === 1 ? 0 : 8,
                width: 78,
                height: 78,
                transform: `rotate(${rot}deg)`,
                boxShadow: '0 6px 18px rgba(0,0,0,0.4)',
                borderRadius: 3,
                overflow: 'hidden',
                zIndex: i === 1 ? 2 : 1,
                border: '1px solid rgba(0,0,0,0.5)',
              }}
            >
              <CoverTile rec={c} />
            </div>
          );
        })}
      </div>
      <div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 22, color: '#fff', fontWeight: 500 }}>
          {folder.name}
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: ACCENT, marginTop: 6, letterSpacing: '0.04em' }}>
          {folder.count} records
          <Dot />
          {folder.discs} discs
        </div>
        {character.length > 0 && (
          <div style={{ fontFamily: 'var(--body)', fontSize: 14, color: MUT2, marginTop: 10, fontStyle: 'italic' }}>
            {character.map((c, i) => (
              <span key={c}>
                {i > 0 && <Dot />}
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Folders({ agg }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 18 }}>
      {agg.folders.map((f) => (
        <FolderCard key={f.name} folder={f} />
      ))}
    </div>
  );
}

// -- The dashboard -------------------------------------------
export default function DataStory({ agg }) {
  return (
    <div style={{ color: TXT }}>
      <style>{`
        .crates-bento {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 14px;
          align-items: start;
        }
        .crates-bento .crate-panel {
          background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.012));
          border: 1px solid ${CARDB};
          border-radius: 16px;
          padding: clamp(20px, 2.2vw, 30px);
          position: relative;
          overflow: hidden;
        }
        .crates-bento .crate-panel::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, ${ACCENT_SOFT}, transparent);
        }
        .span-12 { grid-column: span 12; }
        .span-8 { grid-column: span 8; }
        .span-7 { grid-column: span 7; }
        .span-6 { grid-column: span 6; }
        .span-5 { grid-column: span 5; }
        .span-4 { grid-column: span 4; }
        @media (max-width: 1180px) {
          .crates-bento { grid-template-columns: repeat(6, 1fr); }
          .span-12, .span-8, .span-7, .span-6, .span-5 { grid-column: span 6; }
          .span-4 { grid-column: span 3; }
        }
        @media (max-width: 680px) {
          .crates-bento { grid-template-columns: 1fr; gap: 12px; }
          .crates-bento .crate-panel { grid-column: 1 / -1 !important; }
        }
      `}</style>

      {/* KPI strip */}
      <HeroStats agg={agg} />

      {/* Bento dashboard */}
      <div className="crates-bento" style={{ marginTop: 14 }}>
        <Panel
          kicker="Growth"
          title="How the shelf has filled"
          span={8}
          note="Each dot is a month; the line is the running total since collecting began."
        >
          <Growth agg={agg} />
        </Panel>

        <Panel
          kicker="The eras"
          title="When the music was made"
          span={4}
          note={
            agg.unknownYearCount
              ? `By original release year. ${agg.unknownYearCount} records with an unlisted year are not shown.`
              : 'By original release year.'
          }
        >
          <Decades agg={agg} />
        </Panel>

        <Panel kicker="Names that recur" title="Most-collected artists" span={4}>
          <BarList items={agg.topArtists} />
        </Panel>

        <Panel kicker="Sound" title="What it mostly sounds like" span={4}>
          <Genres agg={agg} />
        </Panel>

        <Panel kicker="Format flexing" title="Not just black wax" span={4}>
          <Formats agg={agg} />
        </Panel>

        <Panel kicker="Collections within the collection" title="Whose records are whose" span={12}>
          <Folders agg={agg} />
        </Panel>
      </div>
    </div>
  );
}
