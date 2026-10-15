import { defineShikiSetup } from '@slidev/types'

// High-contrast light theme: survives washed-out classroom projectors.
export default defineShikiSetup(() => ({
  themes: {
    light: 'github-light-high-contrast',
    dark: 'github-light-high-contrast',
  },
}))
