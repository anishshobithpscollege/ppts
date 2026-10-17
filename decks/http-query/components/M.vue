<!--
  HTTP method name as a shadcn-vue Badge. The colour only reinforces the name, which is
  always written out: QUERY = primary, POST = destructive, GET = chart-2, others outline.
-->
<script setup lang="ts">
const props = defineProps<{ t: string }>()

const tone: Record<string, string> = {
  QUERY: 'bg-primary text-primary-foreground',
  POST: 'bg-destructive text-destructive-foreground',
  GET: 'bg-chart-2 text-background',
}
</script>

<template>
  <Badge
    :variant="tone[props.t] ? 'default' : 'outline'"
    :class="[tone[props.t], 'rounded-sm px-1.5 py-0 align-[0.08em] font-mono text-[0.86em] font-bold leading-[1.25]']"
  >
    {{ props.t }}
  </Badge>
</template>
