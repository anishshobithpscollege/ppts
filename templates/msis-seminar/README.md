# msis-seminar

The MSIS (MAHE, Manipal) **Seminar Template 2026-27** as a Slidev template: 16:9, Calibri
(Carlito fallback), Arial footer, Courier New code, colours `#CC6600` / `#993300` / `#333399`,
MAHE logo, double orange rule and institute footer on every slide.

Use it from a deck with:

```yaml
---
theme: ../../templates/msis-seminar
---
```

`pnpm new <name> -t msis-seminar` does that and copies `starter/` (one sample slide per
template section, in the template's order).

## Layouts

| layout | what it is | frontmatter |
|---|---|---|
| `title` | Title slide | `kind`, `heading` (string or list of lines), `author`, `regno`, `programme`, `guide`, `panel` (up to 2 × `{ role, name, designation }`), `institute` |
| `outline` | "Presentation Outline" | `items`: list of strings, numbered; "References" is appended unnumbered |
| `default` | Title and Content | `section` (top-right title), `frame`, `tsize: 36` where the template uses 36 pt, `tbase` |
| `queries` | "Queries & Suggestions" | none |
| `thank-you` | "THANK YOU…" | none |
| `cover` | Empty full-canvas slide, for your own positioned content | none |

`frame` places the body exactly where the template places that section's placeholder:
`intro`, `obj`, `lit`, `desc`, `concl`, `refs`, `outline`.

## Building blocks (CSS classes)

| class | use |
|---|---|
| `bul` | Bullet list: `•` at level 1, `–` at level 2 (nest a `ul.bul`) |
| `tbl` + `lit` | Literature-review table (Light Style 3, banded rows) |
| `refs` | References list: `<p><span>[1]</span>…</p>` |
| `card`, `cd-lav` `cd-teal` `cd-brown` `cd-orange` | Boxes in the template's table look |
| `node`, `arrow` | Flow-diagram boxes and arrows |
| `txt`, `small`, `brown`, `orange`, `ok`, `bad` | Text size and colour helpers |
| `at` | Place text by baseline: `<div class="at" style="--y: 240; --fs: 36; left: 100px">` |

Colours are CSS variables: `--orange --brown --indigo --lav --teal --teal-t --aqua --grey`.
Anything that belongs to one talk's content goes in that deck's own `style.css`, not here.

## Layout of this folder

```
layouts/       title, outline, default, queries, thank-you, cover
styles/        index.ts (entry) and msis.css
slide-bottom.vue   master layer: logo, rule, footer, slide number
assets/        mahe-logo.jpeg (imported by slide-bottom.vue, so it ships with the template)
setup/shiki.ts high-contrast code theme for projectors
starter/       what `pnpm new` copies
package.json   Slidev defaults: 16:9, 960 px canvas, fonts, no transitions, light only
```

Needs `@fontsource/carlito` and `@slidev/client` from the repo's root `package.json`.
Fidelity to the PowerPoint template is checked by exporting every slide and click step and
comparing pixels, so change `msis.css` with that in mind.
