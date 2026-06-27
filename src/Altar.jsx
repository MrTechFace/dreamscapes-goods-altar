// Direction 1: The Altar — atmospheric, subtle motion, gallery feel
import React, { useState, useEffect, useRef } from 'react';
import HeroBg from './HeroBg.jsx';

const fmtPrice = (n) => Number.isInteger(n) ? `$${n}` : `$${Math.round(n)}`;

function Altar() {
  const [scrollY, setScrollY] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      setNavScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Intersection observer for fade-ins
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('revealed');
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const featured = window.DG_PRODUCTS.filter(p => p.featured).slice(0, 4);
  const ancients = window.DG_PRODUCTS.filter(p => p.group === 'ancient');
  const cryptids = window.DG_PRODUCTS.filter(p => p.group === 'cryptid');
  const manifestos = window.DG_PRODUCTS.filter(p => p.group === 'manifesto');
  const gestures = window.DG_PRODUCTS.filter(p => p.group === 'gesture');

  const renderMini = (p, i) => (
    <a key={p.id} href={p.url} className="altar-mini" data-reveal style={{'--delay': `${(i % 6) * 40}ms`}}>
      <div className="altar-mini-media">
        {p.img ? (
          <img src={p.img} alt={p.title.replace('\n',' ')} className="altar-mini-img" />
        ) : (
          <span className="ph-mono">{p.cat}</span>
        )}
      </div>
      <div className="altar-mini-meta">
        <h4>{p.title.replace('\n', ' ')}</h4>
        <span>{fmtPrice(p.price)}</span>
      </div>
    </a>
  );

  return (
    <div className="altar grain">
      <nav className={`nav${navScrolled ? ' scrolled' : ''}`}>
        <div className="nav-brand">
          <img src={(window.__resources && window.__resources.faviconRust) || "/assets/favicon-rust.png"} alt="DS" />
          <span>Dreamscapes Goods</span>
        </div>
        <div className="nav-links">
          <a href="#collection">Collection</a>
          <a href="#about">About</a>
          <a href="https://shop.dreamscapesgoods.com">Shop ↗</a>
        </div>
        <button className={`nav-burger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
        {menuOpen && (
          <div className="nav-mobile-menu">
            <a href="#collection" onClick={() => setMenuOpen(false)}>Collection</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="https://shop.dreamscapesgoods.com" onClick={() => setMenuOpen(false)}>Shop ↗</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="altar-hero">
        <div
          className="altar-hero-bg"
          style={{ '--scroll': `${scrollY * 0.25}px` }}
        />
        <div className="altar-hero-inner">
          <div className="altar-eyebrow" data-reveal>
            <span className="dot" />
            <span>Collection 01 · Myths · Cryptids · Manifestos · Gestures</span>
          </div>

          <h1 className="altar-title" data-reveal>
            Wear what<br/>
            you <span className="green-accent">believe</span> in<span className="sage-dot">.</span>
          </h1>

          <div className="altar-sub" data-reveal>
            <p>Printed &amp; embroidered on demand. Designed in Sweden, shipped from the United States.</p>
          </div>

          <div className="altar-cta-row" data-reveal>
            <a href="https://shop.dreamscapesgoods.com" className="shop-cta">
              Enter the Shop <span className="arr" />
            </a>
            <div className="altar-stats">
              <div><span className="n">26</span><span className="l">Pieces</span></div>
              <div><span className="n">$20–89</span><span className="l">Price</span></div>
            </div>
          </div>
        </div>
        <div className="altar-scroll-hint" data-reveal>
          <span>Scroll</span>
          <div className="line" />
        </div>
      </section>

      {/* FEATURED */}
      <section id="collection" className="altar-featured">
        <div className="altar-sec-head" data-reveal>
          <span className="sec-num">01 / The Altar</span>
          <h2 className="sec-title">Featured<br/>Pieces</h2>
          <p className="sec-desc">Four garments from the current collection. Each printed or embroidered when ordered — no stockpile, no waste.</p>
        </div>

        <div className="altar-grid">
          {featured.map((p, i) => (
            <a key={p.id} href={p.url} className="altar-card" data-reveal style={{'--delay': `${i * 80}ms`}}>
              <div className="altar-card-media">
                {p.img ? (
                  <img src={p.img} alt={p.title.replace('\n',' ')} className="altar-card-img" />
                ) : (
                  <div className="altar-card-placeholder">
                    <span className="ph-mono">{p.cat.toUpperCase()}</span>
                    <span className="ph-name">{p.title.replace('\n', ' · ')}</span>
                  </div>
                )}
                <div className="altar-card-hover">
                  <span className="arr-big">→</span>
                </div>
              </div>
              <div className="altar-card-meta">
                <div>
                  <h3 className="altar-card-title">{p.title.split('\n').map((line, j) => <span key={j}>{line}<br/></span>)}</h3>
                  <p className="altar-card-cat">{p.cat}</p>
                </div>
                <span className="altar-card-price">{fmtPrice(p.price)}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ANCIENT MYTHOLOGY */}
      <section className="altar-all altar-coll">
        <div className="altar-sec-head" data-reveal>
          <span className="sec-num">02 / Ancient Mythology</span>
          <h2 className="sec-title">The<br/>Divine</h2>
          <p className="sec-desc">Egyptian gods, Hindu deities, Aztec serpents. Sacred imagery worn as everyday as a homage to the olde world.</p>
        </div>
        <div className="altar-all-grid">{ancients.map(renderMini)}</div>
      </section>

      {/* ABOUT — minimal, mythic */}
      <section id="about" className="altar-about">
        <div className="altar-about-inner">
          <span className="sec-num" data-reveal>03 / Origin</span>
          <p className="altar-about-quote" data-reveal>
            From a small studio in Sweden, for the American ritual of daily wear.
            <span className="accent"> Cryptids, gods, beliefs, and small gestures &mdash; printed on demand.</span>
          </p>
          <div className="altar-about-meta" data-reveal>
            <div>
              <span className="l">Designed</span>
              <span className="v">Sweden</span>
            </div>
            <div>
              <span className="l">Printed</span>
              <span className="v">United States</span>
            </div>
            <div>
              <span className="l">Model</span>
              <span className="v">On demand</span>
            </div>
          </div>
        </div>
      </section>

      {/* CRYPTIDS */}
      <section className="altar-all altar-coll">
        <div className="altar-sec-head" data-reveal>
          <span className="sec-num">04 / Cryptids</span>
          <h2 className="sec-title">The<br/>Mythical</h2>
          <p className="sec-desc">Werewolves, Mothman, Skinwalker, Jersey Devil. Garments for what watches from the treeline.</p>
        </div>
        <div className="altar-all-grid">{cryptids.map(renderMini)}</div>
      </section>

      {/* CHAPTER BREAK — Threshold */}
      <section className="altar-break" aria-hidden="true">
        <img src={(window.__resources && window.__resources.forestThreshold) || "/assets/forest-about.jpg"} alt="" className="altar-break-img" />
        <div className="altar-break-inner">
          <span className="altar-break-eyebrow">— Interlude —</span>
          <p className="altar-break-quote">
            Some things you only see at<br/>the edge of the trees.
          </p>
          <div className="altar-break-rule" />
        </div>
      </section>

      {/* MANIFESTOS */}
      <section className="altar-all altar-coll">
        <div className="altar-sec-head" data-reveal>
          <span className="sec-num">05 / Manifestos</span>
          <h2 className="sec-title">The<br/>Believed</h2>
          <p className="sec-desc">Gods, sovereignty, freedom, the undefeated. Beliefs worn on the chest.</p>
        </div>
        <div className="altar-all-grid">{manifestos.map(renderMini)}</div>
      </section>

      {/* CHAPTER BREAK — Carry */}
      <section className="altar-break" aria-hidden="true">
        <img src={(window.__resources && window.__resources.forestCarry) || "/assets/forest-interlude-2.jpg"} alt="" className="altar-break-img" />
        <div className="altar-break-inner">
          <span className="altar-break-eyebrow">— Interlude —</span>
          <p className="altar-break-quote">
            What you wear becomes<br/>what you carry.
          </p>
          <div className="altar-break-rule" />
        </div>
      </section>

      {/* GESTURES */}
      <section className="altar-all altar-coll">
        <div className="altar-sec-head" data-reveal>
          <span className="sec-num">06 / Gestures</span>
          <h2 className="sec-title">The<br/>Everyday</h2>
          <p className="sec-desc">Caps, embroidered. Heart hands, shaka, escapism. Small signals to the like-minded.</p>
        </div>
        <div className="altar-all-grid">{gestures.map(renderMini)}</div>
        <div className="altar-final-cta" data-reveal>
          <a href="https://shop.dreamscapesgoods.com" className="shop-cta">
            Shop the Collection <span className="arr" />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="foot">
        <div className="sig">Wear the Void<span className="dot">.</span></div>
        <div className="links">
          <a href="https://shop.dreamscapesgoods.com">Shop</a>
          <a href="#">Instagram</a>
          <a href="#">Contact</a>
        </div>
        <div className="copy">© 2026 Dreamscapes Goods</div>
        <div className="copy-sub">Designed in Sweden · Shipped from USA</div>
      </footer>
    </div>
  );
}


export default Altar;
