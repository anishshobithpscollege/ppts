import type { Component } from 'vue'
import { defineAppSetup } from '@slidev/types'
import * as ui from '../src/components/ui'
import css from '../styles/shadcn.css?inline'

const STYLE_ID = 'slidev-addon-shadcn'

// The compiled primitives go after every stylesheet Slidev has inserted (uno.css included),
// so component variants win over UnoCSS classes of the same name. See styles/shadcn.css.
function mountStyles(text: string) {
  if (typeof document === 'undefined')
    return
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = STYLE_ID
    document.head.append(el)
  }
  el.textContent = text
}

if (import.meta.hot)
  import.meta.hot.accept('../styles/shadcn.css?inline', mod => mod && mountStyles(mod.default))

// Registers the shadcn-vue primitives (Card, CardHeader, Badge, Table, CodeBlock, ...) for every
// slide. Only exports that are Vue components are registered; cva helpers and composables
// (badgeVariants, useHighlightedCode) stay importable from '@shadcn/components/ui/...'.
export default defineAppSetup(({ app }) => {
  mountStyles(css)
  for (const [name, value] of Object.entries(ui)) {
    if (/^[A-Z]/.test(name) && value && typeof value === 'object' && ('setup' in value || 'render' in value))
      app.component(name, value as Component)
  }
})
