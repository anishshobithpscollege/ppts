<!--
  Small mono tag.   <Pill tone="brand">GPS</Pill>
  tone: muted (default) | brand | warn | bad
-->
<script setup lang="ts">
defineProps<{ tone?: 'muted' | 'brand' | 'warn' | 'bad' }>()
</script>

<template>
  <span class="pill" :class="`pill--${tone ?? 'muted'}`"><slot /></span>
</template>

<style scoped>
.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.18em 0.7em;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--muted);
  color: var(--muted-foreground);
  font-family: var(--font-mono);
  font-size: 0.62em;
  font-weight: 500;
  letter-spacing: 0.04em;
  line-height: 1.6;
  white-space: nowrap;
}
.pill--brand {
  border-color: var(--brand-border);
  background: var(--brand-wash);
  color: var(--brand-text);
}
.pill--warn {
  border-color: color-mix(in srgb, var(--warning) 50%, var(--line));
  background: color-mix(in srgb, var(--warning) 10%, var(--background));
  color: color-mix(in srgb, var(--warning) 70%, var(--foreground));
}
.pill--bad {
  border-color: color-mix(in srgb, var(--destructive) 40%, var(--line));
  background: color-mix(in srgb, var(--destructive) 8%, var(--background));
  color: var(--destructive);
}
</style>
