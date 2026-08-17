/* Federico Gambedotti — shared site interactions */

const SITE = {
  substackUrl: 'https://fedegam.substack.com',
  youtubePlaylistId: 'PLGDbPqtiz-CSSgtcHHPJMgL1gUYAML-Fp',
  podcastData: 'data/podcast.json',
  youtubeFeedProxy: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?playlist_id=PLGDbPqtiz-CSSgtcHHPJMgL1gUYAML-Fp',
  orbitPortfolioUrl: 'https://orbit-project-tracker.federicogam.chatgpt.site/api/public-portfolio',
  orbitWaitlistUrl: 'https://orbit-project-tracker.federicogam.chatgpt.site/api/public-waitlist',
};

const EPISODE_FALLBACK = [
  {
    title: 'We can now re-write DNA - but should we?',
    pubDate: '2026-07-22T16:05:08+00:00',
    link: 'https://www.youtube.com/watch?v=k9zVT118tqk',
    thumbnail: 'https://i.ytimg.com/vi/k9zVT118tqk/hqdefault.jpg',
  },
  {
    title: 'Socialism vs. Capitalism in the Age of AI',
    pubDate: '2026-07-11T10:02:29+00:00',
    link: 'https://www.youtube.com/watch?v=nZ54fWnjLBo',
    thumbnail: 'https://i.ytimg.com/vi/nZ54fWnjLBo/hqdefault.jpg',
  },
  {
    title: 'The UK Social Media Ban: ban the feed or fix the feed',
    pubDate: '2026-07-02T16:32:18+00:00',
    link: 'https://www.youtube.com/watch?v=5ZGwRj9pbCE',
    thumbnail: 'https://i.ytimg.com/vi/5ZGwRj9pbCE/hqdefault.jpg',
  },
  {
    title: 'Real Science That Sounds Like Sci-Fi: Fly Brains and Organoid Computers',
    pubDate: '2026-05-26T12:59:09+00:00',
    link: 'https://www.youtube.com/watch?v=xiQ7OVlptos',
    thumbnail: 'https://i.ytimg.com/vi/xiQ7OVlptos/hqdefault.jpg',
  },
  {
    title: 'The Future of Energy: fossil fuels vs nuclear vs renewable power',
    pubDate: '2026-05-13T13:30:10+00:00',
    link: 'https://www.youtube.com/watch?v=6Of0ZA77T_0',
    thumbnail: 'https://i.ytimg.com/vi/6Of0ZA77T_0/hqdefault.jpg',
  },
];

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getYouTubeId(value) {
  if (!value) return '';
  try {
    const url = new URL(value);
    if (url.hostname.includes('youtu.be')) return url.pathname.slice(1);
    return url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).pop() || '';
  } catch {
    return '';
  }
}

function initTheme() {
  const buttons = document.querySelectorAll('.theme-toggle');
  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('fg-theme', theme);
    const isDark = theme === 'dark';
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(isDark));
      button.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = isDark ? '#173f31' : '#f4efe5';
  };

  applyTheme(document.documentElement.dataset.theme || 'dark');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  });
}

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  const close = () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}

function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .stagger-children');
  if (!targets.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((target) => target.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px' });

  targets.forEach((target) => observer.observe(target));
}

function initSubscribe() {
  document.querySelectorAll('.subscribe-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const message = form.querySelector('.sub-message');
      const email = input?.value.trim() || '';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (message) message.textContent = 'Please enter a valid email address.';
        input?.focus();
        return;
      }
      window.open(`${SITE.substackUrl}/subscribe?email=${encodeURIComponent(email)}`, '_blank', 'noopener');
      if (message) message.textContent = 'Substack opened in a new tab to confirm your subscription.';
    });
  });
}

const CONTACT_TOPICS = {
  research: {
    label: 'Research collaboration',
    title: 'Compare notes on a shared question.',
    copy: 'If you work on community energy, energy equity, flexibility, or demand reduction, I would be glad to hear what you are exploring.',
    subject: 'Research collaboration',
    action: 'Email about research',
  },
  venture: {
    label: 'Power Haven or investment',
    title: 'Explore whether we should build together.',
    copy: 'I am speaking with energy operators, investors, technical collaborators, and potential partners interested in Power Haven.',
    subject: 'Power Haven conversation',
    action: 'Email about Power Haven',
  },
  podcast: {
    label: 'Podcast or speaking',
    title: 'Bring a difficult question to the table.',
    copy: 'For podcast ideas, guest suggestions, panels, or speaking invitations, send the topic, audience, and intended format.',
    subject: 'Podcast or speaking invitation',
    action: 'Send an invitation',
  },
  introduction: {
    label: 'General introduction',
    title: 'Start with a short conversation.',
    copy: 'If none of the other routes quite fits, tell me what you are working on and why you think we should know one another.',
    subject: 'Introduction',
    action: 'Introduce yourself',
  },
};

function initContactChooser() {
  const chooser = document.querySelector('.contact-chooser');
  if (!chooser) return;
  const options = [...chooser.querySelectorAll('[data-contact-topic]')];
  const detail = chooser.querySelector('.contact-detail');
  if (!options.length || !detail) return;

  const render = (topic) => {
    const content = CONTACT_TOPICS[topic];
    if (!content) return;
    options.forEach((option) => {
      const selected = option.dataset.contactTopic === topic;
      option.classList.toggle('active', selected);
      option.setAttribute('aria-selected', String(selected));
      option.setAttribute('tabindex', selected ? '0' : '-1');
    });
    const selectedOption = options.find((option) => option.dataset.contactTopic === topic);
    if (selectedOption?.id) detail.setAttribute('aria-labelledby', selectedOption.id);
    const subject = encodeURIComponent(content.subject);
    detail.innerHTML = `
      <span class="contact-detail-label">${content.label}</span>
      <h3>${content.title}</h3>
      <p>${content.copy}</p>
      <div class="contact-actions">
        <a class="primary-link" href="mailto:federico.gambedotti.23@ucl.ac.uk?subject=${subject}">${content.action} <i class="ph ph-envelope-simple" aria-hidden="true"></i></a>
        <a class="secondary-link" href="https://calendly.com/ucbvfg0-ucl/30min" target="_blank" rel="noopener noreferrer">Schedule a 20 min call <i class="ph ph-calendar-check" aria-hidden="true"></i></a>
      </div>`;
  };

  options.forEach((option, index) => {
    option.addEventListener('click', () => render(option.dataset.contactTopic));
    option.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
      const next = event.key === 'Home'
        ? options[0]
        : event.key === 'End'
          ? options[options.length - 1]
          : options[(index + direction + options.length) % options.length];
      next.focus();
      render(next.dataset.contactTopic);
    });
  });
}

function episodeCard(item) {
  const videoId = getYouTubeId(item.link || item.guid);
  const link = item.link || item.url || `https://www.youtube.com/playlist?list=${SITE.youtubePlaylistId}`;
  const image = item.thumbnail || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '');
  const title = escapeHtml(item.title);
  const date = escapeHtml(item.date || formatDate(item.pubDate));

  return `
    <a class="episode-card" href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">
      <div class="episode-thumb">
        ${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy">` : ''}
        <span class="episode-play"><i class="ph ph-play" aria-hidden="true"></i></span>
      </div>
      <div class="episode-copy">
        <h3 class="episode-title">${title}</h3>
        <span class="episode-date">${date}</span>
      </div>
    </a>
  `;
}

async function loadPodcastCards() {
  const container = document.getElementById('podcast-cards');
  if (!container) return;
  const limit = Number(container.dataset.limit || 5);

  const loadItems = async (url) => {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('Podcast feed unavailable');
    const data = await response.json();
    if (!Array.isArray(data.items) || !data.items.length) throw new Error('No episodes');
    return data.items;
  };

  try {
    const items = await loadItems(SITE.podcastData);
    container.innerHTML = items.slice(0, limit).map(episodeCard).join('');
    return;
  } catch {
    // File previews cannot always fetch local JSON, so retain a network fallback.
  }

  try {
    const items = await loadItems(SITE.youtubeFeedProxy);
    container.innerHTML = items.slice(0, limit).map(episodeCard).join('');
  } catch {
    container.innerHTML = EPISODE_FALLBACK.slice(0, limit).map(episodeCard).join('');
  }
}

const PORTFOLIO_STATUSES = ['live', 'beta', 'exploring'];

function safeHttpUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : '';
  } catch {
    return '';
  }
}

function validPortfolioPayload(payload) {
  if (!payload || payload.version !== 1 || !Array.isArray(payload.projects)) return null;
  const seen = new Set();
  const projects = [];
  for (const item of payload.projects) {
    if (!item || typeof item !== 'object') return null;
    const slug = typeof item.slug === 'string' ? item.slug.trim() : '';
    const name = typeof item.name === 'string' ? item.name.trim() : '';
    const description = typeof item.description === 'string' ? item.description.trim() : '';
    const status = item.status;
    const order = Number(item.order);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || seen.has(slug) || !name || !description || !PORTFOLIO_STATUSES.includes(status) || !Number.isFinite(order) || typeof item.waitlistEnabled !== 'boolean') return null;
    const productUrl = item.productUrl ? safeHttpUrl(item.productUrl) : '';
    if (item.productUrl && !productUrl) return null;
    let cta = null;
    if (item.cta != null) {
      if (!item.cta || typeof item.cta.label !== 'string' || !item.cta.label.trim() || !safeHttpUrl(item.cta.url)) return null;
      cta = { label: item.cta.label.trim(), url: safeHttpUrl(item.cta.url) };
    }
    seen.add(slug);
    projects.push({ slug, name, description, status, order, waitlistEnabled: item.waitlistEnabled, productUrl, cta });
  }
  return projects;
}

function waitlistForm(project) {
  const id = `waitlist-${project.slug}`;
  return `
    <form class="waitlist-form" data-product-slug="${escapeHtml(project.slug)}" novalidate>
      <label for="${id}">Email address</label>
      <div class="waitlist-fields">
        <input id="${id}" name="email" type="email" autocomplete="email" placeholder="you@example.com" required>
        <input class="waitlist-honeypot" name="company" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button type="submit" disabled>Join waitlist</button>
      </div>
      <p class="waitlist-message" role="status" aria-live="polite"></p>
    </form>`;
}

function portfolioCard(project) {
  const action = project.status === 'beta' && project.waitlistEnabled
    ? waitlistForm(project)
    : project.cta
      ? `<a class="product-action" href="${escapeHtml(project.cta.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(project.cta.label)} <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>`
      : '';
  return `<article class="product-card"><div><span class="product-status ${project.status}">${escapeHtml(project.status)}</span><h4>${escapeHtml(project.name)}</h4><p>${escapeHtml(project.description)}</p></div>${action}</article>`;
}

function renderPortfolio(container, projects) {
  const groupCopy = {
    live: ['Live', 'Available now'],
    beta: ['Beta', 'Join the first testers'],
    exploring: ['Exploring', 'Early ideas'],
  };
  container.innerHTML = PORTFOLIO_STATUSES.map((status) => {
    const items = projects.filter((project) => project.status === status).sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
    if (!items.length) return '';
    const headingId = `products-${status}`;
    return `<section class="product-status-group" aria-labelledby="${headingId}"><div class="product-status-heading"><h3 id="${headingId}">${groupCopy[status][0]}</h3><span>${groupCopy[status][1]}</span></div><div class="product-list">${items.map(portfolioCard).join('')}</div></section>`;
  }).join('');
  initWaitlistForms(container);
}

async function fetchJsonWithTimeout(url, timeoutMs = 3500) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { cache: 'no-store', signal: controller.signal });
    if (!response.ok) throw new Error('Request failed');
    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

async function loadPublicPortfolio() {
  const container = document.getElementById('product-portfolio');
  if (!container) return;
  const endpoint = container.dataset.endpoint || SITE.orbitPortfolioUrl;
  const fallback = container.dataset.fallback || 'data/public-portfolio-fallback.json';
  for (const source of [endpoint, fallback]) {
    try {
      const projects = validPortfolioPayload(await fetchJsonWithTimeout(source));
      if (!projects || !projects.length) continue;
      renderPortfolio(container, projects);
      return;
    } catch {
      // The checked-in HTML remains the final no-network fallback.
    }
  }
  initWaitlistForms(container);
}

function initWaitlistForms(root = document) {
  root.querySelectorAll('.waitlist-form:not([data-ready])').forEach((form) => {
    form.dataset.ready = 'true';
    const email = form.querySelector('input[name="email"]');
    const company = form.querySelector('input[name="company"]');
    const button = form.querySelector('button[type="submit"]');
    const message = form.querySelector('.waitlist-message');
    const update = () => { button.disabled = !email.validity.valid || !email.value.trim(); };
    email.addEventListener('input', update);
    update();
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!email.validity.valid || !email.value.trim()) {
        message.textContent = 'Please enter a valid email address.';
        email.focus();
        return;
      }
      button.disabled = true;
      button.textContent = 'Joining…';
      message.className = 'waitlist-message';
      message.textContent = '';
      try {
        const response = await fetch(SITE.orbitWaitlistUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productSlug: form.dataset.productSlug, email: email.value, referralSource: 'building-page', company: company.value }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.ok) throw new Error('Waitlist unavailable');
        message.classList.add('success');
        message.textContent = data.message || "You're on the waitlist.";
        email.disabled = true;
        button.textContent = 'Joined';
      } catch {
        message.classList.add('error');
        message.textContent = 'The waitlist is temporarily unavailable. Please try again later.';
        button.textContent = 'Join waitlist';
        update();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initScrollReveal();
  initSubscribe();
  initContactChooser();
  loadPodcastCards();
  loadPublicPortfolio();
});
