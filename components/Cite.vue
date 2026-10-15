<!--
  Clickable citation. <Cite r="9110" s="9.2.1" /> links to that RFC section on
  rfc-editor.org; <Cite t="Fetch" href="..." /> for any other source.
-->
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ r?: string, s?: string, t?: string, href?: string }>()

const label = computed(() => props.t ?? `RFC ${props.r}${props.s ? ` §${props.s}` : ''}`)
const url = computed(() => props.href
  ?? `https://www.rfc-editor.org/rfc/rfc${props.r}.html${props.s ? `#section-${props.s}` : ''}`)
</script>

<template>
  <a class="cite" :href="url" target="_blank" rel="noopener">[{{ label }}]</a>
</template>
