/* ============================================================
   YogaLakshmi Wellness Center - Animation JS
   Scroll-reveal via IntersectionObserver, hero parallax,
   generated floating leaves/particles
   ============================================================ */

/* ---------- Scroll reveal ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal, .reveal-stagger');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => io.observe(el));
}

/* ---------- Generate floating leaves + particles in hero ---------- */
function initHeroFX() {
  const layer = document.querySelector('.hero .fx-layer');
  if (!layer) return;

  const leafSVG = '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>';

  // Extra leaves beyond the CSS-positioned ones
  const extraLeaves = 8;
  for (let i = 0; i < extraLeaves; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.style.left = Math.random() * 100 + '%';
    leaf.style.animationDuration = (12 + Math.random() * 12) + 's';
    leaf.style.animationDelay = (Math.random() * 8) + 's';
    leaf.style.fontSize = (1 + Math.random() * 1.4) + 'rem';
    leaf.style.opacity = (0.25 + Math.random() * 0.3).toString();
    leaf.innerHTML = leafSVG;
    layer.appendChild(leaf);
  }

  // Extra particles
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.bottom = '0';
    p.style.animationDuration = (10 + Math.random() * 10) + 's';
    p.style.animationDelay = (Math.random() * 6) + 's';
    const size = 4 + Math.random() * 6;
    p.style.width = p.style.height = size + 'px';
    layer.appendChild(p);
  }
}

/* ---------- Subtle hero parallax on mouse move ---------- */
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const visual = hero.querySelector('.hero-visual');
  const layer = hero.querySelector('.fx-layer');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    if (layer) layer.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    if (visual) visual.style.transform = `translate(${x * -16}px, ${y * -16}px)`;
  });
  hero.addEventListener('mouseleave', () => {
    if (layer) layer.style.transform = '';
    if (visual) visual.style.transform = '';
  });
}

/* ---------- Tilt on glass / service cards (pointer) ---------- */
function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.service-card, .glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${y * -5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initHeroFX();
  initHeroParallax();
  initCardTilt();
});
