import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';

const pages = ['index.html', 'research.html', 'building.html', 'writing.html', 'podcast.html', 'about.html'];
const errors = [];

for (const page of pages) {
  const html = await readFile(page, 'utf8');
  for (const pattern of [/<title>.+<\/title>/, /<meta name="description"/, /<link rel="canonical"/, /<meta property="og:title"/, /<main[^>]+id="main-content"/]) {
    if (!pattern.test(html)) errors.push(`${page}: missing ${pattern}`);
  }

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) errors.push(`${page}: duplicate IDs ${[...new Set(duplicates)].join(', ')}`);

  const localRefs = [...html.matchAll(/(?:href|src)="([^"#]+)"/g)]
    .map((match) => match[1])
    .filter((value) => !/^(?:https?:|mailto:|data:)/.test(value));
  for (const ref of localRefs) {
    try {
      await access(ref.split('?')[0], constants.F_OK);
    } catch {
      errors.push(`${page}: missing local reference ${ref}`);
    }
  }
}

for (const page of pages.filter((page) => page !== 'index.html')) {
  const html = await readFile(page, 'utf8');
  if (!html.includes('<!-- SITE-NAV:START -->')) errors.push(`${page}: shared navigation is not synchronized`);
  if (!html.includes('<!-- SITE-FOOTER:START -->')) errors.push(`${page}: shared footer is not synchronized`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Validated ${pages.length} pages with no structural errors.`);
}
