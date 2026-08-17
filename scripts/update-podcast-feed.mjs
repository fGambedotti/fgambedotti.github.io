import { mkdir, writeFile } from 'node:fs/promises';

const playlistId = 'PLGDbPqtiz-CSSgtcHHPJMgL1gUYAML-Fp';
const feedUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;

function decodeXml(value = '') {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

function match(entry, pattern) {
  return decodeXml(entry.match(pattern)?.[1]?.trim() || '');
}

const response = await fetch(feedUrl);
if (!response.ok) throw new Error(`YouTube returned ${response.status}`);
const xml = await response.text();
const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((result) => result[1]);

const items = entries.map((entry) => {
  const videoId = match(entry, /<yt:videoId>([\s\S]*?)<\/yt:videoId>/);
  return {
    title: match(entry, /<title>([\s\S]*?)<\/title>/),
    pubDate: match(entry, /<published>([\s\S]*?)<\/published>/),
    link: `https://www.youtube.com/watch?v=${videoId}`,
    thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  };
}).filter((item) => item.title && item.link);

if (!items.length) throw new Error('No podcast episodes were found in the YouTube feed.');

await mkdir('data', { recursive: true });
await writeFile('data/podcast.json', `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  source: feedUrl,
  items,
}, null, 2)}\n`);

console.log(`Saved ${items.length} podcast episodes to data/podcast.json.`);
