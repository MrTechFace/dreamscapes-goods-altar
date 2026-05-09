// Hero backgrounds — 4 variants: glyphs, wilderness, sigil, fog
// Each is a full-bleed canvas. A toggle UI in the top-right lets you cycle.

const { useEffect, useRef, useState } = React;

// ————————————————————————————————————————————————————
// A. DRIFTING GLYPHS — cryptid runes + DS monogram float like dust motes
// ————————————————————————————————————————————————————
function GlyphsBG() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const glyphs = ['ᛟ','ᚱ','ᚦ','ᚷ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','✧','◬','△','◯','⟁','⌬','DS','✦','⍟','⎊'];
    let motes = [];

    const resize = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // regen motes
      const count = Math.floor((w * h) / 14000);
      motes = new Array(count).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -0.05 - Math.random() * 0.15,
        size: 10 + Math.random() * 22,
        opacity: 0.04 + Math.random() * 0.18,
        glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
        rot: (Math.random() - 0.5) * 0.3,
        pulse: Math.random() * Math.PI * 2,
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // subtle green wash
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, Math.max(w, h) * 0.7);
      grad.addColorStop(0, 'rgba(34, 255, 101, 0.04)');
      grad.addColorStop(1, 'rgba(6, 8, 6, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      motes.forEach(m => {
        m.x += m.vx;
        m.y += m.vy;
        m.pulse += 0.01;
        if (m.y < -40) { m.y = h + 20; m.x = Math.random() * w; }
        if (m.x < -40) m.x = w + 20;
        if (m.x > w + 40) m.x = -20;

        const twinkle = 0.6 + 0.4 * Math.sin(m.pulse);
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.rot);
        ctx.font = `${m.size}px "Pirata One", serif`;
        ctx.fillStyle = `rgba(180, 255, 200, ${m.opacity * twinkle})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(m.glyph, 0, 0);
        ctx.restore();
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="hero-bg-canvas" />;
}

// ————————————————————————————————————————————————————
// B. WILDERNESS — layered tree-line silhouettes + shifting aurora
// ————————————————————————————————————————————————————
function WildernessBG() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf, t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // deterministic tree layers
    let layers = [];
    const genLayers = (w, h) => {
      const makeLayer = (baseY, density, heightMin, heightMax, seed) => {
        const trees = [];
        const count = Math.floor(w / density);
        for (let i = 0; i < count; i++) {
          const rng = Math.sin(seed + i * 1.1) * 10000;
          const r = rng - Math.floor(rng);
          trees.push({
            x: i * density + (r - 0.5) * density * 0.8,
            h: heightMin + r * (heightMax - heightMin),
            w: 8 + r * 14,
          });
        }
        return { baseY, trees };
      };
      layers = [
        makeLayer(h * 0.82, 24, 60, 140, 1),
        makeLayer(h * 0.88, 18, 40, 100, 2),
        makeLayer(h * 0.94, 14, 25, 70, 3),
      ];
    };

    const resize = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      genLayers(w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    // soft star noise
    const stars = new Array(120).fill(0).map(() => ({
      x: Math.random(), y: Math.random() * 0.6, s: Math.random() * 1.2 + 0.2, p: Math.random() * Math.PI * 2,
    }));

    const drawTree = (x, baseY, h, w, shade) => {
      ctx.fillStyle = shade;
      // trunk
      ctx.fillRect(x - 0.5, baseY - h * 0.35, 1, h * 0.35);
      // triangle foliage, 3 stacked
      ctx.beginPath();
      ctx.moveTo(x - w * 0.5, baseY - h * 0.2);
      ctx.lineTo(x + w * 0.5, baseY - h * 0.2);
      ctx.lineTo(x, baseY - h * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x - w * 0.42, baseY - h * 0.45);
      ctx.lineTo(x + w * 0.42, baseY - h * 0.45);
      ctx.lineTo(x, baseY - h * 0.8);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x - w * 0.32, baseY - h * 0.68);
      ctx.lineTo(x + w * 0.32, baseY - h * 0.68);
      ctx.lineTo(x, baseY - h);
      ctx.closePath();
      ctx.fill();
    };

    const loop = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      t += 0.003;

      // sky gradient (deep void with green hint)
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#040604');
      sky.addColorStop(0.5, '#06100a');
      sky.addColorStop(1, '#030403');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // aurora bands — multiple shifting curves
      for (let i = 0; i < 3; i++) {
        const phase = t + i * 1.2;
        const cy = h * (0.25 + i * 0.08);
        const amp = 40 + i * 20;
        const grad = ctx.createLinearGradient(0, cy - 60, 0, cy + 60);
        const alpha = 0.08 + i * 0.03;
        grad.addColorStop(0, 'rgba(34, 255, 101, 0)');
        grad.addColorStop(0.5, `rgba(34, 255, 101, ${alpha})`);
        grad.addColorStop(1, 'rgba(34, 255, 101, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, cy);
        for (let x = 0; x <= w; x += 8) {
          const y = cy + Math.sin(x * 0.003 + phase) * amp + Math.sin(x * 0.008 + phase * 1.3) * (amp * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, cy + 100);
        ctx.lineTo(0, cy + 100);
        ctx.closePath();
        ctx.fill();
      }

      // stars
      stars.forEach(s => {
        s.p += 0.02;
        const alpha = 0.3 + 0.3 * Math.sin(s.p);
        ctx.fillStyle = `rgba(220, 240, 220, ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.s, 0, Math.PI * 2);
        ctx.fill();
      });

      // moon (subtle)
      const mx = w * 0.82, my = h * 0.22;
      const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 140);
      mg.addColorStop(0, 'rgba(200, 240, 210, 0.18)');
      mg.addColorStop(1, 'rgba(200, 240, 210, 0)');
      ctx.fillStyle = mg;
      ctx.fillRect(mx - 140, my - 140, 280, 280);
      ctx.fillStyle = 'rgba(220, 240, 220, 0.85)';
      ctx.beginPath();
      ctx.arc(mx, my, 22, 0, Math.PI * 2);
      ctx.fill();

      // mist layer before trees
      const mist = ctx.createLinearGradient(0, h * 0.65, 0, h);
      mist.addColorStop(0, 'rgba(34, 255, 101, 0)');
      mist.addColorStop(0.6, 'rgba(20, 40, 30, 0.4)');
      mist.addColorStop(1, 'rgba(10, 20, 15, 0.8)');
      ctx.fillStyle = mist;
      ctx.fillRect(0, h * 0.65, w, h * 0.35);

      // tree layers
      const shades = ['#0a120c', '#050907', '#020403'];
      layers.forEach((layer, li) => {
        layer.trees.forEach(tr => drawTree(tr.x, layer.baseY, tr.h, tr.w, shades[li]));
      });

      // bottom fog
      const fog = ctx.createLinearGradient(0, h * 0.85, 0, h);
      fog.addColorStop(0, 'rgba(6, 8, 6, 0)');
      fog.addColorStop(1, 'rgba(6, 8, 6, 1)');
      ctx.fillStyle = fog;
      ctx.fillRect(0, h * 0.85, w, h * 0.15);

      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="hero-bg-canvas" />;
}

// ————————————————————————————————————————————————————
// C. SIGIL — occult geometry draws line-by-line, fades, redraws
// ————————————————————————————————————————————————————
function SigilBG() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // sigil definitions — each is a list of strokes, each stroke a list of points
    // coords are in unit circle space (-1..1), rendered at scale
    const sigils = [
      // Pentagram
      (() => {
        const pts = [];
        for (let i = 0; i < 5; i++) {
          const a = -Math.PI / 2 + (i * 4 * Math.PI / 5);
          pts.push([Math.cos(a), Math.sin(a)]);
        }
        pts.push(pts[0]);
        const circle = [];
        for (let i = 0; i <= 64; i++) {
          const a = (i / 64) * Math.PI * 2;
          circle.push([Math.cos(a), Math.sin(a)]);
        }
        return [circle, pts];
      })(),
      // Seal of Solomon (hexagram)
      (() => {
        const up = [], down = [];
        for (let i = 0; i < 3; i++) {
          const a = -Math.PI / 2 + (i * 2 * Math.PI / 3);
          up.push([Math.cos(a), Math.sin(a)]);
        }
        up.push(up[0]);
        for (let i = 0; i < 3; i++) {
          const a = Math.PI / 2 + (i * 2 * Math.PI / 3);
          down.push([Math.cos(a), Math.sin(a)]);
        }
        down.push(down[0]);
        const circle = [];
        for (let i = 0; i <= 64; i++) {
          const a = (i / 64) * Math.PI * 2;
          circle.push([Math.cos(a), Math.sin(a)]);
        }
        return [circle, up, down];
      })(),
      // Triquetra (three interlocking arcs)
      (() => {
        const strokes = [];
        for (let i = 0; i < 3; i++) {
          const ang = -Math.PI / 2 + i * (2 * Math.PI / 3);
          const cx = Math.cos(ang) * 0.5, cy = Math.sin(ang) * 0.5;
          const arc = [];
          const start = ang + Math.PI * 0.35;
          const end = ang + Math.PI * 1.65;
          for (let j = 0; j <= 40; j++) {
            const a = start + (end - start) * (j / 40);
            arc.push([cx + Math.cos(a) * 0.55, cy + Math.sin(a) * 0.55]);
          }
          strokes.push(arc);
        }
        const circle = [];
        for (let i = 0; i <= 64; i++) {
          const a = (i / 64) * Math.PI * 2;
          circle.push([Math.cos(a), Math.sin(a)]);
        }
        strokes.push(circle);
        return strokes;
      })(),
      // Metatron-ish: circle with 6 inner nodes connected
      (() => {
        const nodes = [[0, 0]];
        for (let i = 0; i < 6; i++) {
          const a = -Math.PI / 2 + (i * Math.PI / 3);
          nodes.push([Math.cos(a) * 0.7, Math.sin(a) * 0.7]);
        }
        const strokes = [];
        // outer ring
        const outer = [];
        for (let i = 0; i <= 64; i++) {
          const a = (i / 64) * Math.PI * 2;
          outer.push([Math.cos(a), Math.sin(a)]);
        }
        strokes.push(outer);
        // inner connections
        for (let i = 1; i <= 6; i++) {
          const next = i === 6 ? 1 : i + 1;
          strokes.push([nodes[i], nodes[next]]);
          strokes.push([nodes[i], nodes[0]]);
        }
        return strokes;
      })(),
    ];

    let sigilIdx = 0;
    let phase = 0; // 0..1 draw, 1..1.3 hold, 1.3..1.6 fade
    const duration = 9; // seconds for full cycle
    let lastT = performance.now();

    const loop = () => {
      const now = performance.now();
      const dt = (now - lastT) / 1000;
      lastT = now;
      phase += dt / duration;
      if (phase > 1.6) {
        phase = 0;
        sigilIdx = (sigilIdx + 1) % sigils.length;
      }

      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // faint radial wash
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.5);
      grad.addColorStop(0, 'rgba(34, 255, 101, 0.05)');
      grad.addColorStop(1, 'rgba(6, 8, 6, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // compute scale: fit
      const scale = Math.min(w, h) * 0.32;
      const cx = w * 0.5, cy = h * 0.5;

      const strokes = sigils[sigilIdx];
      let totalPts = 0;
      strokes.forEach(s => totalPts += s.length);
      const drawProgress = Math.min(phase, 1);
      const fadeStart = 1.3, fadeEnd = 1.6;
      let alpha = 0.7;
      if (phase > fadeStart) {
        alpha = 0.7 * (1 - (phase - fadeStart) / (fadeEnd - fadeStart));
      }

      let ptsDrawn = 0;
      const ptsToDraw = drawProgress * totalPts;

      ctx.strokeStyle = `rgba(34, 255, 101, ${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.shadowColor = 'rgba(34, 255, 101, 0.5)';
      ctx.shadowBlur = 8;

      strokes.forEach(stroke => {
        if (ptsDrawn >= ptsToDraw) return;
        ctx.beginPath();
        for (let i = 0; i < stroke.length; i++) {
          if (ptsDrawn >= ptsToDraw) break;
          const [px, py] = stroke[i];
          const x = cx + px * scale;
          const y = cy + py * scale;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          ptsDrawn++;
        }
        ctx.stroke();
      });

      // dot at the leading edge while drawing
      if (phase < 1) {
        let cursor = ptsToDraw;
        for (const stroke of strokes) {
          if (cursor <= stroke.length) {
            const idx = Math.max(0, Math.min(stroke.length - 1, Math.floor(cursor)));
            const [px, py] = stroke[idx];
            const x = cx + px * scale, y = cy + py * scale;
            ctx.fillStyle = 'rgba(34, 255, 101, 1)';
            ctx.shadowBlur = 16;
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, Math.PI * 2);
            ctx.fill();
            break;
          } else {
            cursor -= stroke.length;
          }
        }
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="hero-bg-canvas" />;
}

// ————————————————————————————————————————————————————
// F. REACTIVE FOG — dark volumetric noise that parts around cursor, with hidden glyphs underneath
// ————————————————————————————————————————————————————
function FogBG() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf, t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999, targetX: -9999, targetY: -9999 };

    const glyphs = ['ᛟ','ᚱ','ᚦ','ᛉ','✧','◬','△','DS','⟁','⎊','◯','⌬'];
    let hidden = [];

    const resize = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // sparse hidden glyph field
      const count = Math.floor((w * h) / 24000);
      hidden = new Array(count).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 14 + Math.random() * 28,
        glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
        rot: (Math.random() - 0.5) * 0.4,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.targetX = -9999; mouse.targetY = -9999; };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    // noise offscreen
    const noiseCanvas = document.createElement('canvas');
    const noiseCtx = noiseCanvas.getContext('2d');
    const NSIZE = 256;
    noiseCanvas.width = NSIZE; noiseCanvas.height = NSIZE;
    const imgData = noiseCtx.createImageData(NSIZE, NSIZE);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const v = Math.random() * 255;
      imgData.data[i] = v;
      imgData.data[i + 1] = v;
      imgData.data[i + 2] = v;
      imgData.data[i + 3] = 255;
    }
    noiseCtx.putImageData(imgData, 0, 0);

    const loop = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      t += 0.004;

      // smooth cursor follow
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // base: deep void
      ctx.fillStyle = '#040604';
      ctx.fillRect(0, 0, w, h);

      // draw hidden glyphs (dim)
      hidden.forEach(g => {
        const dx = g.x - mouse.x, dy = g.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const revealRadius = 220;
        const reveal = Math.max(0, 1 - dist / revealRadius);
        const baseAlpha = 0.06;
        const alpha = baseAlpha + reveal * 0.35;
        ctx.save();
        ctx.translate(g.x, g.y);
        ctx.rotate(g.rot);
        ctx.font = `${g.size}px "Pirata One", serif`;
        ctx.fillStyle = `rgba(180, 255, 200, ${alpha})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(g.glyph, 0, 0);
        ctx.restore();
      });

      // fog layers — 3 drifting noise tiles at different scales/opacities
      ctx.globalCompositeOperation = 'source-over';
      const layers = [
        { scale: 2.0, opacity: 0.55, dx: Math.sin(t * 0.7) * 120 + t * 18, dy: Math.cos(t * 0.5) * 80 },
        { scale: 3.5, opacity: 0.4, dx: -t * 12, dy: Math.sin(t * 0.8) * 60 },
        { scale: 5.0, opacity: 0.3, dx: t * 8, dy: -t * 6 },
      ];
      layers.forEach(l => {
        ctx.globalAlpha = l.opacity;
        const tileW = NSIZE * l.scale;
        const tileH = NSIZE * l.scale;
        const offX = ((l.dx % tileW) + tileW) % tileW;
        const offY = ((l.dy % tileH) + tileH) % tileH;
        for (let x = -tileW + offX; x < w; x += tileW) {
          for (let y = -tileH + offY; y < h; y += tileH) {
            ctx.drawImage(noiseCanvas, x - tileW, y - tileH, tileW, tileH);
          }
        }
      });
      ctx.globalAlpha = 1;

      // darken pass (the noise is white, we want dark fog)
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = 'rgba(8, 14, 10, 0.92)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';

      // cursor "lantern" — radial clearing + green halo
      if (mouse.x > -1000) {
        const r = 200;
        const clearing = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, r);
        clearing.addColorStop(0, 'rgba(34, 255, 101, 0.12)');
        clearing.addColorStop(0.4, 'rgba(34, 255, 101, 0.04)');
        clearing.addColorStop(1, 'rgba(34, 255, 101, 0)');
        ctx.fillStyle = clearing;
        ctx.fillRect(0, 0, w, h);
      }

      // vignette
      const vg = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.3, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);
  return <canvas ref={ref} className="hero-bg-canvas" />;
}

// ————————————————————————————————————————————————————
// Host component — picks a variant, persists, shows toggle
// ————————————————————————————————————————————————————
const HERO_VARIANTS = [
  { id: 'glyphs', label: 'Glyphs', Component: GlyphsBG },
  { id: 'wilderness', label: 'Wilderness', Component: WildernessBG },
  { id: 'sigil', label: 'Sigil', Component: SigilBG },
  { id: 'fog', label: 'Fog', Component: FogBG },
];

function HeroBG() {
  const [variant, setVariant] = useState(() => {
    return localStorage.getItem('dg-hero-bg') || 'wilderness';
  });

  useEffect(() => {
    localStorage.setItem('dg-hero-bg', variant);
  }, [variant]);

  const Active = HERO_VARIANTS.find(v => v.id === variant)?.Component || WildernessBG;

  return (
    <>
      <Active />
      <div className="hero-bg-toggle" role="group" aria-label="Hero background">
        <span className="hbg-label">Atmosphere</span>
        <div className="hbg-buttons">
          {HERO_VARIANTS.map(v => (
            <button
              key={v.id}
              onClick={() => setVariant(v.id)}
              className={variant === v.id ? 'active' : ''}
              aria-pressed={variant === v.id}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

Object.assign(window, { HeroBG });
