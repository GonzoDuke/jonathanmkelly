import React, { useState, useEffect } from 'react';
import { PROJECTS, PIECES, AA_PIECES, DET_PIECES } from '../data/pieces.js';

function useMounted(delay = 50) {
  const [m, setM] = useState(false);
  useEffect(() => { setTimeout(() => setM(true), delay); }, []);
  return m;
}

/* ── Navbar ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  const ls = {
    fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 400,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    color: 'rgba(240,236,228,0.7)', textDecoration: 'none',
  };
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      background: scrolled ? 'rgba(26,26,32,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(240,236,228,0.06)' : '1px solid transparent',
      transition: 'background 0.4s ease, border-color 0.4s ease',
      padding: '0 var(--page-pad)', height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <a href="/" style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 500, color: '#f0ece4', textDecoration: 'none', letterSpacing: '-0.01em' }}>JMK</a>
      <div style={{ display: 'flex', gap: 'clamp(20px, 3vw, 36px)', alignItems: 'center', flexWrap: 'wrap' }}>
        <a href="/projects" style={ls}>Projects</a>
        <a href="/detourist" style={ls}>detourist</a>
        <a href="/poetry" style={ls}>Poetry</a>
        <a href="/agency-artifact" style={ls}>A&amp;A</a>
        <a href="mailto:contact@jonathanmkelly.com" style={ls}>Contact</a>
        <a href="/about" style={ls}>About</a>
        <button
          onClick={async () => {
            const data = { title: 'Jonathan M. Kelly', text: 'Poet. Writer.', url: 'https://www.jonathanmkelly.com' };
            if (navigator.share) {
              try { await navigator.share(data); } catch {}
            } else {
              await navigator.clipboard.writeText(data.url);
              const btn = document.querySelector('.home-share-btn');
              btn.textContent = 'Copied';
              setTimeout(() => { btn.textContent = 'Share'; }, 1500);
            }
          }}
          className="home-share-btn"
          style={{
            background: 'none', border: '1px solid rgba(240,236,228,0.2)',
            borderRadius: '3px', padding: '5px 12px', cursor: 'pointer',
            fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 400,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color: 'rgba(240,236,228,0.5)', transition: 'all 0.2s ease',
          }}>Share</button>
      </div>
    </nav>
  );
}

/* ── Hero ── */
function Hero({ mounted }) {
  return (
    <section style={{
      background: '#1a1a20', position: 'relative', overflow: 'hidden',
      padding: 'clamp(100px, 14vh, 160px) var(--page-pad) clamp(64px, 8vh, 96px)',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
        pointerEvents: 'none', zIndex: 1,
      }} />
      <div style={{
        position: 'relative', zIndex: 2, maxWidth: '1400px', width: '100%', margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        flexWrap: 'wrap', gap: 'clamp(24px, 3vw, 48px)',
      }}>
        <div style={{
          flex: '1 1 500px',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s ease, transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <div style={{ width: 'fit-content' }}>
            <a href="/about" style={{ textDecoration: 'none' }}>
              <h1 style={{
                fontFamily: "'Crimson Pro', var(--serif)", fontSize: 'clamp(44px, 8vw, 100px)',
                fontWeight: 600, lineHeight: 0.95,
                color: '#ffffff',
                letterSpacing: '-0.02em', margin: '0 0 14px',
                cursor: 'pointer',
              }}>Jonathan M. Kelly</h1>
            </a>
            <p style={{
              fontFamily: "'Crimson Pro', var(--serif)", fontSize: 'clamp(18px, 2.5vw, 26px)',
              fontWeight: 300, fontStyle: 'italic',
              color: 'rgba(255,255,255,0.6)', letterSpacing: '0.01em',
              margin: 0, textAlign: 'center',
            }}>Poet &middot; Writer</p>
          </div>
        </div>
        <div style={{
          flex: '0 1 440px', minWidth: '240px', paddingBottom: '6px',
          opacity: mounted ? 1 : 0, transition: 'opacity 1s ease 0.3s',
        }}>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(18px, 2.2vw, 24px)',
            fontWeight: 300, lineHeight: 1.5,
            color: 'rgba(255,255,255,0.55)', margin: 0,
          }}>Essays, poems, and hybrid projects that live at the edges of authorship and form. This is where the work lives.</p>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   COMPACT BANDS
   ══════════════════════════════════════ */

function Band({ id, href, bg, hoverBg, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      id={id} href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block', textDecoration: 'none',
        background: hovered ? hoverBg : bg,
        padding: '0 var(--page-pad)',
        cursor: 'pointer', transition: 'background 0.3s ease',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {children(hovered)}
    </a>
  );
}

function AABand() {
  const count = AA_PIECES.filter(p => p.status === 'live').length;
  return (
    <Band id="agency-artifact" href="/agency-artifact" bg="#1b2332" hoverBg="#1f2940">
      {(hovered) => (
        <div style={{
          maxWidth: '1400px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 'clamp(72px, 9vh, 88px)', gap: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 3vw, 40px)' }}>
            <div style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 400, color: '#e0e4ec', letterSpacing: '-0.02em',
              lineHeight: 1, whiteSpace: 'nowrap',
            }}>Agency &amp; Artifact</div>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 400,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#6889b4', whiteSpace: 'nowrap',
            }}>{count} essays</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{
              fontFamily: 'var(--body)', fontSize: '14px', fontStyle: 'italic',
              color: 'rgba(224,228,236,0.3)', display: 'none',
            }}>Writing clearly in a system built for noise.</span>
            <span style={{
              fontSize: '20px',
              color: hovered ? 'rgba(224,228,236,0.5)' : 'rgba(224,228,236,0.2)',
              transition: 'transform 0.3s ease, color 0.3s ease',
              transform: hovered ? 'translateX(4px)' : 'translateX(0)',
            }}>&rarr;</span>
          </div>
        </div>
      )}
    </Band>
  );
}

function DetouristBand() {
  const count = DET_PIECES.filter(p => p.status === 'live').length;
  return (
    <Band id="detourist" href="/detourist" bg="#0a0a0a" hoverBg="#111">
      {(hovered) => (
        <div style={{
          maxWidth: '1400px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 'clamp(72px, 9vh, 88px)', gap: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 3vw, 40px)' }}>
            <div style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 500, lineHeight: 1, letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}>
              <span style={{ color: '#d4822a' }}>de</span>
              <span style={{ color: '#ffffff' }}>tourist</span>
            </div>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 400,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(212,130,42,0.5)', whiteSpace: 'nowrap',
            }}>{count} pieces</span>
          </div>
          <span style={{
            fontSize: '20px',
            color: hovered ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)',
            transition: 'transform 0.3s ease, color 0.3s ease',
            transform: hovered ? 'translateX(4px)' : 'translateX(0)',
          }}>&rarr;</span>
        </div>
      )}
    </Band>
  );
}

function PoetryBand() {
  const count = PIECES.filter(p => p.status === 'live').length;
  return (
    <Band id="poetry" href="/poetry" bg="#231c14" hoverBg="#2a2018">
      {(hovered) => (
        <>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 20% 50%, rgba(62,42,20,0.3) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            height: 'clamp(72px, 9vh, 88px)', gap: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 3vw, 40px)' }}>
              <div style={{
                fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 300, fontStyle: 'italic', lineHeight: 1,
                color: '#d2c4a8', letterSpacing: '-0.02em',
                }}>Poetry</div>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 400,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(210,185,140,0.4)', whiteSpace: 'nowrap',
              }}>{count} poems</span>
            </div>
            <span style={{
              fontSize: '20px',
              color: hovered ? 'rgba(210,196,168,0.5)' : 'rgba(210,196,168,0.2)',
              transition: 'transform 0.3s ease, color 0.3s ease',
              transform: hovered ? 'translateX(4px)' : 'translateX(0)',
            }}>&rarr;</span>
          </div>
        </>
      )}
    </Band>
  );
}

function ProjectsBand() {
  return (
    <Band id="projects" href="/projects" bg="#1e3228" hoverBg="#243d30">
      {(hovered) => (
        <>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 70% 40%, rgba(40,70,50,0.3) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            height: 'clamp(72px, 9vh, 88px)', gap: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 3vw, 40px)' }}>
              <div style={{
                fontFamily: "'Alegreya SC', var(--serif)", fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 400, lineHeight: 1,
                color: '#d4b896', letterSpacing: '0.01em',
              }}>Hybrid Projects</div>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 400,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(212,184,150,0.35)', whiteSpace: 'nowrap',
              }}>{PROJECTS.filter(p => p.status === 'live').length} projects</span>
            </div>
            <span style={{
              fontSize: '20px',
              color: hovered ? 'rgba(212,184,150,0.5)' : 'rgba(212,184,150,0.2)',
              transition: 'transform 0.3s ease, color 0.3s ease',
              transform: hovered ? 'translateX(4px)' : 'translateX(0)',
            }}>&rarr;</span>
          </div>
        </>
      )}
    </Band>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer style={{
      background: '#1a1a20',
      borderTop: '1px solid rgba(240,236,228,0.1)',
      padding: '48px var(--page-pad) 64px',
    }}>
      <div style={{
        maxWidth: '1400px', margin: '0 auto',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--serif)', fontSize: '17px',
          fontWeight: 300, fontStyle: 'italic',
          color: 'rgba(255,255,255,0.6)', margin: '0 0 6px',
        }}>"Buy the ticket, take the ride."</p>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: '11px',
          color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em',
        }}>HST</span>
        <div style={{ margin: '24px 0 0' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'rgba(255,255,255,0.35)' }}>&copy; {new Date().getFullYear()} Jonathan M. Kelly</span>
        </div>
      </div>
    </footer>
  );
}

/* ── Homepage ── */
export default function HomeContent() {
  const mounted = useMounted(50);
  return (
    <div>
      <Navbar />
      <Hero mounted={mounted} />
      <ProjectsBand />
      <DetouristBand />
      <PoetryBand />
      <AABand />
      <Footer />
    </div>
  );
}
