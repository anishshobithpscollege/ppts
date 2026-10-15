<!--
  The site's SectionHeader: mono label, then a hairline that runs to the edge.
  Index defaults to the slide number ("02"), like the site's section counter.
-->
<script setup lang="ts">
defineProps<{ section: string, index?: string | number }>()
const pad = (n: number | string) => String(n).padStart(2, '0')
</script>

<template>
  <div class="section-head rise">
    <span class="label accent">{{ pad(index ?? $page) }}</span>
    <span class="label">{{ section }}</span>
    <span class="rule" />
  </div>
</template>

<style scoped>
.section-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}
.rule {
  flex: 1;
  height: 1px;
  background: var(--line);
}
</style>
