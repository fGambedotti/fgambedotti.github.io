/* ============================================================
   Federico Gambedotti — Personal Site
   script.js
   ============================================================ */

// ── CONFIG ────────────────────────────────────────────────
const CONFIG = {
  substackFeed: 'https://api.rss2json.com/v1/api.json?rss_url=https://fedegam.substack.com/feed',
  // Replace the URL below with your actual podcast RSS feed when available
  // e.g. https://feeds.transistor.fm/2humans-podcast
  podcastFeeds: [
    'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.transistor.fm/2humans-podcast&count=3',
    'https://api.rss2json.com/v1/api.json?rss_url=https://anchor.fm/s/2humans/podcast/rss&count=3',
  ],
  substackUrl: 'https://fedegam.substack.com',
  podcastUrl: 'https://podcasts.apple.com/gb/podcast/2humans-podcast/id1890864116',
  spotifyPodcastUrl: 'https://open.spotify.com/search/2Humans%20Podcast',
  youtubePodcastPlaylistId: 'PLGDbPqtiz-CSSgtcHHPJMgL1gUYAML-Fp',
  youtubePodcastFeed: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?playlist_id=PLGDbPqtiz-CSSgtcHHPJMgL1gUYAML-Fp',
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

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeTitle(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/\[.*?\]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractYouTubeVideoId(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return parsed.pathname.replace('/', '');
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const idFromQuery = parsed.searchParams.get('v');
      if (idFromQuery) return idFromQuery;
      const parts = parsed.pathname.split('/').filter(Boolean);
      const embedIndex = parts.indexOf('embed');
      if (embedIndex !== -1 && parts[embedIndex + 1]) return parts[embedIndex + 1];
    }
  } catch (e) {
    return '';
  }
  return '';
}

function podcastQuestionLine(title, description) {
  const cleanedTitle = String(title || '').replace(/\[.*?\]/g, '').trim();
  if (cleanedTitle.endsWith('?')) return cleanedTitle;

  const cleanedDescription = stripHtml(description || '').trim();
  if (cleanedDescription) {
    const firstSentence = cleanedDescription.split(/[.?!]/)[0].trim();
    if (firstSentence.length > 20) return firstSentence;
  }
  return `Debate: ${cleanedTitle}`;
}

function getFallbackEpisodeMeta(title) {
  const normalized = normalizeTitle(title);
  return PODCAST_FALLBACK.find((item) => {
    const fallbackNormalized = normalizeTitle(item.title);
    return normalized.includes(fallbackNormalized) || fallbackNormalized.includes(normalized);
  });
}

// ── SUBSTACK FEED ─────────────────────────────────────────
async function loadSubstack() {
  const el = document.getElementById('substack-feed');
  if (!el) return;
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
  if (!el) return;

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

// ── YOUTUBE PODCAST (LATEST VIDEO) ───────────────────────
async function loadLatestYouTubePodcastVideo() {
  const frame = document.getElementById('yt-latest-video');
  if (!frame) return;

  try {
    const res = await fetch(CONFIG.youtubePodcastFeed);
    const data = await res.json();
    const latestItem = data?.items?.[0];
    const latestId = extractYouTubeVideoId(latestItem?.link || latestItem?.guid || '');

    if (!latestId) throw new Error('No latest playlist video found');
    frame.src = `https://www.youtube.com/embed/${latestId}?rel=0&modestbranding=1`;
  } catch (e) {
    // Keep static iframe src fallback from HTML when feed fetch fails.
  }
}

// ── PODCAST CARDS (THUMBNAILS + PLATFORM LINKS) ──────────
async function loadPodcastCards() {
  const el = document.getElementById('episode-cards');
  if (!el) return;

  try {
    const res = await fetch(CONFIG.youtubePodcastFeed);
    const data = await res.json();
    if (!data.items || data.items.length === 0) throw new Error('No episodes');

    el.innerHTML = data.items.slice(0, 3).map((item, idx) => {
      const videoId = extractYouTubeVideoId(item.link || item.guid || '');
      const fallbackMeta = getFallbackEpisodeMeta(item.title);
      const episodeLabel = fallbackMeta?.ep ? `Episode ${fallbackMeta.ep}` : `Latest ${idx + 1}`;
      const duration = fallbackMeta?.duration || 'Duration on platform';
      const appleLink = fallbackMeta?.url || CONFIG.podcastUrl;
      const spotifyLink = CONFIG.spotifyPodcastUrl;
      const youtubeLink = item.link || `https://www.youtube.com/watch?v=${videoId}`;
      const thumbnail = item.thumbnail || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '');
      const question = podcastQuestionLine(item.title, item.description).slice(0, 140);

      return `
        <article class="episode-card">
          <a href="${youtubeLink}" target="_blank" rel="noopener noreferrer">
            <div class="episode-thumb">${thumbnail ? `<img src="${thumbnail}" alt="${escapeHtml(item.title)} thumbnail">` : ''}</div>
          </a>
          <div class="episode-card-body">
            <div class="episode-topline">
              <span class="episode-num">${escapeHtml(episodeLabel)}</span>
              <span class="episode-date">${escapeHtml(fmtDate(item.pubDate))}</span>
            </div>
            <h3 class="episode-card-title">${escapeHtml(item.title)}</h3>
            <p class="episode-question">${escapeHtml(question)}</p>
            <p class="episode-duration">${escapeHtml(duration)}</p>
            <div class="episode-platforms">
              <a href="${appleLink}" target="_blank" rel="noopener noreferrer">Apple</a>
              <a href="${spotifyLink}" target="_blank" rel="noopener noreferrer">Spotify</a>
              <a href="${youtubeLink}" target="_blank" rel="noopener noreferrer">YouTube</a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  } catch (e) {
    el.innerHTML = PODCAST_FALLBACK.slice(0, 3).map((item) => `
      <article class="episode-card">
        <div class="episode-thumb"></div>
        <div class="episode-card-body">
          <div class="episode-topline">
            <span class="episode-num">Episode ${item.ep}</span>
            <span class="episode-date">${item.date}</span>
          </div>
          <h3 class="episode-card-title">${escapeHtml(item.title)}</h3>
          <p class="episode-question">${escapeHtml(podcastQuestionLine(item.title, ''))}</p>
          <p class="episode-duration">${escapeHtml(item.duration)}</p>
          <div class="episode-platforms">
            <a href="${item.url}" target="_blank" rel="noopener noreferrer">Apple</a>
            <a href="${CONFIG.spotifyPodcastUrl}" target="_blank" rel="noopener noreferrer">Spotify</a>
            <a href="https://www.youtube.com/playlist?list=${CONFIG.youtubePodcastPlaylistId}" target="_blank" rel="noopener noreferrer">YouTube</a>
          </div>
        </div>
      </article>
    `).join('');
  }
}

// ── SCROLL REVEAL ──────────────────────────────────────────
function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-left, .reveal-scale, .stagger-children').forEach((el) => {
    observer.observe(el);
  });
}

// ── ACTIVE NAV LINK ───────────────────────────────────────
function initActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
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

// ── HERO WORD ANIMATION ───────────────────────────────────
function initHeroWordAnimation() {
  const pastWord = document.querySelector('.hero-word-past');
  const futureWord = document.querySelector('.hero-word-future');
  if (!pastWord || !futureWord) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const typeStep = 0.34;
  const letterDuration = 1.36;
  const startDelay = 0.2;
  const gapBetweenWords = 1.36;

  const prepareWord = (wordEl, delayStart) => {
    const text = wordEl.textContent.trim();
    const chars = Array.from(text);
    wordEl.textContent = '';

    chars.forEach((char, index) => {
      const letter = document.createElement('span');
      letter.className = 'hero-letter';
      letter.textContent = char === ' ' ? '\u00A0' : char;
      letter.style.setProperty('--letter-delay', `${delayStart + index * typeStep}s`);
      wordEl.appendChild(letter);
    });

    wordEl.classList.add('is-typing');
    return chars.length;
  };

  requestAnimationFrame(() => {
    const pastCount = prepareWord(pastWord, startDelay);
    const pastDuration = (Math.max(0, pastCount - 1) * typeStep) + letterDuration;
    const futureStart = startDelay + pastDuration + gapBetweenWords;
    prepareWord(futureWord, futureStart);
  });
}

// ── HERO WORD HOVER FLIP ──────────────────────────────────
function initHeroHoverFlip() {
  const words = document.querySelectorAll('.hero-word-past, .hero-word-future');
  if (!words.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  words.forEach((word) => {
    word.addEventListener('mouseenter', () => {
      word.classList.remove('is-flip');
      // Force reflow so rapid re-hover retriggers the animation.
      void word.offsetWidth;
      word.classList.add('is-flip');
    });

    word.addEventListener('animationend', (event) => {
      if (event.animationName === 'heroWordFlip') {
        word.classList.remove('is-flip');
      }
    });
  });
}

// ── HERO KEYWORD ROTATOR ──────────────────────────────────
const HERO_KEYWORDS = [
  'Energy equity',
  'Energy transition',
  'Fairness',
  'AI revolution',
  'Flexibility markets',
  'Energy inclusion',
  'Institutions',
  'Policy design',
  'Community energy',
  'Research',
  'Writing',
  'Podcast'
];

function initHeroKeywordCloud() {
  const cloud = document.getElementById('hero-keyword-cloud');
  const currentEl = document.getElementById('hero-keyword-current');
  if (!cloud || !currentEl) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!HERO_KEYWORDS.length) return;

  let currentIndex = Math.floor(Math.random() * HERO_KEYWORDS.length);
  let lastAdvanceAt = 0;

  const syncKeywordState = (nextIndex, animate) => {
    const keyword = HERO_KEYWORDS[nextIndex];
    currentEl.textContent = keyword;

    if (animate && !prefersReducedMotion) {
      currentEl.classList.remove('is-swapping');
      void currentEl.offsetWidth;
      currentEl.classList.add('is-swapping');
    }
  };

  const getNextIndex = () => {
    if (HERO_KEYWORDS.length === 1) return 0;
    let next = currentIndex;
    while (next === currentIndex) {
      next = Math.floor(Math.random() * HERO_KEYWORDS.length);
    }
    return next;
  };

  const advanceKeyword = () => {
    const now = performance.now();
    if (now - lastAdvanceAt < 350) return;
    lastAdvanceAt = now;
    currentIndex = getNextIndex();
    syncKeywordState(currentIndex, true);
  };

  syncKeywordState(currentIndex, false);

  const intervalId = window.setInterval(advanceKeyword, 5000);
  cloud.addEventListener('mouseenter', advanceKeyword);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    // Refresh once when returning to tab.
    advanceKeyword();
  });

  window.addEventListener('beforeunload', () => {
    window.clearInterval(intervalId);
  });
}

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadSubstack();
  loadPodcast();
  loadPodcastCards();
  loadLatestYouTubePodcastVideo();
  initScrollReveal();
  initSubscribe();
  initContactEmailLink();
  initActiveNav();
  initMobileNav();
  initHeroWordAnimation();
  initHeroHoverFlip();
  initHeroKeywordCloud();
});
