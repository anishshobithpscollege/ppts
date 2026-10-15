import { defineShikiSetup } from '@slidev/types'

// Same pair the website's code blocks use (anishshobithps.com/source.config.ts).
export default defineShikiSetup(() => ({
  themes: {
    light: 'github-light',
    dark: 'github-dark',
  },
  // <MonacoCode> highlights through these, so list what the editors need even when no
  // markdown code fence uses the language.
  langs: ['bash', 'shellscript', 'ts', 'js', 'json', 'yaml', 'md'],
}))
