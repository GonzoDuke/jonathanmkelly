// Shared cover tile: real album art when available, otherwise a
// deterministic typographic "sleeve" generated from the record's text.
// Used by both the static DataStory and the hydrated CratesBrowser, so
// missing-cover fallbacks look identical everywhere.

// Deterministic hue from a seed string -> stable per-record accent.
export function accentFor(seed = '') {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  const sat = 38 + (h % 18); // 38-56%
  return { base: `hsl(${hue}, ${sat}%, 30%)`, deep: `hsl(${hue}, ${sat}%, 13%)` };
}

export default function CoverTile({ rec, rounded = 0 }) {
  const alt = `${rec.artist} — ${rec.title}`;
  if (rec.coverSrc) {
    return (
      <img
        src={rec.coverSrc}
        alt={alt}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          borderRadius: rounded,
        }}
      />
    );
  }

  const { base, deep } = accentFor((rec.id || '') + rec.artist + rec.title);
  return (
    <div
      aria-label={alt}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '11% 12%',
        borderRadius: rounded,
        background: `linear-gradient(155deg, ${base}, ${deep})`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* faint vinyl ring motif */}
      <div
        style={{
          position: 'absolute',
          right: '-22%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '78%',
          aspectRatio: '1',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow:
            '0 0 0 6px rgba(255,255,255,0.015), inset 0 0 0 14px rgba(0,0,0,0.10)',
        }}
      />
      <div
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 'clamp(8px, 1.6vw, 11px)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.62)',
          position: 'relative',
          lineHeight: 1.3,
        }}
      >
        {rec.artist}
      </div>
      <div
        style={{
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(13px, 2.5vw, 20px)',
          fontWeight: 500,
          fontStyle: 'italic',
          color: 'rgba(255,255,255,0.94)',
          lineHeight: 1.12,
          position: 'relative',
          textShadow: '0 1px 12px rgba(0,0,0,0.35)',
        }}
      >
        {rec.title}
      </div>
    </div>
  );
}
