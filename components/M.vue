<!-- HTTP method pill. Colour always comes with the method name as text. -->
<script setup lang="ts">
defineProps<{ t: string }>()
</script>

<template>
  <span class="mpill" :class="`m-${t.toLowerCase()}`">{{ t }}</span>
</template>
