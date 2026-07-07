/* ============================================================
   YogaLakshmi Wellness Center - Main JS
   Navbar, smooth scroll, ripple, back-to-top, scroll progress,
   mobile nav, review slider, review form popup, counters
   ============================================================ */

/* ---------- Mobile nav toggle ---------- */
function initMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const wrap = document.querySelector('.nav-wrap');
  const backdrop = document.querySelector('.nav-backdrop');
  if (!toggle || !wrap) return;

  const close = () => {
    wrap.classList.remove('open');
    backdrop && backdrop.classList.remove('show');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const open = wrap.classList.toggle('open');
    backdrop && backdrop.classList.toggle('show', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  backdrop && backdrop.addEventListener('click', close);
  wrap.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

/* ---------- Sticky navbar + scroll progress + active link ---------- */
function initScrollUI() {
  const navbar = document.querySelector('.navbar-custom');
  const progress = document.querySelector('.scroll-progress');
  const backTop = document.querySelector('.back-top');
  const links = Array.from(document.querySelectorAll('.nav-links a'));
  const sections = links
    .map(a => {
      const id = a.getAttribute('href');
      return id && id.startsWith('#') ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  const onScroll = () => {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (navbar) navbar.classList.toggle('scrolled', y > 40);
    if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    if (backTop) backTop.classList.toggle('show', y > 600);

    // Active link highlighting
    const fromTop = y + 120;
    let activeIdx = -1;
    sections.forEach((sec, i) => {
      if (sec.offsetTop <= fromTop) activeIdx = i;
    });
    links.forEach((l, i) => l.classList.toggle('active', i === activeIdx));
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Smooth scroll for in-page anchors ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ---------- Button ripple effect ---------- */
function initRipples() {
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', e => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const rip = document.createElement('span');
      rip.className = 'rip';
      rip.style.width = rip.style.height = size + 'px';
      rip.style.left = (e.clientX - rect.left - size / 2) + 'px';
      rip.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(rip);
      setTimeout(() => rip.remove(), 650);
    });
  });
}

/* ---------- Back to top ---------- */
function initBackToTop() {
  const btn = document.querySelector('.back-top');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- Animated number counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 1600;
    const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = (target % 1 !== 0 ? val.toFixed(1) : Math.round(val)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting) { animate(en.target); obs.unobserve(en.target); }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => io.observe(c));
}

/* ---------- Reviews slider ---------- */
function initReviewsSlider() {
  const track = document.querySelector('.reviews-track');
  if (!track) return;
  const cards = Array.from(track.children);
  const prev = document.querySelector('.reviews-nav .prev');
  const next = document.querySelector('.reviews-nav .next');
  const dotsWrap = document.querySelector('.reviews-dots');
  if (!cards.length) return;

  let index = 0;
  let perView = 3;
  let timer = null;

  const computePerView = () => {
    const w = window.innerWidth;
    perView = w < 640 ? 1 : w < 992 ? 2 : 3;
  };

  // Build dots
  const buildDots = () => {
    if (!dotsWrap) return;
    const pages = Math.max(1, cards.length - perView + 1);
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pages; i++) {
      const d = document.createElement('span');
      d.className = 'dot' + (i === index ? ' active' : '');
      d.addEventListener('click', () => { index = i; update(); resetTimer(); });
      dotsWrap.appendChild(d);
    }
  };

  const update = () => {
    const cardW = cards[0].getBoundingClientRect().width + 24; // incl. gap
    track.style.transform = `translateX(${-index * cardW}px)`;
    if (dotsWrap) {
      Array.from(dotsWrap.children).forEach((d, i) =>
        d.classList.toggle('active', i === index));
    }
  };

  const nextSlide = () => {
    const max = cards.length - perView;
    index = index >= max ? 0 : index + 1;
    update();
  };
  const prevSlide = () => {
    const max = cards.length - perView;
    index = index <= 0 ? max : index - 1;
    update();
  };

  const resetTimer = () => {
    if (timer) clearInterval(timer);
    timer = setInterval(nextSlide, 5000);
  };

  next && next.addEventListener('click', () => { nextSlide(); resetTimer(); });
  prev && prev.addEventListener('click', () => { prevSlide(); resetTimer(); });

  window.addEventListener('resize', () => { computePerView(); buildDots(); update(); });

  computePerView();
  buildDots();
  update();
  resetTimer();
}

/* ---------- Review submission form with WhatsApp integration ---------- */
function initReviewForm() {
  const form = document.getElementById('reviewForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const fullName = form.querySelector('input[name="fullName"]').value.trim();
    const mobile = form.querySelector('input[name="mobile"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const service = form.querySelector('select[name="service"]').value;
    const rating = form.querySelector('input[name="rating"]:checked')?.value;
    const review = form.querySelector('textarea[name="review"]').value.trim();
    const beforeImageInput = form.querySelector('input[name="beforeImage"]');
    const afterImageInput = form.querySelector('input[name="afterImage"]');

    // Validate
    if (!fullName || !mobile || !email || !service || !rating || !review) {
      alert('Please fill in all required fields');
      return;
    }

    // Convert images to data URLs
    let beforeImageData = null;
    let afterImageData = null;

    if (beforeImageInput.files[0]) {
      beforeImageData = await fileToBase64(beforeImageInput.files[0]);
    }
    if (afterImageInput.files[0]) {
      afterImageData = await fileToBase64(afterImageInput.files[0]);
    }

    // Build WhatsApp message with images as links (since wa.me doesn't support direct uploads)
    let whatsappMessage = `*📝 NEW REVIEW SUBMISSION*\n\n`;
    whatsappMessage += `*Client Details:*\n`;
    whatsappMessage += `Name: ${fullName}\n`;
    whatsappMessage += `Phone: ${mobile}\n`;
    whatsappMessage += `Email: ${email}\n\n`;
    whatsappMessage += `*Service:* ${service}\n`;
    whatsappMessage += `*Rating:* ${'⭐'.repeat(rating)}\n\n`;
    whatsappMessage += `*Review:*\n${review}\n\n`;

    if (beforeImageData || afterImageData) {
      whatsappMessage += `*📸 Images Attached:*\n`;
      if (beforeImageData) {
        whatsappMessage += `Before: [Image provided]\n`;
      }
      if (afterImageData) {
        whatsappMessage += `After: [Image provided]\n`;
      }
    }

    // WhatsApp API
    const whatsappNumber = '919003977672';
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Reset form
    form.reset();
    const stars = form.querySelectorAll('.rating-input input');
    stars.forEach(s => { s.checked = false; });

    // Open WhatsApp with message
    window.open(whatsappURL, '_blank');

    // Show success message
    alert('✅ Review submitted! WhatsApp will open with your review details.');
  });
}

/* ---------- Helper function to convert file to base64 ---------- */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

/* ---------- Footer year ---------- */
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Contact form with WhatsApp integration ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Get form values
    const name = form.querySelector('input[name="name"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const phone = form.querySelector('input[name="phone"]').value.trim();
    const message = form.querySelector('textarea[name="message"]').value.trim();

    // Validate
    if (!name || !email || !phone || !message) {
      alert('Please fill in all fields');
      return;
    }

    // Format message for WhatsApp
    const whatsappMessage = `Hello! 👋\n\n*Customer Inquiry*\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n*Message:*\n${message}`;

    // WhatsApp API format
    const whatsappNumber = '919003977672'; // YogaLakshmi WhatsApp number
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Reset form and redirect
    form.reset();
    window.open(whatsappURL, '_blank');
  });
}

/* ---------- Bootstrap ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollUI();
  initSmoothScroll();
  initRipples();
  initBackToTop();
  initCounters();
  initReviewsSlider();
  initReviewForm();
  initContactForm();
  initYear();
});
