/* ============================================================
   Federico Gambedotti — Personal Site
   script.js
   ============================================================ */

// ── CONFIG ────────────────────────────────────────────────
const CONFIG = {
  substackFeed: 'https://api.rss2json.com/v1/api.json?rss_url=https://fedegam.substack.com/feed&count=3',
  // Replace the URL below with your actual podcast RSS feed when available
  // e.g. https://feeds.transistor.fm/2humans-podcast
  podcastFeeds: [
    'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.transistor.fm/2humans-podcast&count=3',
    'https://api.rss2json.com/v1/api.json?rss_url=https://anchor.fm/s/2humans/podcast/rss&count=3',
  ],
  substackUrl: 'https://fedegam.substack.com',
  podcastUrl: 'https://podcasts.apple.com/gb/podcast/2humans-podcast/id1890864116',
};

// Fallback episodes pulled from Apple Podcasts (update as new episodes drop)
const PODCAST_FALLBACK = [
  {
    title: 'What happens when Academia is overtaken by AI?',
    date: '13 Apr 2026',
    duration: '40 min',
    url: 'https://podcasts.apple.com/gb/podcast/2humans-podcast/id1890864116?i=1000761056886',
    ep: 3
  },
  {
    title: 'Are We Overestimating the AI Revolution?',
    date: '5 Apr 2026',
    duration: '39 min',
    url: 'https://podcasts.apple.com/gb/podcast/2humans-podcast/id1890864116?i=1000759387952',
    ep: 2
  },
  {
    title: 'The AI War: How Google, OpenAI, and Anthropic Are Shaping the Future',
    date: '5 Apr 2026',
    duration: '43 min',
    url: 'https://podcasts.apple.com/gb/podcast/2humans-podcast/id1890864116?i=1000759383651',
    ep: 1
  }
];

// ── HELPERS ───────────────────────────────────────────────
function fmtDate(str) {
  if (!str) return '';
  const d = new Date(str);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── SUBSTACK FEED ─────────────────────────────────────────
async function loadSubstack() {
  const el = document.getElementById('substack-feed');
  try {
    const res = await fetch(CONFIG.substackFeed);
    const data = await res.json();
    if (!data.items || data.items.length === 0) throw new Error('No items');

    el.innerHTML = data.items.slice(0, 3).map(item => `
      <a class="article-item" href="${item.link}" target="_blank" rel="noopener">
        <div class="article-date">${fmtDate(item.pubDate)}</div>
        <div class="article-title">${item.title}</div>
        <div class="article-excerpt">${stripHtml(item.description).slice(0, 130)}…</div>
      </a>
    `).join('');
  } catch (e) {
    el.innerHTML = `<p class="error-msg">Read the latest on <a href="${CONFIG.substackUrl}" target="_blank" rel="noopener">Substack →</a></p>`;
  }
}

// ── PODCAST FEED ──────────────────────────────────────────
async function loadPodcast() {
  const el = document.getElementById('podcast-feed');

  for (const url of CONFIG.podcastFeeds) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        el.innerHTML = data.items.slice(0, 3).map((item, i) => `
          <a class="podcast-item" href="${item.link || CONFIG.podcastUrl}" target="_blank" rel="noopener">
            <div class="play-btn"><div class="play-tri"></div></div>
            <div class="pod-meta">
              <div class="pod-ep">Ep ${data.items.length - i}</div>
              <div class="pod-title">${item.title}</div>
              <div class="pod-dur">${fmtDate(item.pubDate)}</div>
            </div>
          </a>
        `).join('');
        return;
      }
    } catch (e) {
      // try next URL
    }
  }

  // Fallback to hardcoded episodes
  el.innerHTML = PODCAST_FALLBACK.map(item => `
    <a class="podcast-item" href="${item.url}" target="_blank" rel="noopener">
      <div class="play-btn"><div class="play-tri"></div></div>
      <div class="pod-meta">
        <div class="pod-ep">Ep ${item.ep}</div>
        <div class="pod-title">${item.title}</div>
        <div class="pod-dur">${item.date} · ${item.duration}</div>
      </div>
    </a>
  `).join('');
}

// ── SUBSCRIBE BUTTON ──────────────────────────────────────
function initSubscribe() {
  const form = document.getElementById('sub-form');
  const btn = document.getElementById('sub-btn');
  const input = document.getElementById('sub-email');
  const feedback = document.getElementById('sub-feedback');
  if (!form || !btn || !input || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = input.value.trim();

    if (!isValidEmail(email)) {
      input.setAttribute('aria-invalid', 'true');
      feedback.textContent = 'Enter a valid email address.';
      feedback.dataset.state = 'error';
      input.focus();
      return;
    }

    input.removeAttribute('aria-invalid');
    feedback.textContent = 'Opening Substack sign-up...';
    feedback.dataset.state = 'success';
    window.open(`${CONFIG.substackUrl}/subscribe?email=${encodeURIComponent(email)}`, '_blank', 'noopener,noreferrer');
    input.value = '';
    btn.textContent = 'Done ✓';
    btn.style.background = 'var(--accent)';
    setTimeout(() => {
      btn.textContent = 'Subscribe →';
      btn.style.background = '';
      feedback.textContent = '';
      delete feedback.dataset.state;
    }, 3000);
  });

  input.addEventListener('input', () => {
    if (isValidEmail(input.value.trim())) {
      input.removeAttribute('aria-invalid');
      if (feedback.dataset.state === 'error') {
        feedback.textContent = '';
        delete feedback.dataset.state;
      }
    }
  });
}

// ── CONTACT EMAIL ────────────────────────────────────────
function initContactEmailLink() {
  const link = document.getElementById('contact-email-link');
  if (!link) return;

  const { user, domain } = link.dataset;
  if (!user || !domain) {
    link.removeAttribute('href');
    return;
  }

  const email = `${user}@${domain}`;
  link.href = `mailto:${email}?subject=Website%20enquiry`;
  link.setAttribute('aria-label', `Email ${email}`);
}

// ── MOBILE NAV ────────────────────────────────────────────
function initMobileNav() {
  const nav = document.querySelector('nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  if (!nav || !toggle || !links) return;

  const closeMenu = () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav when a link is clicked
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadSubstack();
  loadPodcast();
  initSubscribe();
  initContactEmailLink();
  initMobileNav();
});
