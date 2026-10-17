import { defineConfig } from 'unocss'

// UnoCSS (Slidev's engine for slides, deck components and templates) gets the same shadcn
// token theme as the Tailwind side, so `bg-muted`, `text-muted-foreground`, `border-border`,
// `bg-primary/10`, `rounded-lg` ... mean the same thing in a slide as inside a component.

const token = (name: string) => `var(--${name})`
const names = [
  'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
  'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'muted',
  'muted-foreground', 'accent', 'accent-foreground', 'destructive', 'destructive-foreground',
  'warning', 'warning-foreground',
  'border', 'input', 'ring', 'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
]

// preset-wind3 ignores the opacity modifier on var() colours (`bg-warning/10` would come out
// solid), so token colours with an opacity get the same color-mix() Tailwind v4 produces.
const PROPS: Record<string, string> = {
  bg: 'background-color',
  text: 'color',
  border: 'border-color',
  outline: 'outline-color',
  decoration: 'text-decoration-color',
  fill: 'fill',
  stroke: 'stroke',
}
const tokenAlpha = new RegExp(`^(${Object.keys(PROPS).join('|')})-(${names.join('|')})\\/(\\d{1,3})$`)

export default defineConfig({
  rules: [
    [tokenAlpha, ([, util, name, alpha]) => ({
      [PROPS[util]]: `color-mix(in oklab, var(--${name}) ${alpha}%, transparent)`,
    })],
  ],
  content: {
    pipeline: {
      // CSS files (UnoCSS's default) and this addon, which Tailwind compiles (see vite.config.ts).
      exclude: [/\.(?:css|postcss|sass|scss|less|stylus|styl)(?:$|\?)/, /[\\/]addons[\\/]shadcn[\\/]/],
    },
  },
  theme: {
    colors: Object.fromEntries(names.map(n => [n, token(n)])),
    borderRadius: {
      sm: 'calc(var(--radius) - 4px)',
      md: 'calc(var(--radius) - 2px)',
      lg: 'var(--radius)',
      xl: 'calc(var(--radius) + 4px)',
    },
  },
})
