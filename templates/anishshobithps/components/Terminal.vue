<!--
  Terminal window. Lines are plain HTML so a deck can v-click them one by one.

    <Terminal title="~/shots">
      <div class="ln"><span class="t-prompt">$</span> ./exifleak.sh shots</div>
      <div class="ln"><span class="t-tag t-loc">[LOCATION]</span> taken at 13.3525,74.7928</div>
    </Terminal>

  Helper classes: t-prompt, t-dim, t-ok, t-tag + t-loc | t-dev | t-id | t-sw
-->
<script setup lang="ts">
defineProps<{ title?: string, size?: number }>()
</script>

<template>
  <div class="term">
    <div class="term-bar">
      <span class="dot" /><span class="dot" /><span class="dot" />
      <span class="term-title">{{ title }}</span>
    </div>
    <div class="term-body" :style="size ? { fontSize: `${size}px` } : undefined"><slot /></div>
  </div>
</template>

<style scoped>
.term {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--card);
  box-shadow: 0 1px 0 var(--shadow);
}
.term-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  border-bottom: 1px solid var(--line);
  background: var(--fg-3);
}
.dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--fg-15);
}
.term-title {
  margin-left: 10px;
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.06em;
  color: var(--muted-foreground);
}
.term-body {
  padding: 18px 22px 20px;
  font-family: var(--font-mono);
  font-size: 17.5px;
  line-height: 1.7;
  white-space: pre;
}
.term-body :deep(.ln) {
  min-height: 1.7em;
}
.term-body :deep(.t-prompt) {
  color: var(--brand-text);
  user-select: none;
}
.term-body :deep(.t-dim) {
  color: var(--muted-foreground);
}
.term-body :deep(.t-ok) {
  color: var(--brand-text);
  font-weight: 600;
}
.term-body :deep(.t-tag) {
  font-weight: 600;
}
.term-body :deep(.t-loc) {
  color: var(--destructive);
}
.term-body :deep(.t-dev) {
  color: color-mix(in srgb, var(--warning) 80%, var(--foreground));
}
.term-body :deep(.t-id) {
  color: var(--brand-text);
}
.term-body :deep(.t-sw) {
  color: var(--muted-foreground);
}
.term-body :deep(.t-cursor) {
  display: inline-block;
  width: 0.6em;
  height: 1.1em;
  vertical-align: text-bottom;
  background: var(--foreground);
  animation: site-blink 1s steps(1) infinite;
}
</style>
