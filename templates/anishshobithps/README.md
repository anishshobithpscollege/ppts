# anishshobithps

The look of [anishshobithps.com](https://anishshobithps.com) as a Slidev template: 16:9 on a
1280 px canvas, **Bricolage Grotesque** headings, **Manrope** body, **Fira Code** labels and code,
the brand green, hatch bands and 1 px rails, the **A** mascot, isometric slabs, light and dark.
Everything below was lifted from the site's source (`src/app/global.css`, `typography.tsx`,
`logo*.tsx`, `loader.tsx`, `iso.tsx`, `section-margins.tsx`).

```yaml
---
theme: ../../templates/anishshobithps
---
```

`pnpm new <name> -t anishshobithps` does that and copies `starter/`. Press `d` in the browser
to flip light and dark; exports are light (`--dark` for the other).

## What it takes from the site

| site | here |
|---|---|
| `:root` / `.dark` oklch tokens (`--brand` `oklch(0.58 0.14 155)`, `--line`, `--muted-foreground`, ...) | `styles/site.css`, converted to sRGB hex once so PDF/PPTX exports read plain colours |
| `hatch` utility (315deg, 10 px) and the section frames with 1 px rails | `components/Sheet.vue`: thin bands top and bottom, square rails, header with the mark at top left and `title / page` at top right |
| `card-grid` / `Panel` / `PanelRow`: cells on a `--line` background, 1 px gaps, `--panel-radius` (14 px) corners, outer corners flat | `.cells` (`c1`..`c4`) and `.panel` in `styles/site.css`, same first / last / first-row / last-row conditions as `global.css` and `post-grid.ts` |
| `SectionHeader`: mono label, then a hairline | `components/SectionHead.vue` (`section:` in frontmatter) |
| `TypographyH1..4`, `Lead`, `Mark`, `InlineCode` | heading, `.lead`, `<mark>`, inline code styles |
| `<Reveal>` (fade + rise 20 px, 700 ms) and the 280 ms view transition | `v-click` and the `snappy` slide transition |
| `Logo`, `LogoMascot` (blink, wave), sketch loader (pencil draws, fills, eyes wake) | `components/Logo.vue` |
| Isometric engine (`iso.tsx`): projector, three shaded faces, lit slab in brand | `components/IsoStack.vue` |
| `MouseGlow` | `global-bottom.vue` (shows only while the pointer moves) |
| shiki `github-light` / `github-dark` | `setup/shiki.ts` |

## Layouts

| layout | what it is | frontmatter |
|---|---|---|
| `cover` | Title slide, figure on the right (`::right::`); the header mark sketches itself | `kicker` |
| `default` | Header, section label, free body | `section`, `index` |
| `split` | Two columns (`::right::`) | `section`, `index`, `cols` (e.g. `5fr 6fr`) |
| `statement` | One big sentence | `section`, `index` |
| `end` | Closing slide | none |

## Components

| component | use |
|---|---|
| `<Logo :size draw wordmark waving eyes="open\|happy\|flat">` | the mark; `draw` replays the sketch loader |
| `<IsoStack :slabs scale gap mascot pin>` | exploded stack of slabs; slab `{ label, sub, tone: default\|lit\|ghost, w, d, h }` |
| `<Card label tone="default\|lit\|ghost\|warn">` | bordered panel |
| `<Pill tone="muted\|brand\|warn\|bad">` | mono tag |
| `<MonacoCode :code :steps lang height>` | read-only Monaco editor; one click per step highlights `{ lines: '6-13', label }`, dims the rest and scrolls to it. Pass the file with `import code from './x.sh?raw'`; set `monaco: true` in the headmatter |
| `<Terminal title size>` | window chrome; lines are HTML, helper classes `t-prompt t-dim t-ok t-tag t-loc t-dev t-id t-sw t-cursor` |
| `<Source href>` | small `↗ name` footnote |
| `<SectionHead section index>` | the header line, used by the layouts |

Classes: `.lead`, `.label` (+ `.accent`), `.mono`, `.muted`, `.brand`, `.display`, `.hatch`, `.rise`,
`.byline`, `.cells` + `c1|c2|c3|c4` (+ `.stagger`, cell tones `.lit` `.warn`), `.panel` (+ `.stagger`).

Fillets: they sit where cells meet cells and rows meet rows, never against a rail or a hatch
band. The outermost corners of a grid stay square, exactly like the site's edge-to-edge grids.
CSS variables: `--background --foreground --card --muted --muted-foreground --line --brand
--brand-text --selection-bg --warning --destructive`, plus `--fg-3 ... --fg-80` and `--brand-4 ...
--brand-border` (the site's `color-mix(in oklab, ...)` steps, precomputed).

## Notes

- Everything in the frame is anchored to the edges and the body is flex/grid, so a different
  `aspectRatio` (16/10, 4/3) or `canvasWidth` reflows instead of overlapping; the Monaco editor
  fills the space it is given, in whole lines.
- Fonts come from `@fontsource-variable/*` (in the root `package.json`), so the deck works
  offline. A `.pptx` only names fonts; install Bricolage Grotesque, Manrope and Fira Code on the
  machine that opens it, or hand out the PDF.
- Logo, mascot and artwork are the site's (CC BY-NC-ND as artwork, brand reserved); this
  template is for the site owner's own talks.
- Keep new tokens as hex; `color-mix()` and `oklch()` survive the browser but not every
  editable-PPTX conversion.
