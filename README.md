# Federico Gambedotti - Personal Website

Static personal website for Federico Gambedotti, published through GitHub Pages at [fgambedotti.github.io](https://fgambedotti.github.io).

The site is intentionally framework-free: HTML, CSS, and vanilla JavaScript only.

## Pages

- `index.html`: concise homepage and audience routes
- `research.html`: PhD focus, research questions, status, and contact
- `building.html`: Power Haven plus the public live and beta product portfolio
- `writing.html`: favourite essays and Substack subscription
- `podcast.html`: latest 2Humans episodes and listening platforms
- `about.html`: profile, current focus, and intent-based contact options

## Local preview

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`.

## Routine maintenance

Synchronize the shared navigation and footer after editing either partial:

```bash
node scripts/sync-shared.mjs
```

Refresh the locally stored YouTube playlist data:

```bash
node scripts/update-podcast-feed.mjs
```

Check page metadata, duplicate IDs, shared components, and local links:

```bash
node scripts/validate-site.mjs
```

The `Update podcast feed` GitHub Action runs daily and commits `data/podcast.json` only when the playlist changes. The browser loads this local file first, then uses a network feed and a hardcoded list as fallbacks.

### Building portfolio

Orbit is the editorial source of truth for the Building page. The browser requests `https://orbit-project-tracker.federicogam.chatgpt.site/api/public-portfolio`, validates the public payload, and renders only approved presentation fields. If that request fails, times out, or is invalid, it loads `data/public-portfolio-fallback.json`; the checked-in Building HTML is a final no-network fallback.

After changing which projects are shown from Orbit, export the sanitised portfolio JSON and replace `data/public-portfolio-fallback.json` in the same pull request. Refresh the fallback whenever a product name, status, outcome, verified URL, CTA, or waitlist state changes. Never copy Orbit's internal project response into this repository.

## Content principles

- Keep the homepage concise and route visitors to the relevant page.
- Label early-stage work honestly.
- Do not claim research outputs, product milestones, or partnerships until they are public.
- Update the `Now` date on `about.html` when its content changes.

## Deployment

GitHub Pages deploys the repository root from `main`. Pushing to `main` updates the public site after GitHub Pages finishes its build.
