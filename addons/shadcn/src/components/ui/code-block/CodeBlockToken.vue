<script setup lang="ts">
import type { HighlightedToken } from "./highlighter"

defineProps<{
  token: HighlightedToken
}>()
</script>

<template>
  <!-- Colours come from --shiki-token-* variables, which the theme maps to design tokens. -->
  <span :style="token.htmlStyle">{{ token.content }}</span>
</template>
