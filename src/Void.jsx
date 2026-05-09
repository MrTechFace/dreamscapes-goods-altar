// Direction 3: The Void — maximum experimental, WebGL-feel canvas, scroll-driven
import React, { useState, useEffect, useRef } from 'react';
import HeroBg from './HeroBg.jsx';

function Void() {
  const canvasRef = useRef(null);
  const [scrolled, setScrolled] = useState(0);
  const [entered, setEntered] = useState(false);

  // Particle void canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let mouseX = w/2, mouseY = h/2;
    const particles = [];
    const N = 80;
    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random()-0.5) * 0.3,
        vy: (Math.random()-0.5) * 0.3,
        r: Math.random() * 1.8 + 0.4,
        o: Math.random() * 0.5 + 0.15
      });
    }
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    const onMouse = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouse);

    let raf;
    const tick = () => {
      ctx.fillStyle = 'rgba(11,11,13,0.15)';
      ctx.fillRect(0, 0, w, h);
      particles.forEach(p => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 180) {
          p.vx -= (dx/d) * 0.02;
          p.vy -= (dy/d) * 0.02;
        }
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = d < 180 ? `rgba(57,255,20,${p.o})` : `rgba(232,228,220,${p.o * 0.6})`;
        ctx.fill();
      });
      // Connect nearby
      for (let i = 0; i < particles.length; i++) {
        for (let j = i+1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dd = Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2);
          if (dd < 110) {
            ctx.strokeStyle = `rgba(57,255,20,${0.12 * (1 - dd/110)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('[data-v-reveal]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('v-on'); });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const all = window.DG_PRODUCTS;

  return (
    <div className="void-d grain">
      <canvas ref={canvasRef} className="void-canvas" />

      <nav className="nav">
        <div className="nav-brand">
          <img src={(window.__resources && window.__resources.faviconRust) || "/assets/favicon-rust.png"} alt="DS" />
          <span>Dreamscapes Goods</span>
        </div>
        <div className="nav-links">
          <a href="#pieces">Pieces</a>
          <a href="#lore">Lore</a>
          <a href="https://shop.dreamscapesgoods.com">Shop ↗</a>
        </div>
      </nav>

      {/* HERO — void portal */}
      <section className="void-hero">
        <div className="void-portal" style={{ transform: `scale(${1 + scrolled * 0.0008}) rotate(${scrolled * 0.02}deg)` }}>
          <div className="void-ring r1" />
          <div className="void-ring r2" />
          <div className="void-ring r3" />
          <div className="void-ring r4" />
          <div className="void-center">
            <img src={(window.__resources && window.__resources.faviconRust) || "/assets/favicon-rust.png"} alt="DS" />
          </div>
        </div>

        <div className="void-hero-text" style={{ opacity: Math.max(0, 1 - scrolled / 500) }}>
          <div className="void-eyebrow">
            <span className="dot" />
            <span>Enter at your own rite</span>
          </div>
          <h1 className="void-title">
            <span>Wear</span>
            <span className="green italic">the</span>
            <span>Void<span className="dot">.</span></span>
          </h1>
          <p className="void-sub">Garments for the mythically inclined. Designed in Sweden · Printed in the United States · Shipped on demand.</p>
          <a href="https://shop.dreamscapesgoods.com" className="shop-cta void-cta">
            Enter the Shop <span className="arr" />
          </a>
        </div>

        <div className="void-scroll">
          <span>Descend</span>
          <div className="line" />
        </div>
      </section>

      {/* GLITCH BIG TYPE */}
      <section className="void-statement">
        <h2 className="void-glitch" data-v-reveal data-text="The internet is undefeated.">
          The internet<br/>is undefeated.
        </h2>
      </section>

      {/* PIECES — floating scattered cards */}
      <section id="pieces" className="void-pieces">
        <div className="void-pieces-head" data-v-reveal>
          <span className="num">01 / The Pieces</span>
          <h2>Sixteen rites.</h2>
          <p>Every garment printed or embroidered when you order. Nothing kept in stock. Nothing wasted.</p>
        </div>

        <div className="void-pieces-grid">
          {all.map((p, i) => (
            <a key={p.id} href={p.url}
               className={`void-piece ${i % 3 === 0 ? 'wide' : ''} ${i % 5 === 0 ? 'tall' : ''}`}
               data-v-reveal
               style={{'--d': `${(i % 6) * 80}ms`}}>
              <div className="void-piece-idx">No. {String(i+1).padStart(2,'0')}</div>
              <div className="void-piece-media">
                {p.img ? (
                  <img src={p.img} alt={p.title.replace('\n',' ')} className="void-piece-img" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                ) : (
                  <div className="void-piece-ph">
                    <span className="chisel">{p.title.replace('\n', ' ')}</span>
                  </div>
                )}
                <div className="void-piece-hover">
                  <span>View →</span>
                </div>
              </div>
              <div className="void-piece-meta">
                <h3>{p.title.replace('\n', ' ')}</h3>
                <div className="void-piece-row">
                  <span className="cat">{p.cat}</span>
                  <span className="price">${p.price}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* LORE / manifesto */}
      <section id="lore" className="void-lore">
        <div className="void-lore-inner">
          <div className="void-lore-num" data-v-reveal>02 / Manifesto</div>
          <div className="void-lore-lines">
            <p data-v-reveal>Made by a believer.</p>
            <p data-v-reveal>For other believers.</p>
            <p className="green" data-v-reveal>Wear the void.</p>
          </div>
          <div className="void-lore-meta" data-v-reveal>
            <div><span className="l">Origin</span><span className="v">Sweden</span></div>
            <div><span className="l">Fulfillment</span><span className="v">United States</span></div>
            <div><span className="l">Pieces</span><span className="v">Sixteen</span></div>
            <div><span className="l">Model</span><span className="v">On demand</span></div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="void-final">
        <div className="void-final-inner" data-v-reveal>
          <h2>Your rite<br/>awaits<span className="green">.</span></h2>
          <a href="https://shop.dreamscapesgoods.com" className="shop-cta void-cta-big">
            Enter the Shop <span className="arr" />
          </a>
        </div>
      </section>

      <footer className="foot">
        <div className="sig">Dreamscapes Goods<span className="dot">.</span></div>
        <div className="links">
          <a href="https://shop.dreamscapesgoods.com">Shop</a>
          <a href="#">Instagram</a>
          <a href="#">Contact</a>
        </div>
        <div className="copy">© 2026 · Designed in Sweden · Shipped from USA</div>
      </footer>
    </div>
  );
}

window.Void = Void;

export default Void;
