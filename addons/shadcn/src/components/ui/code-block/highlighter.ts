import type { GrammarState, HighlighterCore } from "shiki/core"
import { createCssVariablesTheme, createHighlighterCore } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"

// Token colours are CSS variables (--shiki-token-keyword, ...), not hex values. The addon's
// stylesheet points each one at a shadcn design token, so code follows the deck's theme
// in light and dark without a second highlighter pass.
const tokensTheme = createCssVariablesTheme({
  name: "design-tokens",
  variablePrefix: "--shiki-",
  fontStyle: true,
})

export interface HighlightedToken {
  content: string
  htmlStyle?: Record<string, string>
}

// Add the languages you need. Each one loads the first time it is used.
const languages = {
  bash: () => import("shiki/langs/shellscript.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  diff: () => import("shiki/langs/diff.mjs"),
  html: () => import("shiki/langs/html.mjs"),
  http: () => import("shiki/langs/http.mjs"),
  ini: () => import("shiki/langs/ini.mjs"),
  nginx: () => import("shiki/langs/nginx.mjs"),
  javascript: () => import("shiki/langs/javascript.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  jsx: () => import("shiki/langs/jsx.mjs"),
  markdown: () => import("shiki/langs/markdown.mjs"),
  python: () => import("shiki/langs/python.mjs"),
  sql: () => import("shiki/langs/sql.mjs"),
  tsx: () => import("shiki/langs/tsx.mjs"),
  typescript: () => import("shiki/langs/typescript.mjs"),
  vue: () => import("shiki/langs/vue.mjs"),
  yaml: () => import("shiki/langs/yaml.mjs"),
}

const aliases: Record<string, keyof typeof languages> = {
  js: "javascript",
  md: "markdown",
  py: "python",
  sh: "bash",
  shell: "bash",
  shellscript: "bash",
  ts: "typescript",
  yml: "yaml",
  zsh: "bash",
}

// FontStyle bit flags from shiki: 1 italic, 2 bold, 4 underline.
function tokenStyle(color?: string, fontStyle?: number) {
  const style: Record<string, string> = {}
  if (color)
    style.color = color
  if (fontStyle && fontStyle > 0) {
    if (fontStyle & 1)
      style["font-style"] = "italic"
    if (fontStyle & 2)
      style["font-weight"] = "bold"
    if (fontStyle & 4)
      style["text-decoration"] = "underline"
  }
  return Object.keys(style).length ? style : undefined
}

let highlighter: Promise<HighlighterCore> | undefined

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [tokensTheme],
    langs: [],
    engine: createJavaScriptRegexEngine({ forgiving: true }),
  })

  return highlighter
}

function getLanguage(language: string) {
  const name = language.toLowerCase()

  if (name === "ansi")
    return name

  if (name in languages)
    return name as keyof typeof languages

  return aliases[name] ?? null
}

// Loads a language and returns a highlighter for it, or null for a language
// that is not listed.
export async function loadHighlighter(language: string) {
  const lang = getLanguage(language)

  if (!lang)
    return null

  const shiki = await getHighlighter()

  if (lang !== "ansi" && !shiki.getLoadedLanguages().includes(lang))
    await shiki.loadLanguage(languages[lang])

  return {
    // Returns the tokens of each line, and the grammar state after the last
    // line. Pass that state back to continue where the code left off.
    highlight(code: string, state?: GrammarState) {
      const tokenize = (text: string) =>
        shiki.codeToTokens(text, {
          lang,
          theme: "design-tokens",
          grammarState: state,
        }).tokens

      // ANSI has no grammar state, so each line is tokenized on its own and
      // gets the same colors whether it arrives in one piece or streams.
      const tokens = lang === "ansi"
        ? code.split("\n").flatMap(line => tokenize(line))
        : tokenize(code)

      return {
        lines: tokens.map(line =>
          line.map((token): HighlightedToken => ({
            content: token.content,
            htmlStyle: tokenStyle(token.color, token.fontStyle),
          })),
        ),
        state: shiki.getLastGrammarState(tokens),
      }
    },
  }
}

export type Highlighter = NonNullable<Awaited<ReturnType<typeof loadHighlighter>>>

// Returns the tokens of each line, or null for a language that is not listed.
export async function highlightCode(code: string, language: string) {
  const highlighter = await loadHighlighter(language)

  return highlighter ? highlighter.highlight(code).lines : null
}
