<!--
  Small mono tag, the site's pill, on the shadcn-vue Badge.   <Pill tone="brand">GPS</Pill>
  tone: muted (default) | brand | warn | bad. Colours are design tokens only.
-->
<script setup lang="ts">
const props = defineProps<{ tone?: 'muted' | 'brand' | 'warn' | 'bad' }>()

const tones = {
  muted: 'border-border bg-muted text-muted-foreground',
  brand: 'border-ring/30 bg-accent text-primary',
  warn: 'border-warning/50 bg-warning/10 text-warning-foreground',
  bad: 'border-destructive/40 bg-destructive/8 text-destructive',
}
</script>

<template>
  <Badge
    variant="outline"
    :class="[
      'gap-[0.4em] rounded-full px-[0.7em] py-[0.18em] font-mono text-[0.62em] font-medium leading-[1.6] tracking-[0.04em]',
      tones[props.tone ?? 'muted'],
    ]"
  >
    <slot />
  </Badge>
</template>
