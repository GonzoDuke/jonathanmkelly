import React, { useState, useEffect } from 'react';
import { PROJECTS, PIECES } from '../data/pieces.js';

/* ── Fade-in hook ── */
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
        background: hovered ? 'rgba(0,0,0,0.02)' : 'var(--surface)',
        border: '1px solid var(--rule)',
        borderRadius: '2px',
        padding: '32px',
        textDecoration: 'none',
        transition: 'all 0.3s ease, opacity 0.6s ease, transform 0.6s ease',
        transitionDelay: `${index * 80}ms`,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(8px)',
        cursor: 'pointer',
      }}
    >
      <div style={{
        fontFamily: 'var(--serif)',
        fontSize: 'clamp(22px, 3vw, 28px)',
        fontWeight: 400,
        lineHeight: 1.2,
        color: 'var(--text)',
        letterSpacing: '-0.01em',
        marginBottom: '10px',
      }}>
        {project.title}
        <span style={{
          display: 'inline-block',
          marginLeft: '8px',
          fontSize: '14px',
          color: 'var(--ghost)',
          transition: 'transform 0.2s ease, color 0.2s ease',
          transform: hovered ? 'translateX(3px)' : 'translateX(0)',
        }}>&rarr;</span>
      </div>
      <p style={{
        fontFamily: 'var(--body)',
        fontSize: '14.5px',
        lineHeight: 1.65,
        color: 'var(--dim)',
        margin: 0,
        maxWidth: '560px',
      }}>
        {project.description}
      </p>
      <div style={{
        fontFamily: 'var(--mono)',
        fontSize: '10px',
        fontWeight: 300,
        color: 'var(--ghost)',
        letterSpacing: '0.02em',
        marginTop: '14px',
      }}>
        {project.url.replace('https://', '')}
      </div>
    </a>
  );
}

/* ── Piece Entry ── */
function PieceEntry({ piece, index, mounted, offset }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={`/${piece.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '14px 0',
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
        fontFamily: 'var(--serif)',
        fontSize: '19px',
        fontWeight: 400,
        color: hovered ? 'var(--text)' : 'var(--text)',
        lineHeight: 1.3,
        transition: 'letter-spacing 0.2s ease',
        letterSpacing: hovered ? '0.01em' : '0',
      }}>
        {piece.title}
      </span>
      <span style={{
        fontFamily: 'var(--mono)',
        fontSize: '10px',
        fontWeight: 300,
        color: 'var(--ghost)',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}>
        {piece.date || ''}
      </span>
    </a>
  );
}

/* ── Section Header ── */
function SectionHeader({ children, mounted, delay }) {
  return (
    <h2 style={{
      fontFamily: 'var(--mono)',
      fontSize: '10px',
      fontWeight: 500,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--ghost)',
      marginBottom: '16px',
      opacity: mounted ? 1 : 0,
      transition: `opacity 0.5s ease ${delay}ms`,
    }}>
      {children}
    </h2>
  );
}

/* ══════════════════════════════════════
   HOMEPAGE
   ══════════════════════════════════════ */
export default function HomeContent() {
  const mounted = useMounted(80);
  const poems = PIECES.filter(p => p.type === 'poem' && p.status === 'live');
  const essays = PIECES.filter(p => p.type === 'essay' && p.status === 'live');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
    }}>
      {/* ── Header ── */}
      <header style={{
        maxWidth: 'var(--max-wide)',
        margin: '0 auto',
        padding: 'min(14vh, 120px) var(--page-pad) 0',
      }}>
        <h1 style={{
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(36px, 5.5vw, 56px)',
          fontWeight: 400,
          lineHeight: 1.05,
          color: 'var(--text)',
          letterSpacing: '-0.025em',
          margin: 0,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}>
          Jonathan M. Kelly
        </h1>
        <p style={{
          fontFamily: 'var(--mono)',
          fontSize: '12px',
          fontWeight: 300,
          color: 'var(--dim)',
          letterSpacing: '0.04em',
          marginTop: '12px',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.8s ease 200ms',
        }}>
          Poet &middot; Essayist &middot; Fiction-maker
        </p>
      </header>

      {/* ── Main content ── */}
      <main style={{
        maxWidth: 'var(--max-wide)',
        margin: '0 auto',
        padding: '64px var(--page-pad) 0',
      }}>
        {/* Projects */}
        <section style={{ marginBottom: '72px' }}>
          <SectionHeader mounted={mounted} delay={300}>Projects</SectionHeader>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
            gap: '20px',
          }}>
            {PROJECTS.filter(p => p.status === 'live').map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} mounted={mounted} />
            ))}
          </div>
        </section>

        {/* Poems */}
        {poems.length > 0 && (
          <section style={{ marginBottom: '72px' }}>
            <SectionHeader mounted={mounted} delay={500}>Poems</SectionHeader>
            <div>
              {poems.map((piece, i) => (
                <PieceEntry
                  key={piece.id}
                  piece={piece}
                  index={i}
                  mounted={mounted}
                  offset={PROJECTS.length}
                />
              ))}
            </div>
          </section>
        )}

        {/* Essays */}
        {essays.length > 0 && (
          <section style={{ marginBottom: '72px' }}>
            <SectionHeader mounted={mounted} delay={700}>Essays</SectionHeader>
            <div>
              {essays.map((piece, i) => (
                <PieceEntry
                  key={piece.id}
                  piece={piece}
                  index={i}
                  mounted={mounted}
                  offset={PROJECTS.length + poems.length}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── Footer ── */}
      <footer style={{
        maxWidth: 'var(--max-wide)',
        margin: '0 auto',
        padding: '32px var(--page-pad) 80px',
        borderTop: '1px solid var(--rule)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        gap: '12px',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.8s ease 600ms',
      }}>
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'baseline',
        }}>
          <a href="/about" style={{
            fontFamily: 'var(--mono)',
            fontSize: '11px',
            fontWeight: 400,
            color: 'var(--dim)',
            textDecoration: 'none',
            letterSpacing: '0.02em',
          }}>About</a>
          <a href="mailto:info@jonathanmkelly.com" style={{
            fontFamily: 'var(--mono)',
            fontSize: '11px',
            fontWeight: 400,
            color: 'var(--dim)',
            textDecoration: 'none',
            letterSpacing: '0.02em',
          }}>Contact</a>
        </div>
        <span style={{
          fontFamily: 'var(--mono)',
          fontSize: '10px',
          fontWeight: 300,
          color: 'var(--ghost)',
          letterSpacing: '0.02em',
        }}>
          &copy; {new Date().getFullYear()} Jonathan M. Kelly
        </span>
      </footer>
    </div>
  );
}
