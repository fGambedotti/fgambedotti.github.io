import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const [html, script, fallbackText] = await Promise.all([
  readFile('building.html', 'utf8'),
  readFile('script.js', 'utf8'),
  readFile('data/public-portfolio-fallback.json', 'utf8'),
]);

const context = {
  URL,
  AbortController,
  Headers,
  fetch: async () => { throw new Error('offline'); },
  localStorage: { getItem: () => null, setItem: () => {} },
  matchMedia: () => ({ matches: false }),
  document: { addEventListener: () => {}, querySelectorAll: () => [] },
  window: { setTimeout, clearTimeout, matchMedia: () => ({ matches: false }) },
};
vm.createContext(context);
vm.runInContext(`${script}\nthis.__portfolio = { validPortfolioPayload, renderPortfolio };`, context);

test('Building metadata points to the Building page', () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/fgambedotti\.github\.io\/building\.html">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/fgambedotti\.github\.io\/building\.html">/);
  assert.match(html, /<meta name="twitter:title" content="Building — Federico Gambedotti">/);
});

test('checked-in portfolio is valid and grouped without an empty Exploring section', () => {
  const projects = context.__portfolio.validPortfolioPayload(JSON.parse(fallbackText));
  assert.equal(projects.length, 4);
  assert.deepEqual(Array.from(projects, (project) => project.status), ['live', 'live', 'beta', 'beta']);
  const container = { innerHTML: '', querySelectorAll: () => [] };
  context.__portfolio.renderPortfolio(container, projects);
  assert.match(container.innerHTML, />Live</);
  assert.match(container.innerHTML, />Beta</);
  assert.doesNotMatch(container.innerHTML, />Exploring</);
  const signalLedger = projects.find((project) => project.slug === 'signal-ledger');
  assert.match(signalLedger.description, /stock-news briefing/i);
  assert.doesNotMatch(signalLedger.description, /crypto|Bitcoin|Ethereum|Solana/i);
});

test('invalid public data is rejected instead of rendered', () => {
  const invalid = JSON.parse(fallbackText);
  invalid.projects[0].status = 'internal';
  invalid.projects[1].productUrl = 'javascript:alert(1)';
  assert.equal(context.__portfolio.validPortfolioPayload(invalid), null);
});

test('waitlists begin disabled and fabricated voting is gone', () => {
  assert.match(html, /<button type="submit" disabled>Join waitlist<\/button>/);
  assert.doesNotMatch(html + script, /data-goal|votes_|castVote|vote-count/);
});
