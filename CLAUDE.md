# Futurefull website

Astro static site for futurefullstories.com, deployed on Netlify (`netlify.toml`). Work on the `astro` branch; `main` is the old hand-built site. Run `npm run dev` / `npm run build`.

## Layout
- `src/pages/` — `index.astro` (home), `team.astro`
- `src/components/` — `Hero`, `Nav`, `Footer`; `src/layouts/Base.astro`
- `src/lib/calendar.ts`, `src/lib/newsletter.ts` — build-time fetch of the public Google Calendar and Buttondown RSS
- `src/styles/` — CUBE CSS. `global.css` is the entry and sets the `@layer` order (reset, base, composition, utility, block). `tokens.css` (colors, type/space scales), `compositions.css` (wrap, region, stack, flow, prose, cluster, switcher, sidebar, grid), `utilities.css` (`.surface-*`, `.display`, `.density-light`, …), `blocks/*.css` (button, card, eyebrow, tag, steps, slot, quote, signup, strip). Component-only styles go in the component's `<style>`.
- `public/` — served as-is: `fonts/`, `brand/` (wordmark, icon, pattern, Fractured Atlas logo), `hero-loop.mp4`, `hero-poster.jpg`
- `brand/` — source brand kit (quick reference, banner, profile icon, static + variable Superlumina). Not served.
- `design/mock/` — the static HTML mocks this was built from. Reference only: the Astro source is the truth, and the mock's events/news are frozen snapshots. `design/projects-block.html` is the removed Projects section, to restore later.
- `legacy/` — the previous site. Leave it alone.

## Brand
Yellow `#FBCA16`, navy `#161543`, coral `#FA4C57`, cream `#FFF8DC`. Headings: Superlumina (variable; custom axes `DNST` = density, `SPED` = slant; Black = `"DNST" 74`, from `--dnst`; lighten inline text with `.density-light`). Body: Montserrat. Event and news titles: Montserrat Alternates ExtraBold. Headings are all-caps by default.

## Content rules
- **Events** come from the "Futurefull Public" calendar. Location = venue (tagged IRL) or a platform/link (tagged URL, see `isURL` in `calendar.ts`). The event's URL field is the RSVP link (falls back to the first link in the description). The description shows publicly as the blurb, so no private notes there.
- **Olamina button** (home): the next future event with "olamina" in the title and a URL → "RSVP: date"; otherwise a follow-on-Instagram fallback.
- **News** = latest 3 Buttondown posts, leading emoji stripped.
- Both feeds are fetched at build time, so changes appear after the next build (use a Netlify build hook). A failed fetch renders an empty state and doesn't break the build.
- Sponsorship language in the footer is Fractured Atlas's required wording for "Futurefull Media" — don't reword it.
- Don't write the site's voice for Dain: mission, headline, and copy are his. Placeholders (photo slots, team bios) stay marked until he supplies them.

## Open items
- Real photos for the two `.ph` slots on home; team bios and headshots; consent for team listing, partner names, and the participant quote.
- Confirm Cat's last name and Taj's title on the team list.
- Test the Buttondown signup form end to end.
- Switch the domain/deploy from GitHub Pages (`CNAME`) to Netlify.

## Hero video
Cut from the DJI footage (`vault/3 Resources/Attachments/DJI_20260815192836_0128_D.mp4` in the Aura vault, 87s):
```
ffmpeg -ss 58 -t 20 -i <source.mp4> -an -vf "scale=1280:-2,fps=24" -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart public/hero-loop.mp4
ffmpeg -ss 58 -i <source.mp4> -frames:v 1 -vf scale=1600:-2 -q:v 4 public/hero-poster.jpg
```
Attendees are identifiable in it; confirm releases before launch.

## CSS conventions
- Colors come from the surface: put `.surface-cream|white|sun|coral|navy` on a section or card, and blocks read `--surface-bg/fg/accent/action-*`. Don't hard-code brand colors in blocks.
- Layout knobs are `.space-s-2…s3`, `.justify-*`, `.valign-*` plus inline `--measure`, `--threshold`, `--sidebar-width`, `--min`. They're `@property`-registered as non-inheriting so they don't leak into nested layouts.
- Spacing and type sizes use the `--s*` and `--step-*` tokens.
- Utilities and layout parameters are classes. `data-*` is only for real block variants (`data-variant`, `data-size`, `data-shape`, `data-side`, `data-rule`, `data-tilt`, `data-watermark`), so it stays free for JS state.
