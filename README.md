# futurefull
Futurefull Website


## Dev

Astro static site, hosted on Netlify (`netlify.toml`). The previous hand-built site is in `legacy/`.

```
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
```

Events come from the public "Futurefull Public" Google Calendar and news from the Buttondown RSS feed, both fetched **at build time** (`src/lib/`). New calendar events or newsletter posts appear after the next build — trigger one with a Netlify build hook.
