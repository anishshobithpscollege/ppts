<!--
  Content slide: sheet frame, section header, then whatever the slide holds.
  frontmatter:
    section:  label in the section header ("The problem"); omit for a bare body
    index:    overrides the "02" counter (defaults to the slide number)
-->
<script setup lang="ts">
defineProps<{ section?: string, index?: string | number }>()
</script>

<template>
  <div class="slidev-layout sheet-layout">
    <Sheet />
    <main class="body">
      <SectionHead v-if="section" :section="section" :index="index" />
      <div class="content"><slot /></div>
    </main>
  </div>
</template>

<style scoped>
.body {
  position: absolute;
  left: 112px;
  right: 112px;
  top: 96px;
  bottom: 44px;
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.content > :deep(*) {
  flex-shrink: 0;
}
</style>
