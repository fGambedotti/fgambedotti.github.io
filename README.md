# Federico Gambedotti — Personal Website

> "The systems that run our world were designed. They can be redesigned."

Personal site for Federico Gambedotti — researcher, writer, builder, and podcast host.

## Live site

[fgambedotti.github.io](https://fgambedotti.github.io)

---

## Deploy in 5 minutes

### 1. Create the GitHub repo

Go to [github.com/new](https://github.com/new) and create a repo named exactly:

```
fgambedotti.github.io
```

### 2. Clone and push

```bash
git clone https://github.com/fGambedotti/fgambedotti.github.io.git
cd fgambedotti.github.io
# Copy the site files into this folder, then:
git add .
git commit -m "Launch site"
git push origin main
```

### 3. Enable GitHub Pages

- Go to your repo → **Settings** → **Pages**
- Source: **Deploy from a branch**
- Branch: `main` / `root`
- Click **Save**

Your site will be live at `https://fgambedotti.github.io` in ~60 seconds.

---

## Update your podcast RSS feed

Once you have your podcast RSS URL (from Riverside, Transistor, Buzzsprout, etc.), open `script.js` and update line 14:

```js
podcastFeeds: [
  'https://api.rss2json.com/v1/api.json?rss_url=YOUR_PODCAST_RSS_URL_HERE&count=3',
],
```

---

## Update YouTube embed

Once your YouTube channel has a playlist ID, open `index.html` and find the YouTube iframe. Replace the `src` with:

```
https://www.youtube.com/embed/videoseries?list=YOUR_PLAYLIST_ID&rel=0&modestbranding=1
```

---

## File structure

```
fgambedotti.github.io/
├── index.html   — full page structure
├── style.css    — all styling
├── script.js    — live RSS feeds + interactions
└── README.md    — this file
```

---

## Adding a custom domain later

1. Buy a domain (e.g. `federicogambedotti.com`)
2. In GitHub Pages settings, add it under **Custom domain**
3. Point your domain's DNS to GitHub Pages (instructions provided by GitHub)

---

Built with HTML, CSS, and vanilla JS. No frameworks, no build tools. Fast by default.
