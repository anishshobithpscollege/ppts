# HTTP QUERY Method: A Security-Focused Literature Survey and Analysis

M.E. CyberSecurity technical seminar, Manipal School of Information Sciences, MAHE, Manipal.
Topic: the HTTP `QUERY` method (RFC 10008, June 2026). 28 slides, one click in the whole deck,
presenter notes timed to 18:30 of talk, plus 2 to 3 minutes of questions (about 21 minutes).
The Literature Review is two slides (three standards, four studies); the other sources are in the
References only.

- Template: [`msis-seminar`](../../templates/msis-seminar), with the shared shadcn-vue primitives
  from [`addons/shadcn`](../../addons/shadcn) (Card, Table, Alert, Badge, Code Block via
  `<Snippet>`, `<Terminal>`, `<Cite>`) on the template's colours.
- Slides: [`slides.md`](slides.md). Presenter notes are in the HTML comments after each slide.
- Code on the slides comes from real files in [`snippets/`](snippets), loaded with `?raw`:

  | file | what it is |
  |---|---|
  | `server.mjs` | a QUERY endpoint following RFC 10008 (400 / 415 / 422 / 405, Location, OPTIONS discovery) |
  | `client.sh`, `client.mjs`, `client.py` | curl, fetch() and Python clients for it |
  | `cache-key.mjs`, `cache-key.out` | correct vs lossy cache-key normalisation, and its real output |
  | `search-handler.js` | excerpt: injection vs parameterised query, authorization, cost cap |
  | `*.http`, `access.log` | the HTTP messages shown on the slides (several are RFC 10008's own examples) |

- Deck-only: `style.css` (URI anatomy, hop chain, legends) and `components/M.vue` (method badge).
- Study guide: [`study-guide.html`](study-guide.html), a single page to read before the talk: the RFC
  section by section, a line-by-line code walk, the security analysis, the literature and a bank of
  likely questions. Open it from the dev server (`/study-guide.html`) or as a file; the diagrams need
  the internet or `pnpm install`.
- Exports: [`exports/`](exports)

```bash
pnpm dev http-query
pnpm export http-query

# run the code shown on the slides (Node 24+, curl, Python 3)
node decks/http-query/snippets/server.mjs
bash decks/http-query/snippets/client.sh
node decks/http-query/snippets/client.mjs
python3 decks/http-query/snippets/client.py
node decks/http-query/snippets/cache-key.mjs
```

All of the above were run on macOS with Node 24.18, curl 8.7.1 and Python 3.14 on 17 Oct 2026;
the outputs on the slides are from those runs.
