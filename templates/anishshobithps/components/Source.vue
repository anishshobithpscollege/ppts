<!--
  Small source footnote.
    <Source href="https://exiftool.org/exiftool_pod.html">ExifTool docs</Source>
-->
<script setup lang="ts">
defineProps<{ href?: string }>()
</script>

<template>
  <a class="source" :href="href" target="_blank" rel="noopener"><span class="arrow">↗</span><slot /></a>
</template>

<style scoped>
.source {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  line-height: 1.3;
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.03em;
  color: var(--muted-foreground);
  text-decoration: none !important;
}
.arrow {
  color: var(--brand-text);
}
</style>
