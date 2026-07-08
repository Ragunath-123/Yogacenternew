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

/* ---------- Review submission form with Supabase integration ---------- */
let supabaseClient = null;
let uploadImageFn = null;

async function initSupabase() {
  if (supabaseClient) return supabaseClient;

  try {
    const module = await import('./supabase.js');
    supabaseClient = module.supabase;
    uploadImageFn = module.uploadImage;
    return supabaseClient;
  } catch (err) {
    console.error('Failed to load Supabase:', err);
    return null;
  }
}

function initReviewForm() {
  const form = document.getElementById('reviewForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';

    try {
      // Initialize Supabase
      const supabase = await initSupabase();
      if (!supabase) {
        throw new Error('Database connection failed. Please refresh and try again.');
      }

      // Get form values
      const fullName = form.querySelector('input[name="fullName"]').value.trim();
      const mobile = form.querySelector('input[name="mobile"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();
      const service = form.querySelector('select[name="service"]').value;
      const duration = form.querySelector('input[name="duration"]')?.value.trim() || '';
      const rating = parseInt(form.querySelector('input[name="rating"]:checked')?.value);
      const review = form.querySelector('textarea[name="review"]').value.trim();
      const beforeImageInput = form.querySelector('input[name="beforeImage"]');
      const afterImageInput = form.querySelector('input[name="afterImage"]');

      // Validate
      if (!fullName || !mobile || !email || !service || !rating || !review) {
        throw new Error('Please fill in all required fields');
      }

      // Upload images if provided
      let beforeImageUrl = null;
      let afterImageUrl = null;

      if (beforeImageInput.files[0]) {
        beforeImageUrl = await uploadImageFn(beforeImageInput.files[0]);
      }
      if (afterImageInput.files[0]) {
        afterImageUrl = await uploadImageFn(afterImageInput.files[0]);
      }

      // Save review to database
      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          full_name: fullName,
          mobile: mobile,
          email: email,
          service: service,
          duration: duration,
          rating: rating,
          review_text: review,
          before_image_url: beforeImageUrl,
          after_image_url: afterImageUrl,
          is_approved: true
        }])
        .select();

      if (error) throw error;

      // Reset form
      form.reset();
      const stars = form.querySelectorAll('.rating-input input');
      stars.forEach(s => { s.checked = false; });

      // Show success popup
      showSuccessPopup();

      // Refresh transformations display
      await loadTransformations();

    } catch (err) {
      console.error('Submission error:', err);
      alert(err.message || 'Failed to submit review. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

function showSuccessPopup() {
  const popup = document.getElementById('reviewPopup');
  if (!popup) return;
  popup.classList.add('show');

  const okBtn = popup.querySelector('.popup-ok');
  const closeBtn = popup.querySelector('.popup-close');

  const close = () => {
    popup.classList.remove('show');
  };

  okBtn?.addEventListener('click', close);
  closeBtn?.addEventListener('click', close);
}

/* ---------- Load and display transformation reviews from database ---------- */
async function loadTransformations() {
  const container = document.querySelector('.transform-grid');
  if (!container) return;

  try {
    const supabase = await initSupabase();
    if (!supabase) {
      console.error('Supabase not initialized');
      return;
    }

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) throw error;

    if (!reviews || reviews.length === 0) {
      container.innerHTML = `
        <div class="no-reviews" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
          <i class="bi bi-stars" style="font-size: 3rem; color: var(--gold-400);"></i>
          <h4 style="margin-top: 20px; color: var(--green-700);">No Transformations Yet</h4>
          <p style="color: var(--neutral-600);">Be the first to share your wellness journey!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = reviews.map(review => createTransformCard(review)).join('');

  } catch (err) {
    console.error('Error loading transformations:', err);
  }
}

function createTransformCard(review) {
  const beforeBg = review.before_image_url
    ? `background-image: url('${review.before_image_url}'); background-size: cover; background-position: center;`
    : 'background: linear-gradient(135deg, var(--neutral-200), var(--neutral-100));';

  const afterBg = review.after_image_url
    ? `background-image: url('${review.after_image_url}'); background-size: cover; background-position: center;`
    : 'background: linear-gradient(135deg, var(--green-200), var(--gold-200));';

  const stars = '⭐'.repeat(review.rating);
  const duration = review.duration || `${review.service}`;

  return `
    <article class="transform-card">
      <div class="ba-wrap">
        <div class="img-tile before" style="${beforeBg}">
          <span class="tag before-tag">Before</span>
          ${!review.before_image_url ? '<span style="font-size: 0.75rem; opacity: 0.7;">Before</span>' : ''}
        </div>
        <div class="img-tile after" style="${afterBg}">
          <span class="tag after-tag">After</span>
          ${!review.after_image_url ? '<span style="font-size: 0.75rem; opacity: 0.7;">After</span>' : ''}
        </div>
      </div>
      <div class="story">
        <span class="meta">${duration} • ${stars}</span>
        <h4>${escapeHtml(review.full_name)}'s Journey</h4>
        <p>"${escapeHtml(review.review_text)}"</p>
      </div>
    </article>
  `;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
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
document.addEventListener('DOMContentLoaded', async () => {
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

  // Load transformations from database
  await loadTransformations();
});
