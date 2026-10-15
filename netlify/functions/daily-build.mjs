// Rebuilds the site every morning so the calendar and newsletter feeds (fetched at build time) stay fresh.
// Needs a Netlify build hook URL in the BUILD_HOOK_URL env var (Site configuration > Build & deploy > Build hooks).
export default async () => {
  const hook = process.env.BUILD_HOOK_URL;
  if (!hook) {
    console.error('BUILD_HOOK_URL is not set; skipping rebuild.');
    return new Response('BUILD_HOOK_URL is not set', { status: 500 });
  }
  const res = await fetch(hook, { method: 'POST' });
  console.log(`Build hook responded ${res.status}`);
  return new Response(null, { status: res.ok ? 204 : 502 });
};

// Cron is UTC: 09:00 is 4–5am Eastern.
export const config = { schedule: '0 9 * * *' };
