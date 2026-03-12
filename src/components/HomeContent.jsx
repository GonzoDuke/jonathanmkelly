import React, { useState, useEffect } from 'react';
import { PROJECTS, PIECES, AA_PIECES, DET_PIECES } from '../data/pieces.js';

function useMounted(delay = 100) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), delay); }, []);
  return mounted;
}

/* ── Project Card ── */
function ProjectCard({ project, index, mounted }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        background: hovered ? 'rgba(0,0,0,0.03)' : 'var(--surface)',
        border: '1px solid var(--rule)',
        padding: '40px 36px',
        textDecoration: 'none',
        transition: 'all 0.3s ease, opacity 0.6s ease, transform 0.6s ease',
        transitionDelay: `${index * 100}ms`,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(10px)',
        cursor: 'pointer',
      }}
    >
      <div style={{
        fontFamily: 'var(--serif)', fontSize: '32px',
        fontWeight: 400, lineHeight: 1.15, color: 'var(--text)',
        letterSpacing: '-0.015em', marginBottom: '12px',
      }}>
        {project.title}
        <span style={{
          display: 'inline-block', marginLeft: '12px', fontSize: '18px',
          color: 'var(--ghost)', transition: 'transform 0.2s ease',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        }}>&rarr;</span>
      </div>
      <p style={{
        fontFamily: 'var(--body)', fontSize: '16px', lineHeight: 1.65,
        color: 'var(--dim)', margin: 0,
      }}>{project.description}</p>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 300,
        color: 'var(--ghost)', letterSpacing: '0.02em', marginTop: '16px',
      }}>{project.url.replace('https://', '')}</div>
    </a>
  );
}

/* ── Agency & Artifact Card ── */
function AACard({ mounted }) {
  const [hovered, setHovered] = useState(false);
  const count = AA_PIECES.filter(p => p.status === 'live').length;
  return (
    <a
      href="/agency-artifact"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        background: hovered ? '#1e2738' : '#1b2332',
        padding: '48px 40px',
        textDecoration: 'none',
        transition: 'all 0.3s ease, opacity 0.6s ease, transform 0.6s ease',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(10px)',
        cursor: 'pointer',
      }}
    >
      <div style={{
        fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 500,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: '#6889b4', marginBottom: '16px',
      }}>Series &middot; {count} essays</div>
      <div style={{
        fontFamily: 'var(--serif)', fontSize: 'clamp(32px, 4vw, 44px)',
        fontWeight: 400, lineHeight: 1.1, color: '#e0e4ec',
        letterSpacing: '-0.015em', marginBottom: '14px',
      }}>
        Agency &amp; Artifact
        <span style={{
          display: 'inline-block', marginLeft: '12px', fontSize: '20px',
          color: 'rgba(224,228,236,0.25)', transition: 'transform 0.2s ease',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        }}>&rarr;</span>
      </div>
      <p style={{
        fontFamily: 'var(--body)', fontSize: '16px', fontStyle: 'italic',
        lineHeight: 1.55, color: 'rgba(224,228,236,0.45)',
        margin: 0, maxWidth: '500px',
      }}>Writing clearly in a system built for noise.</p>
    </a>
  );
}

/* ── detourist Card ── */
function DetouristCard({ mounted }) {
  const [hovered, setHovered] = useState(false);
  const count = DET_PIECES.filter(p => p.status === 'live').length;
  return (
    <a
      href="/detourist"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        background: hovered ? '#111111' : '#0a0a0a',
        padding: '48px 40px',
        textDecoration: 'none',
        transition: 'all 0.3s ease, opacity 0.6s ease, transform 0.6s ease',
        transitionDelay: '100ms',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(10px)',
        cursor: 'pointer',
      }}
    >
      <div style={{
        fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 500,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.25)', marginBottom: '16px',
      }}>Series &middot; {count} pieces</div>
      <div style={{
        fontFamily: 'var(--serif)', fontSize: 'clamp(32px, 4vw, 44px)',
        fontWeight: 500, lineHeight: 1.1,
        letterSpacing: '-0.015em', marginBottom: '14px',
      }}>
        <span style={{ color: '#d4822a' }}>de</span>
        <span style={{ color: '#ffffff' }}>tourist</span>
        <span style={{
          display: 'inline-block', marginLeft: '12px', fontSize: '20px',
          color: 'rgba(255,255,255,0.15)', transition: 'transform 0.2s ease',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        }}>&rarr;</span>
      </div>
      <p style={{
        fontFamily: 'var(--body)', fontSize: '16px',
        lineHeight: 1.55, color: 'rgba(255,255,255,0.35)',
        margin: 0, maxWidth: '500px',
      }}>Deviation as discipline. Digression as method.</p>
    </a>
  );
}

/* ── Poem Entry ── */
function PoemEntry({ piece, index, mounted, offset }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={`/${piece.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        gap: '24px', padding: '18px 0',
        borderBottom: '1px solid var(--rule)',
        textDecoration: 'none',
        transition: 'all 0.2s ease, opacity 0.5s ease, transform 0.5s ease',
        transitionDelay: `${(offset + index) * 50}ms`,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(6px)',
        cursor: 'pointer',
      }}
    >
      <span style={{
        fontFamily: 'var(--serif)', fontSize: '24px', fontWeight: 400,
        color: 'var(--text)', lineHeight: 1.3,
        transition: 'letter-spacing 0.2s ease',
        letterSpacing: hovered ? '0.01em' : '0',
      }}>{piece.title}</span>
      <span style={{
        fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 300,
        color: 'var(--ghost)', letterSpacing: '0.02em',
        whiteSpace: 'nowrap', flexShrink: 0,
      }}>{piece.date || ''}</span>
    </a>
  );
}

/* ── Section Header ── */
function SectionHeader({ children, mounted, delay }) {
  return (
    <h2 style={{
      fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 500,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      color: 'var(--ghost)', marginBottom: '24px',
      opacity: mounted ? 1 : 0,
      transition: `opacity 0.5s ease ${delay}ms`,
    }}>{children}</h2>
  );
}

/* ══════════════════════════════════════
   HOMEPAGE
   ══════════════════════════════════════ */
export default function HomeContent() {
  const mounted = useMounted(80);
  const poems = PIECES.filter(p => p.status === 'live');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Hero ── */}
      <header style={{
        maxWidth: 'var(--max-wide)', margin: '0 auto',
        padding: 'min(12vh, 100px) var(--page-pad) 0',
      }}>
        <h1 style={{
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(52px, 8vw, 96px)',
          fontWeight: 400, lineHeight: 0.95, color: 'var(--text)',
          letterSpacing: '-0.035em', margin: 0,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}>
          Jonathan M. Kelly
        </h1>
        <p style={{
          fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 300,
          color: 'var(--dim)', letterSpacing: '0.06em', marginTop: '20px',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.8s ease 200ms',
        }}>
          Poet &middot; Essayist &middot; Fiction-maker
        </p>
      </header>

      <main style={{
        maxWidth: 'var(--max-wide)', margin: '0 auto',
        padding: '80px var(--page-pad) 0',
      }}>

        {/* Projects - full width two-column */}
        <section style={{ marginBottom: '80px' }}>
          <SectionHeader mounted={mounted} delay={300}>Projects</SectionHeader>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
            gap: '24px',
          }}>
            {PROJECTS.filter(p => p.status === 'live').map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} mounted={mounted} />
            ))}
          </div>
        </section>

        {/* Series - full width, side by side */}
        <section style={{ marginBottom: '80px' }}>
          <SectionHeader mounted={mounted} delay={450}>Series</SectionHeader>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
            gap: '24px',
          }}>
            <AACard mounted={mounted} />
            <DetouristCard mounted={mounted} />
          </div>
        </section>

        {/* Poems - full width list */}
        {poems.length > 0 && (
          <section style={{ marginBottom: '80px' }}>
            <SectionHeader mounted={mounted} delay={600}>Poems</SectionHeader>
            <div>
              {poems.map((piece, i) => (
                <PoemEntry key={piece.id} piece={piece} index={i} mounted={mounted} offset={4} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        maxWidth: 'var(--max-wide)', margin: '0 auto',
        padding: '40px var(--page-pad) 80px',
        borderTop: '1px solid var(--rule)',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'baseline', flexWrap: 'wrap', gap: '16px',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.8s ease 600ms',
      }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'baseline' }}>
          <a href="/about" style={{
            fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 400,
            color: 'var(--dim)', textDecoration: 'none', letterSpacing: '0.02em',
          }}>About</a>
          <a href="mailto:contact@jonathanmkelly.com" style={{
            fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 400,
            color: 'var(--dim)', textDecoration: 'none', letterSpacing: '0.02em',
          }}>Contact</a>
        </div>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 300,
          color: 'var(--ghost)', letterSpacing: '0.02em',
        }}>&copy; {new Date().getFullYear()} Jonathan M. Kelly</span>
      </footer>
    </div>
  );
}
