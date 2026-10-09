// Reads the Buttondown RSS feed at build time.

const RSS_URL = 'https://buttondown.com/futurefullstories/rss';

export type NewsItem = { title: string; link: string; date: Date };

const decode = (s: string) =>
  s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .trim();

const tag = (block: string, name: string) => block.match(new RegExp(`<${name}>(.*?)</${name}>`, 's'))?.[1] ?? '';

export async function getNews(limit = 3): Promise<NewsItem[]> {
  let xml: string;
  try {
    const res = await fetch(RSS_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    xml = await res.text();
  } catch (err) {
    console.warn('[newsletter] fetch failed, rendering with no news:', err);
    return [];
  }

  return xml
    .split('<item>')
    .slice(1, limit + 1)
    .map((item) => ({
      // Strip leading emoji from titles
      title: decode(tag(item, 'title')).replace(/^[^\p{L}\p{N}\[]+/u, ''),
      link: decode(tag(item, 'link')),
      date: new Date(decode(tag(item, 'pubDate'))),
    }));
}
