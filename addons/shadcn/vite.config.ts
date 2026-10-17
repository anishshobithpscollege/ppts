import type { Plugin, PluginOption } from 'vite'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Slidev merges this file into every deck that loads the addon (directly or through a template).
//
// Tailwind CSS v4 compiles the shadcn-vue primitives, because their classes are written for it
// (`in-data-*`, `group-has-data-[...]/name:`, `*:[svg]:`, `has-[>svg]:` ...). Slidev keeps
// UnoCSS for slides and templates. To keep the two engines apart, Tailwind may only transform
// this addon's own stylesheet; Slidev's and the templates' CSS (which use UnoCSS `@apply`) never
// reach it.
const ENTRY = /[\\/]addons[\\/]shadcn[\\/]styles[\\/]shadcn\.css(?:\?.*)?$/

function onlyEntry(plugins: PluginOption[]): Plugin[] {
  return (plugins.flat() as Plugin[]).map((plugin) => {
    const hook = plugin.transform
    if (!hook || typeof hook !== 'object')
      return plugin
    const { handler } = hook
    return {
      ...plugin,
      transform: {
        ...hook,
        filter: { id: { include: [ENTRY] } },
        handler(this: unknown, code: string, id: string, ...rest: unknown[]) {
          return ENTRY.test(id) ? (handler as (...a: unknown[]) => unknown).call(this, code, id, ...rest) : undefined
        },
      },
    } as Plugin
  })
}

export default defineConfig({
  plugins: onlyEntry(tailwindcss() as PluginOption[]),
  // Declared up front so a cold dev server or `slidev export` does not discover them mid-load
  // and reload the page (that reload made exports time out).
  optimizeDeps: {
    include: ['reka-ui', 'cn', 'class-variance-authority', '@vueuse/core', '@lucide/vue'],
  },
  resolve: {
    alias: {
      '@shadcn': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
