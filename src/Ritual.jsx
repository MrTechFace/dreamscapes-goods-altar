// Direction 2: The Ritual — heavy/signature moments, horizontal rail, magnetic hovers
import React, { useState, useEffect, useRef } from 'react';
import HeroBg from './HeroBg.jsx';

function Ritual() {
  const railRef = useRef(null);
  const [heroRevealed, setHeroRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroRevealed(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Magnetic hover effect on featured cards
  useEffect(() => {
    const cards = document.querySelectorAll('.ritual-card');
    const handlers = [];
    cards.forEach(card => {
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--rx', `${-y * 6}deg`);
        card.style.setProperty('--ry', `${x * 6}deg`);
        card.style.setProperty('--mx', `${x * 16}px`);
        card.style.setProperty('--my', `${y * 16}px`);
      };
      const onLeave = () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--mx', '0px');
        card.style.setProperty('--my', '0px');
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      handlers.push([card, onMove, onLeave]);
    });
    return () => handlers.forEach(([c,m,l]) => {
      c.removeEventListener('mousemove', m);
      c.removeEventListener('mouseleave', l);
    });
  }, []);

  // Custom cursor
  useEffect(() => {
    const cursor = document.getElementById('ritual-cursor');
    if (!cursor) return;
    const move = (e) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    const hover = (e) => {
      if (e.target.closest('a, button')) cursor.classList.add('hover');
      else cursor.classList.remove('hover');
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', hover);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', hover);
    };
  }, []);

  const scrollRail = (dir) => {
    if (!railRef.current) return;
    railRef.current.scrollBy({ left: dir * 480, behavior: 'smooth' });
  };

  const featured = window.DG_PRODUCTS.slice(0, 10);
  const rest = window.DG_PRODUCTS;

  return (
    <div className="ritual grain">
      <div id="ritual-cursor" className="ritual-cursor" />

      <nav className="nav">
        <div className="nav-brand">
          <img src={(window.__resources && window.__resources.faviconRust) || "/assets/favicon-rust.png"} alt="DS" />
          <span>Dreamscapes Goods</span>
        </div>
        <div className="nav-links">
          <a href="#rail">Pieces</a>
          <a href="#about">Rite</a>
          <a href="https://shop.dreamscapesgoods.com">Shop ↗</a>
        </div>
      </nav>

      {/* HERO — big animated typographic reveal */}
      <section className={`ritual-hero ${heroRevealed ? 'revealed' : ''}`}>
        <div className="ritual-hero-bg" />
        <div className="ritual-hero-grid">
          {Array.from({length: 60}).map((_, i) => <div key={i} className="ritual-grid-cell" />)}
        </div>

        <div className="ritual-hero-content">
          <div className="ritual-eyebrow">
            <span className="dot" />
            <span>Now open · Collection 01</span>
          </div>

          <h1 className="ritual-title">
            <span className="line" style={{'--d':'0.2s'}}>Garments</span>
            <span className="line" style={{'--d':'0.35s'}}>for the</span>
            <span className="line green" style={{'--d':'0.5s'}}>mythically</span>
            <span className="line" style={{'--d':'0.65s'}}>inclined.</span>
          </h1>

          <div className="ritual-hero-bottom">
            <p className="ritual-sub">
              Sixteen pieces. Mythical, believed, and everyday. Printed &amp; embroidered on demand, shipped from the United States.
            </p>
            <a href="https://shop.dreamscapesgoods.com" className="shop-cta ritual-cta">
              Enter the Shop <span className="arr" />
            </a>
          </div>
        </div>

        {/* Vertical marquee text */}
        <div className="ritual-marquee left">
          <div className="mq-inner">
            {Array.from({length: 6}).map((_, i) => (
              <span key={i}>Wear the Void · Printed in USA · Designed in Sweden · </span>
            ))}
          </div>
        </div>
        <div className="ritual-marquee right">
          <div className="mq-inner">
            {Array.from({length: 6}).map((_, i) => (
              <span key={i}>EST 2026 · Dreamscapes Goods · On Demand · </span>
            ))}
          </div>
        </div>
      </section>

      {/* HORIZONTAL RAIL */}
      <section id="rail" className="ritual-rail-sec">
        <div className="ritual-rail-head">
          <div className="l">
            <span className="num">01 / The Rite</span>
            <h2>The Collection</h2>
          </div>
          <div className="r">
            <button onClick={() => scrollRail(-1)} className="rail-btn">←</button>
            <button onClick={() => scrollRail(1)} className="rail-btn">→</button>
          </div>
        </div>

        <div className="ritual-rail" ref={railRef}>
          {featured.map((p, i) => (
            <a key={p.id} href={p.url} className="ritual-card" style={{'--i': i}}>
              <div className="ritual-card-inner">
                <div className="ritual-card-idx">No. {String(i+1).padStart(2,'0')}</div>
                <div className="ritual-card-media">
                  {p.img ? (
                    <img src={p.img} alt={p.title.replace('\n',' ')} className="ritual-card-img" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    <div className="ritual-card-ph">
                      <span className="chisel">{p.title.replace('\n', ' ')}</span>
                    </div>
                  )}
                </div>
                <div className="ritual-card-meta">
                  <div>
                    <h3>{p.title.split('\n').map((l,j)=><span key={j}>{l}<br/></span>)}</h3>
                    <p>{p.cat}</p>
                  </div>
                  <span className="price">${p.price}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="ritual-rail-hint">
          <span>↔ Drag or scroll horizontally</span>
        </div>
      </section>

      {/* BIG TYPE MOMENT */}
      <section id="about" className="ritual-type">
        <div className="ritual-type-inner">
          <span className="num">02 / Origin</span>
          <p className="ritual-type-big">
            Designed in the dim&nbsp;light of a Swedish&nbsp;studio. Printed &amp; embroidered by hand in America. For people who see what <span className="green">others don't</span>.
          </p>
        </div>
      </section>

      {/* FULL GRID */}
      <section className="ritual-all">
        <div className="ritual-all-head">
          <span className="num">03 / Wares</span>
          <h2>All sixteen</h2>
        </div>
        <div className="ritual-all-grid">
          {rest.map((p, i) => (
            <a key={p.id} href={p.url} className="ritual-mini" style={{'--i': i}}>
              <div className="ritual-mini-num">{String(i+1).padStart(2,'0')}</div>
              <div className="ritual-mini-media">
                {p.img ? (
                  <img src={p.img} alt={p.title.replace('\n',' ')} className="ritual-mini-img" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                ) : (
                  <span>{p.cat}</span>
                )}
              </div>
              <div className="ritual-mini-meta">
                <h4>{p.title.replace('\n', ' ')}</h4>
                <span>${p.price}</span>
              </div>
            </a>
          ))}
        </div>
        <div className="ritual-all-cta">
          <a href="https://shop.dreamscapesgoods.com" className="shop-cta">
            Enter the Shop <span className="arr" />
          </a>
        </div>
      </section>

      <footer className="foot">
        <div className="sig">Wear the Void<span className="dot">.</span></div>
        <div className="links">
          <a href="https://shop.dreamscapesgoods.com">Shop</a>
          <a href="#">Instagram</a>
          <a href="#">Contact</a>
        </div>
        <div className="copy">© 2026 Dreamscapes Goods · Designed in Sweden · Shipped from USA</div>
      </footer>
    </div>
  );
}

window.Ritual = Ritual;

export default Ritual;
