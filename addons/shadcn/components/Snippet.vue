<!--
  A code listing built from the shadcn-vue Code Block (CodeBlock, CodeBlockHeader,
  CodeBlockTitle, CodeBlockContent, CodeBlockLine, CodeBlockToken + useHighlightedCode).
  Syntax colours are design tokens (see styles/shadcn.css), so it follows the deck's theme.

    <script setup>
    import request from './snippets/query.http?raw'
    </script>

    <Snippet :code="request" lang="http" title="QUERY request" lines="1,3" />

  props
    code      the source text (import a file with `?raw`; keep snippets as real, runnable files)
    lang      http | bash | js | ts | json | python | sql | nginx | ini | yaml | diff ... (see
              src/components/ui/code-block/highlighter.ts); unknown languages render plain
    title     header text, usually the file name; no title, no header
    lines     lines to highlight, e.g. "1,3-5"
    added / removed   diff-style lines ("+" / "−" markers)
    callouts  { 3: '1', 6: '2' } puts a numbered badge at the end of a line, for a legend
    range     show only these lines of the file, e.g. "14-31" (numbers start at 14)
    numbers   show line numbers;  start: first line number (default 1, or the range start)
    size      'default' | 'sm';   dense: tighter line height;   wrap: wrap long lines
    font      code size in px, when a listing has to fit a slide
    steps     [{ lines: '6-13', label: 'the list' }, ...]: one click per step highlights
              those lines, dims the rest and scrolls them into view (the component reserves
              the clicks itself). Give the Snippet a bounded height so the listing scrolls.
-->
<script setup lang="ts">
import type { HighlightedToken } from '@shadcn/components/ui/code-block'
import { Badge } from '@shadcn/components/ui/badge'
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
  CodeBlockToken,
  useHighlightedCode,
} from '@shadcn/components/ui/code-block'
import { useSlideContext } from '@slidev/client/context.ts'
import { computed, nextTick, ref, watch } from 'vue'

interface Step { lines: string, label?: string }

const props = withDefaults(defineProps<{
  code: string
  lang?: string
  title?: string
  lines?: string
  added?: string
  removed?: string
  callouts?: Record<number | string, string>
  range?: string
  numbers?: boolean
  start?: number
  size?: 'default' | 'sm'
  dense?: boolean
  font?: number
  wrap?: boolean
  steps?: Step[]
  class?: string
}>(), {
  lang: 'text',
  size: 'default',
  steps: () => [],
})

function parse(spec?: string): Set<number> {
  const out = new Set<number>()
  for (const part of (spec ?? '').split(',').map(s => s.trim()).filter(Boolean)) {
    const [a, b] = part.split('-').map(Number)
    for (let n = a; n <= (b || a); n++) out.add(n)
  }
  return out
}

const span = computed(() => {
  const [a, b] = (props.range ?? '').split('-').map(Number)
  return a ? [a, b || a] as const : null
})
const start = computed(() => props.start ?? span.value?.[0] ?? 1)
const source = computed(() => {
  const text = props.code.replace(/\n$/, '')
  return span.value ? text.split('\n').slice(span.value[0] - 1, span.value[1]).join('\n') : text
})

// The http grammar predates QUERY and leaves such request lines uncoloured. Tokenize them as
// PATCH (same length), then put the real method name back, so QUERY reads like GET or POST.
const STAND_IN = /^QUERY(?= \S+ HTTP\/)/gm
const isHttp = computed(() => props.lang === 'http')
const highlighted = useHighlightedCode(
  () => (isHttp.value ? source.value.replace(STAND_IN, 'PATCH') : source.value),
  () => props.lang,
)
const queryLines = computed(() => new Set(
  source.value.split('\n').flatMap((l, i) => (isHttp.value && /^QUERY \S+ HTTP\//.test(l) ? [i] : [])),
))
const tokens = computed<HighlightedToken[][]>(() => highlighted.value.map((line, i) => {
  if (!queryLines.value.has(i))
    return line
  return line.map((t, j) => (j === 0 ? { ...t, content: t.content.replace(/^PATCH/, 'QUERY') } : t))
}))

const { $clicks } = useSlideContext()
const step = computed(() => Math.min(Math.max($clicks.value, 0), props.steps.length))
const stepLines = computed(() => (step.value ? parse(props.steps[step.value - 1].lines) : null))
const stepLabel = computed(() => (step.value ? props.steps[step.value - 1].label : ''))

const marked = computed(() => ({
  lines: parse(props.lines),
  added: parse(props.added),
  removed: parse(props.removed),
}))

function variant(n: number) {
  if (stepLines.value)
    return stepLines.value.has(n) ? 'highlighted' : 'default'
  if (marked.value.added.has(n))
    return 'added'
  if (marked.value.removed.has(n))
    return 'removed'
  return marked.value.lines.has(n) ? 'highlighted' : 'default'
}
// Keep the active step in view: centre it in the listing (instant, so exports catch it).
const content = ref<{ $el: HTMLElement }>()
watch([step, tokens], async () => {
  await nextTick()
  const pre = content.value?.$el
  if (!pre || !props.steps.length)
    return
  if (!stepLines.value) {
    pre.scrollTop = 0
    return
  }
  const lines = pre.querySelectorAll<HTMLElement>('[data-slot=code-block-line]')
  const first = lines[Math.min(...stepLines.value) - start.value]
  const last = lines[Math.max(...stepLines.value) - start.value]
  if (!first || !last)
    return
  const span = last.offsetTop + last.offsetHeight - first.offsetTop
  pre.scrollTop = Math.max(0, first.offsetTop - (pre.clientHeight - span) / 2)
}, { flush: 'post' })

const dimmed = (n: number) => !!stepLines.value && !stepLines.value.has(n)
const callout = (n: number) => props.callouts?.[n] ?? props.callouts?.[String(n)]
</script>

<template>
  <CodeBlock :size="size" data-snippet :class="props.class" :style="font ? { fontSize: `${font}px` } : undefined">
    <CodeBlockHeader v-if="title || steps.length">
      <CodeBlockTitle class="font-mono">{{ title }}</CodeBlockTitle>
      <CodeBlockActions v-if="steps.length" class="gap-3 font-mono text-xs">
        <span class="text-primary font-semibold">{{ step }} / {{ steps.length }}</span>
        <span v-if="stepLabel" class="text-muted-foreground">{{ stepLabel }}</span>
      </CodeBlockActions>
    </CodeBlockHeader>
    <CodeBlockContent
      ref="content" :line-numbers="numbers" :start-line="start" :wrap="wrap" tabindex="-1"
      :class="['relative', dense && 'leading-snug', wrap && 'data-wrap:wrap-anywhere']"
    >
      <CodeBlockLine
        v-for="(line, i) in tokens" :key="i"
        :variant="variant(start + i)"
        :class="[
          'transition-opacity duration-300',
          { 'opacity-35': dimmed(start + i) },
          variant(start + i) === 'highlighted' && 'shadow-[inset_3px_0_0_var(--primary)]',
        ]"
      >
        <CodeBlockToken v-for="(token, j) in line" :key="j" :token="token" />
        <Badge
          v-if="callout(start + i)"
          class="ms-3 h-[1.35em] min-w-[1.35em] rounded-full px-1 align-[0.1em] font-sans text-[0.72em] leading-none"
        >
          {{ callout(start + i) }}
        </Badge>
      </CodeBlockLine>
    </CodeBlockContent>
    <!-- one invisible v-click per step reserves the slide's clicks -->
    <span v-for="n in steps.length" :key="`s${n}`" v-click class="absolute size-0 overflow-hidden" aria-hidden="true" />
  </CodeBlock>
</template>
