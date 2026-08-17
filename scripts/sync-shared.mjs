import { readFile, writeFile } from 'node:fs/promises';

const pages = {
  'research.html': 'research',
  'building.html': 'building',
  'writing.html': 'writing',
  'podcast.html': 'podcast',
  'about.html': 'about',
};

const navTemplate = await readFile('partials/site-nav.html', 'utf8');
const footer = (await readFile('partials/site-footer.html', 'utf8')).trim();

function renderNav(activePage) {
  return navTemplate.trim().replace(/{{ACTIVE_([A-Z]+)}}/g, (_, page) => (
    page.toLowerCase() === activePage ? ' class="active"' : ''
  ));
}

function replaceBlock(html, name, fallbackPattern, replacement) {
  const markedPattern = new RegExp(`<!-- ${name}:START -->[\\s\\S]*?<!-- ${name}:END -->`);
  if (markedPattern.test(html)) return html.replace(markedPattern, replacement);
  if (fallbackPattern.test(html)) return html.replace(fallbackPattern, replacement);
  throw new Error(`Could not find ${name} block`);
}

for (const [file, activePage] of Object.entries(pages)) {
  let html = await readFile(file, 'utf8');
  html = replaceBlock(html, 'SITE-NAV', /<nav class="site-nav"[\s\S]*?<\/nav>/, renderNav(activePage));
  html = replaceBlock(html, 'SITE-FOOTER', /<footer class="site-footer"[\s\S]*?<\/footer>/, footer);
  await writeFile(file, html);
}

console.log(`Synchronized navigation and footer across ${Object.keys(pages).length} pages.`);
