<!--
  One big sentence. Wrap the part to light up in ==marks==.
  frontmatter: section, index
-->
<script setup lang="ts">
defineProps<{ section?: string, index?: string | number }>()
</script>

<template>
  <div class="slidev-layout sheet-layout">
    <Sheet />
    <main class="body">
      <SectionHead v-if="section" :section="section" :index="index" />
      <div class="stage"><slot /></div>
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
.stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}
.stage :deep(h1) {
  font-size: 76px;
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.04;
}
</style>
