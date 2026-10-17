# ppts

My presentations, built with [Slidev](https://sli.dev). One folder per deck in `decks/`,
reusable looks in `templates/`, one small CLI to run them all.

```
decks/
  http-query/              M.E. CyberSecurity seminar on the HTTP QUERY method (RFC 10008)
    slides.md              the slides, with presenter notes
    style.css              styles for this deck's own content
    components/            Vue components used only by this deck
    exports/               PDF and PPTX deliverables
  exifleak/                5-minute talk on a modular Bash EXIF-leak scanner
    exifleak.sh            the script the talk is about (tested)
templates/
  msis-seminar/            MSIS (MAHE) Seminar Template 2026-27, 16:9
    layouts/ styles/ …     the template itself; see its README for layouts and classes
    starter/               what `pnpm new` copies into a new deck
  anishshobithps/          the look of anishshobithps.com: brand green, hatch frame, A mascot,
                           isometric slabs, light and dark (components/, layouts/, starter/)
scripts/
  deck.mjs                 list / dev / build / export / new
  pptx-widescreen.py       turns Slidev's PPTX into 13.33 × 7.5 in (Carlito → Calibri only)
```

## Use it

```bash
pnpm install

pnpm decks                         # list decks and templates
pnpm dev http-query                # live preview; presenter view at /presenter/
pnpm dev                           # no name: pick from a list
pnpm export http-query             # PDF + PPTX (with and without click steps) into exports/
pnpm export http-query pdf         # or only pdf / only pptx
pnpm build                         # every deck into dist/<name>/ plus dist/index.html
pnpm build http-query              # one deck
pnpm new zero-trust                # new deck from a template (asks for title and author)
pnpm new zero-trust -t msis-seminar --title "Zero Trust" --author "Anish Shobith"
pnpm new demo-day -t anishshobithps --title "Demo day"
```

A deck name can be shortened: `pnpm dev http` works when it matches one deck. Flags the CLI
does not own go straight to Slidev, e.g. `pnpm dev http-query --port 4000`.

## Add a deck

`pnpm new <name>` creates `decks/<name>/` from the chosen template's `starter/`. Edit
`slides.md`. Put anything that only this deck needs next to it: `style.css`, `components/`,
`public/` (images, referenced as `/file.png`).

To make a deck by hand, create `decks/<name>/slides.md` whose headmatter starts with
`theme: ../../templates/<template>` (or a stock theme: `default`, `seriph`).

## Add a template

A template is a [Slidev theme](https://sli.dev/guide/write-theme) kept in `templates/<name>/`.
Decks pick it with `theme: ../../templates/<name>`, so one change in a template updates every
deck that uses it.

1. Copy `templates/msis-seminar` to `templates/<name>` and edit it, or start from nothing:
   - `package.json` with a `description` and `slidev.defaults` (aspect ratio, fonts, …)
   - `layouts/*.vue`, `styles/index.ts`, and optionally `slide-bottom.vue` / `global-bottom.vue`
     for elements drawn on every slide
2. Import images from the template folder (`import logo from './assets/logo.png'`). Only the
   deck's own `public/` is served, so a template cannot rely on its own `public/`.
3. Add `starter/slides.md` (and optionally `style.css`, `README.md`). `pnpm new` replaces
   `{{TITLE}}`, `{{AUTHOR}}`, `{{NAME}}`, `{{THEME}}`, `{{TEMPLATE}}`, `{{YEAR}}`; use
   `'{{TITLE_YAML}}'` inside quoted frontmatter.
4. Fonts or other npm packages the template needs go into the root `package.json`.

Rule of thumb: styles and components that more than one deck would want live in the
template; the rest stays in the deck.

## Exports

`pnpm export <deck>` writes to `decks/<deck>/exports/` using the deck's `exportFilename`
(set in `slides.md`): `<name>.pdf`, `<name>_click-steps.pdf`, `<name>.pptx`,
`<name>_click-steps.pptx`. PPTX needs `python3` (standard library only) for the widescreen
step. Chromium comes from `playwright-chromium`, installed with the dependencies.

## Hosting

`pnpm build` produces a static site: `dist/index.html` lists the decks, each deck is a
single-page app at `dist/<name>/`. `netlify.toml` and `vercel.json` publish `dist` and send
`/<name>/…` routes to that deck's `index.html`. For a sub-path (GitHub Pages),
`pnpm build --base /ppts/`.

**Vercel.** Import the repo as a project; `vercel.json` sets everything (framework "Other",
output `dist`), so leave the dashboard's build settings alone. Two things in it are deliberate:

- Vercel's docs list pnpm up to v10 and this repo uses pnpm 11. The project needs the env var
  `ENABLE_EXPERIMENTAL_COREPACK=1` (Settings → Environment Variables, or
  `npx vercel env add ENABLE_EXPERIMENTAL_COREPACK`) so that plain `pnpm` resolves to the
  `packageManager` version in `package.json`. It cannot be set in `vercel.json`. Without it,
  `installCommand` may pick an older pnpm and fail.
- `installCommand` sets `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`: Chromium is only needed for
  `pnpm export`, not for the site build.

The build runs on Node 24 (`engines` in `package.json`). From the CLI: `vercel` for a preview,
`vercel --prod` for production. `.vercel/` (written by `vercel link`) is git-ignored.

## Notes

- The MSIS template follows the college PowerPoint exactly (section order, fonts, colours,
  footer) at 16:9. Changing `templates/msis-seminar` can change every MSIS deck, so check by
  exporting and comparing slides.
- The `anishshobithps` template is built from the website's own tokens, logo and motion; its
  README lists what maps to what. Its fonts are npm packages, so decks work offline.
- Layout inspired by [antfu/talks](https://github.com/antfu/talks) (one folder per talk,
  shared pieces kept out of the decks) and
  [slidev-decks](https://github.com/afonsojramos/slidev-decks) (`decks/`, picker, starter
  templates, `build --all` with an index page).
