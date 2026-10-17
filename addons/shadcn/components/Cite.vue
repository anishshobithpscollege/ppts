<!--
  Citation link.
    <Cite r="9110" s="9.2.1" />            -> [RFC 9110 §9.2.1], links to that section
    <Cite t="Fetch" href="https://..." />  -> [Fetch]
    <Cite href="https://...">ExifTool docs</Cite>   -> ↗ ExifTool docs (footnote style)
-->
<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = defineProps<{ r?: string, s?: string, t?: string, href?: string }>()
const slots = useSlots()

const label = computed(() => props.t ?? (props.r ? `RFC ${props.r}${props.s ? ` §${props.s}` : ''}` : ''))
const url = computed(() => props.href
  ?? `https://www.rfc-editor.org/rfc/rfc${props.r}.html${props.s ? `#section-${props.s}` : ''}`)
</script>

<template>
  <a
    v-if="slots.default"
    data-cite
    :href="url" target="_blank" rel="noopener"
    class="inline-flex items-center gap-[0.5em] font-mono text-[0.8em] tracking-wide text-muted-foreground no-underline"
  ><span class="text-primary" aria-hidden="true">↗</span><slot /></a>
  <a
    v-else
    data-cite
    :href="url" target="_blank" rel="noopener"
    class="whitespace-nowrap text-[0.62em] font-normal text-muted-foreground underline decoration-border underline-offset-2"
  >[{{ label }}]</a>
</template>
