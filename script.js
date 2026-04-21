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

const DAILY_QUOTES = [
  { text: 'The reasonable man adapts himself to the world; the unreasonable one persists in trying to adapt the world to himself. Therefore all progress depends on the unreasonable man.', author: 'George Bernard Shaw' },
  { text: 'You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete.', author: 'Buckminster Fuller' },
  { text: "The most common way people give up their power is by thinking they don't have any.", author: 'Alice Walker' },
  { text: 'An institution is the lengthened shadow of one or a few individuals.', author: 'Ralph Waldo Emerson' },
  { text: 'The significant problems we face cannot be solved at the same level of thinking we were at when we created them.', author: 'Albert Einstein' },
  { text: 'Power concedes nothing without a demand. It never did and it never will.', author: 'Frederick Douglass' },
  { text: 'Every system is perfectly designed to get the results it gets.', author: 'W. Edwards Deming' },
  { text: 'The measure of intelligence is the ability to change.', author: 'Albert Einstein' },
  { text: 'Those who make peaceful revolution impossible will make violent revolution inevitable.', author: 'John F. Kennedy' },
  { text: 'A society grows great when old men plant trees whose shade they know they shall never sit in.', author: 'Greek proverb' },
  { text: 'The goal of life is not to be on the side of the majority, but to escape finding oneself in the ranks of the insane.', author: 'Marcus Aurelius' },
  { text: 'We cannot solve our problems with the same thinking we used when we created them.', author: 'Albert Einstein' },
  { text: 'Energy is the only universal currency: one of its many forms must be transformed to get anything done.', author: 'Vaclav Smil' },
  { text: "The future is already here - it's just not evenly distributed.", author: 'William Gibson' },
  { text: 'Injustice anywhere is a threat to justice everywhere.', author: 'Martin Luther King Jr.' },
  { text: 'The art of progress is to preserve order amid change and to preserve change amid order.', author: 'Alfred North Whitehead' },
  { text: 'Real generosity toward the future lies in giving all to the present.', author: 'Albert Camus' },
  { text: 'The world will not be destroyed by those who do evil, but by those who watch them without doing anything.', author: 'Albert Einstein' },
  { text: "To do evil a human being must first of all believe that what he's doing is good.", author: 'Aleksandr Solzhenitsyn' },
  { text: 'The test of a first-rate intelligence is the ability to hold two opposed ideas in mind at the same time and still retain the ability to function.', author: 'F. Scott Fitzgerald' },
  { text: 'It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change.', author: 'Charles Darwin' },
  { text: "The greatest danger in times of turbulence is not the turbulence - it is to act with yesterday's logic.", author: 'Peter Drucker' },
  { text: 'Poverty is not an accident. Like slavery and apartheid, it is man-made and can be removed by the actions of human beings.', author: 'Nelson Mandela' },
  { text: 'Any sufficiently advanced technology is indistinguishable from magic.', author: 'Arthur C. Clarke' },
  { text: 'The machine does not isolate man from the great problems of nature but plunges him more deeply into them.', author: 'Antoine de Saint-Exupery' },
  { text: 'We shape our tools, and thereafter our tools shape us.', author: 'Marshall McLuhan' },
  { text: 'The price of anything is the amount of life you exchange for it.', author: 'Henry David Thoreau' },
  { text: 'First they ignore you, then they laugh at you, then they fight you, then you win.', author: 'Mahatma Gandhi' },
  { text: 'The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.', author: 'Albert Camus' },
  { text: 'In a time of universal deceit, telling the truth is a revolutionary act.', author: 'George Orwell' },
  { text: 'The obstacle is the path.', author: 'Zen proverb' },
  { text: 'He who has a why to live can bear almost any how.', author: 'Friedrich Nietzsche' },
  { text: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'If you want to go fast, go alone. If you want to go far, go together.', author: 'African proverb' },
  { text: 'Climate change is not an environmental issue. It is a civilisational issue.', author: 'Christiana Figueres' },
  { text: 'The commons is not a resource. It is a practice.', author: 'David Bollier' },
  { text: 'There is no such thing as a free market. There are only markets with rules written by someone.', author: 'Robert Reich' },
  { text: 'We do not inherit the earth from our ancestors; we borrow it from our children.', author: 'Native American proverb' },
  { text: 'The trouble with the world is that the stupid are cocksure and the intelligent are full of doubt.', author: 'Bertrand Russell' },
  { text: 'A small group of thoughtful, committed citizens can change the world; indeed, it is the only thing that ever has.', author: 'Margaret Mead' },
  { text: 'The most powerful force in the universe is compound interest.', author: 'Albert Einstein' },
  { text: 'Not everything that counts can be counted, and not everything that can be counted counts.', author: 'William Bruce Cameron' },
  { text: 'Democracy is the worst form of government, except for all the others.', author: 'Winston Churchill' },
  { text: 'The purpose of a system is what it does.', author: 'Stafford Beer' },
  { text: 'There are no solutions. There are only trade-offs.', author: 'Thomas Sowell' },
  { text: 'Knowledge is not power. The application of knowledge is power.', author: 'Dale Carnegie' },
  { text: 'The good we secure for ourselves is precarious and uncertain until it is secured for all of us.', author: 'Jane Addams' },
  { text: 'In every walk with nature, one receives far more than he seeks.', author: 'John Muir' },
  { text: 'The systems that run our world were designed. They can be redesigned.', author: 'Federico Gambedotti' },
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

// ── QUOTE OF THE DAY ─────────────────────────────────────
function initQuoteOfDay() {
  const textEl = document.getElementById('daily-quote-text');
  const authorEl = document.getElementById('daily-quote-author');
  if (!textEl || !authorEl || DAILY_QUOTES.length === 0) return;

  const now = new Date();
  const seed = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = ((hash << 5) - hash) + seed.charCodeAt(i);
  const index = Math.abs(hash) % DAILY_QUOTES.length;
  const quote = DAILY_QUOTES[index];

  textEl.textContent = `"${quote.text}"`;
  authorEl.textContent = `— ${quote.author}`;
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
  loadPodcastCards();
  loadLatestYouTubePodcastVideo();
  initQuoteOfDay();
  initSubscribe();
  initContactEmailLink();
  initMobileNav();
});
