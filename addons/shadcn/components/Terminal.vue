<!--
  Terminal output on the shadcn-vue Code Block: header with window dots and a title, then
  lines as plain HTML so a slide can v-click them one by one.

    <Terminal title="~/photos">
      <div class="ln"><span class="t-prompt">$</span> ./exifleak.sh demo</div>
      <div class="ln"><span class="t-tag t-bad">[LOCATION]</span> 13.3525,74.7928</div>
    </Terminal>

  Or pass captured output as text:  <Terminal title="curl" :text="out" />
  size: 'default' | 'sm';  font: text size in px

  Line helpers, all mapped to design tokens:
    t-prompt t-ok (primary)  t-dim t-muted (muted-foreground)  t-bad (destructive)
    t-warn (warning)  t-tag (semibold)  t-cursor (blinking block)
  Aliases kept for older decks: t-loc = t-bad, t-dev = t-warn, t-id = t-ok, t-sw = t-dim.
-->
<script setup lang="ts">
import { CodeBlock, CodeBlockContent, CodeBlockHeader, CodeBlockTitle } from '@shadcn/components/ui/code-block'

defineProps<{
  title?: string
  text?: string
  size?: 'default' | 'sm'
  font?: number
  class?: string
}>()
</script>

<template>
  <CodeBlock :size="size ?? 'default'" data-terminal :class="['bg-card', $props.class]" :style="font ? { fontSize: `${font}px` } : undefined">
    <CodeBlockHeader class="border-b border-border bg-muted pb-2">
      <span class="flex gap-1.5" aria-hidden="true">
        <span class="size-2.5 rounded-full bg-border" />
        <span class="size-2.5 rounded-full bg-border" />
        <span class="size-2.5 rounded-full bg-border" />
      </span>
      <CodeBlockTitle class="ms-2 font-mono text-muted-foreground">{{ title }}</CodeBlockTitle>
    </CodeBlockHeader>
    <CodeBlockContent
      tabindex="-1"
      class="pt-3 leading-relaxed
        [&_.ln]:min-h-lh [&_.ln]:whitespace-pre
        [&_.t-prompt]:select-none [&_.t-prompt]:text-primary
        [&_.t-ok]:font-semibold [&_.t-ok]:text-primary [&_.t-id]:text-primary
        [&_.t-dim]:text-muted-foreground [&_.t-muted]:text-muted-foreground [&_.t-sw]:text-muted-foreground
        [&_.t-bad]:text-destructive [&_.t-loc]:text-destructive
        [&_.t-warn]:text-warning-foreground [&_.t-dev]:text-warning-foreground
        [&_.t-tag]:font-semibold
        [&_.t-cursor]:inline-block [&_.t-cursor]:h-[1.1em] [&_.t-cursor]:w-[0.6em] [&_.t-cursor]:animate-pulse [&_.t-cursor]:bg-foreground [&_.t-cursor]:align-text-bottom"
    >
      <template v-if="text">{{ text.replace(/\n$/, '') }}</template>
      <slot v-else />
    </CodeBlockContent>
  </CodeBlock>
</template>
