<!--
  Title slide: bands and rails only. Left column is the default slot (a `# Title`, a lead
  paragraph, meta); `::right::` takes the figure (an <IsoStack>, the <Logo draw>).
  frontmatter: kicker (mono label above the title)
-->
<script setup lang="ts">
defineProps<{ kicker?: string }>()
</script>

<template>
  <div class="slidev-layout sheet-layout cover">
    <Sheet draw-logo />
    <main class="grid">
      <div class="text">
        <div v-if="kicker" class="label accent rise">{{ kicker }}</div>
        <slot />
      </div>
      <div class="art"><slot name="right" /></div>
    </main>
  </div>
</template>

<style scoped>
.grid {
  position: absolute;
  left: 112px;
  right: 112px;
  top: 66px;
  bottom: 17px;
  display: grid;
  grid-template-columns: 6fr 5fr;
  gap: 40px;
  align-items: center;
}
.text {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.art {
  display: flex;
  align-items: center;
  justify-content: center;
}
.cover :deep(h1) {
  font-size: 92px;
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 0.98;
}
</style>
