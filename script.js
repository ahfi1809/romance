/* =========================================
   script.js — Romantic Lyrics Display
   ========================================= */

// ── 1. PARTICLE STARS (canvas) ────────────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  let W, H, stars = [];

  const STAR_COUNT  = 90;
  const COLORS      = ['#F4C0D1', '#9FE1CB', '#f5edf2', '#f0c987'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomStar() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     0.5 + Math.random() * 1.8,
      alpha: 0.1 + Math.random() * 0.5,
      da:    (0.003 + Math.random() * 0.008) * (Math.random() < 0.5 ? 1 : -1),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  function initStars() {
    stars = Array.from({ length: STAR_COUNT }, randomStar);
  }

  function drawStars() {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.alpha += s.da;
      if (s.alpha <= 0.05 || s.alpha >= 0.85) s.da *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawStars);
  }

  resize();
  initStars();
  drawStars();
  window.addEventListener('resize', () => { resize(); initStars(); });
})();


// ── 2. FALLING PETALS (DOM) ───────────────────────────────────────────────────
(function initPetals() {
  const container = document.getElementById('petals');
  const COLORS    = ['#ED93B1', '#F4C0D1', '#9FE1CB', '#5DCAA5', '#f0c987'];
  const COUNT     = 18;

  function makePetal() {
    const el  = document.createElement('div');
    el.className = 'petal';
    const size  = 6 + Math.random() * 10;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const left  = Math.random() * 100;
    const dur   = 8 + Math.random() * 12;
    const delay = Math.random() * 15;

    el.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      border-radius: ${Math.random() > 0.5 ? '50% 0 50% 0' : '50%'};
      opacity: 0;
    `;
    container.appendChild(el);
  }

  for (let i = 0; i < COUNT; i++) makePetal();
})();


// ── 3. LYRIC LINE REVEAL (IntersectionObserver + timed delay) ─────────────────
(function initLyrics() {
  // Gather all lyric lines with their data-delay
  const lines   = document.querySelectorAll('.lyric-line[data-delay]');
  const finale  = document.querySelector('.finale[data-delay]');

  function scheduleReveal(el, delaySeconds) {
    setTimeout(() => {
      el.classList.add('visible');
    }, delaySeconds * 1000);
  }

  lines.forEach(line => {
    const d = parseFloat(line.dataset.delay) || 0;
    scheduleReveal(line, d);
  });

  if (finale) {
    const d = parseFloat(finale.dataset.delay) || 0;
    scheduleReveal(finale, d);
  }
})();


// ── 4. HEARTS FOOTER ROW ─────────────────────────────────────────────────────
(function initHeartsRow() {
  const row    = document.getElementById('heartsRow');
  const sizes  = [14, 10, 14];
  const opacities = [0.5, 0.3, 0.5];

  sizes.forEach((size, i) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width',   size);
    svg.setAttribute('height',  size);
    svg.setAttribute('viewBox', '0 0 14 14');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d',    'M7 12s-5.5-3.5-5.5-7a2.75 2.75 0 0 1 5.5 0 2.75 2.75 0 0 1 5.5 0c0 3.5-5.5 7-5.5 7z');
    path.setAttribute('fill', '#ED93B1');
    path.setAttribute('opacity', opacities[i]);

    svg.appendChild(path);
    row.appendChild(svg);
  });
})();


// ── 5. INTERACTIVE: click heart to pulse extra ────────────────────────────────
(function initHeartClick() {
  const heart = document.getElementById('heart');
  if (!heart) return;

  heart.style.cursor = 'pointer';

  heart.addEventListener('click', () => {
    // Spawn a floating mini-heart from the heart icon position
    const rect  = heart.getBoundingClientRect();
    const mini  = document.createElement('div');
    const size  = 12 + Math.random() * 14;
    const dx    = (Math.random() - 0.5) * 120;

    mini.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 14 14">
      <path d="M7 12s-5.5-3.5-5.5-7a2.75 2.75 0 0 1 5.5 0 2.75 2.75 0 0 1 5.5 0c0 3.5-5.5 7-5.5 7z"
            fill="#ED93B1"/>
    </svg>`;

    Object.assign(mini.style, {
      position:   'fixed',
      left:       rect.left + rect.width / 2 - size / 2 + 'px',
      top:        rect.top  + rect.height / 2 - size / 2 + 'px',
      pointerEvents: 'none',
      zIndex:     '100',
      transition: 'transform 1.4s ease, opacity 1.4s ease',
      opacity:    '1',
    });

    document.body.appendChild(mini);
    requestAnimationFrame(() => {
      mini.style.transform = `translate(${dx}px, -80px) scale(0.4)`;
      mini.style.opacity   = '0';
    });
    setTimeout(() => mini.remove(), 1500);
  });
})();