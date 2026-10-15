<!--
  Two columns. Left is the default slot, right is `::right::`.
  frontmatter: section, index (as default), cols: CSS grid-template-columns, e.g. '5fr 6fr'
-->
<script setup lang="ts">
defineProps<{ section?: string, index?: string | number, cols?: string }>()
</script>

<template>
  <div class="slidev-layout sheet-layout">
    <Sheet />
    <main class="body">
      <SectionHead v-if="section" :section="section" :index="index" />
      <div class="cols" :style="{ gridTemplateColumns: cols || '1fr 1fr' }">
        <div class="col"><slot /></div>
        <div class="col"><slot name="right" /></div>
      </div>
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
.cols {
  flex: 1;
  min-height: 0;
  display: grid;
  gap: 48px;
}
.col {
  min-width: 0;
  display: flex;
  flex-direction: column;
}
</style>
