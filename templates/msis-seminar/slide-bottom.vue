<!--
  Slide-master elements of the MSIS template, drawn behind every slide:
  MAHE logo, double orange rule, footer bar with institute name, slide number.
  The logo is imported (not read from public/) so it ships with the template.
-->
<script setup lang="ts">
import logo from './assets/mahe-logo.jpeg'
</script>

<template>
  <div class="tpl-master">
    <img class="tpl-logo" :src="logo" alt="MAHE logo">
    <div class="tpl-rule" />
    <div class="tpl-footer" />
    <div class="tpl-footer-text">Manipal School of Information Sciences, MAHE, Manipal</div>
    <div class="tpl-slideno">{{ $page }}</div>
  </div>
</template>
