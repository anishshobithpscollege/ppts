<!--
  Bordered panel from the site's Card / card-grid.
    <Card label="Location" tone="lit">...</Card>
  tone: default | lit (brand wash) | ghost (dashed, transparent) | warn
-->
<script setup lang="ts">
defineProps<{
  label?: string
  tone?: 'default' | 'lit' | 'ghost' | 'warn'
}>()
</script>

<template>
  <div class="card" :class="`card--${tone ?? 'default'}`">
    <div v-if="label" class="label card-label" :class="{ accent: tone === 'lit' }">
      {{ label }}
    </div>
    <slot />
  </div>
</template>

<style scoped>
.card {
  box-sizing: border-box;
  padding: 22px 26px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--card);
}
.card-label {
  margin-bottom: 10px;
  font-size: 13px;
}
.card--lit {
  border-color: var(--brand-border);
  background: var(--brand-wash);
}
.card--ghost {
  border-style: dashed;
  border-color: var(--fg-29);
  background: transparent;
}
.card--warn {
  border-color: color-mix(in srgb, var(--warning) 45%, var(--line));
  background: color-mix(in srgb, var(--warning) 7%, var(--background));
}
</style>
