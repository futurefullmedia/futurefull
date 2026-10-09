// Reads the public "Futurefull Public" Google Calendar at build time.
// Convention: location = venue (IRL) or platform/link (URL); the event's URL field = RSVP/watch link.

const ICS_URL =
  'https://calendar.google.com/calendar/ical/c_9d63b2492883784bf5876fcf42579d329451daa53a06314fabb8a7e1f59031d1%40group.calendar.google.com/public/basic.ics';

export type CalEvent = {
  title: string;
  start: Date;
  end: Date;
  venue: string;
  kind: 'irl' | 'url';
  url: string;
  blurb: string;
};

const unescapeText = (v: string) =>
  v.replace(/\\n/gi, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\');

// 20261026T220000Z or 20261026 (all-day) -> Date
const parseDate = (v: string) => {
  const m = v.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2}))?/);
  if (!m) return new Date(NaN);
  const [, y, mo, d, h = '12', mi = '00', s = '00'] = m;
  return new Date(`${y}-${mo}-${d}T${h}:${mi}:${s}Z`);
};

// Empty, a link, or a platform name = URL; anything else (a venue or address) = IRL.
const isURL = (loc: string) => !loc || /^https?:|online|virtual|zoom|twitch|youtube|discord|stream/i.test(loc);

export async function getEvents(): Promise<CalEvent[]> {
  let raw: string;
  try {
    const res = await fetch(ICS_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    raw = await res.text();
  } catch (err) {
    console.warn('[calendar] fetch failed, rendering with no events:', err);
    return [];
  }

  const unfolded = raw.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '');
  const now = new Date();
  const events: CalEvent[] = [];

  for (const block of unfolded.split('BEGIN:VEVENT').slice(1)) {
    const f: Record<string, string> = {};
    for (const line of block.split('\n')) {
      const m = line.match(/^([A-Z-]+)(?:;[^:]*)?:(.*)$/);
      if (m && ['SUMMARY', 'DTSTART', 'DTEND', 'LOCATION', 'URL', 'DESCRIPTION'].includes(m[1])) f[m[1]] = unescapeText(m[2]);
    }
    if (!f.DTSTART) continue;
    const start = parseDate(f.DTSTART);
    const end = f.DTEND ? parseDate(f.DTEND) : start;
    if (end < now) continue;

    const description = f.DESCRIPTION ?? '';
    const location = f.LOCATION ?? '';
    events.push({
      title: (f.SUMMARY ?? '').replace(/^\[\w+\]\s*/, ''),
      start,
      end,
      venue: location.split('\n')[0],
      kind: isURL(location) ? 'url' : 'irl',
      url: f.URL || description.match(/https?:\/\/\S+/)?.[0] || '',
      blurb: description.replace(/<[^>]*>/g, ' ').replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim(),
    });
  }

  return events.sort((a, b) => a.start.getTime() - b.start.getTime());
}

const tz = 'America/New_York';
export const fmt = {
  month: (d: Date) => d.toLocaleString('en-US', { month: 'short', timeZone: tz }),
  day: (d: Date) => d.toLocaleString('en-US', { day: 'numeric', timeZone: tz }),
  time: (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz }),
  short: (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: tz }),
};
