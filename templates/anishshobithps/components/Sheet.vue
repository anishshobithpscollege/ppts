<!--
  The drawing-sheet frame every slide sits on (the site's section frame):
  thin hatch bands top and bottom, square 1 px rails between them, and a header with the
  mark at top left and "title / page" at top right. Everything is anchored to the edges, so it
  follows any canvas size or aspect ratio.

    <Sheet />                 header with the mark
    <Sheet draw-logo />       the mark sketches itself (the cover)
    <Sheet bare />            bands and rails only
-->
<script setup lang="ts">
defineProps<{ bare?: boolean, drawLogo?: boolean }>()

const pad = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <div class="sheet" aria-hidden="true">
    <div class="band band-top hatch" />
    <div class="band band-bottom hatch" />
    <!-- Rails and bands stay square, as on the site: fillets live between cells and rows,
         never against a hatch band (see .cells and .panel in styles/site.css). -->
    <div class="rail rail-l" />
    <div class="rail rail-r" />

    <header v-if="!bare" class="head">
      <Logo :size="30" wordmark :draw="drawLogo" />
      <span class="head-meta">
        <span>{{ $slidev.configs.title }}</span>
        <span class="head-count">{{ pad($page) }} / {{ pad($slidev.nav.total) }}</span>
      </span>
    </header>
  </div>
</template>

<style scoped>
.sheet {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.band {
  position: absolute;
  left: 0;
  right: 0;
  height: 16px;
}
.band-top {
  top: 0;
  border-bottom: 1px solid var(--border);
}
.band-bottom {
  bottom: 0;
  border-top: 1px solid var(--border);
}

.rail {
  position: absolute;
  top: 16px;
  bottom: 16px;
  width: 1px;
  background: var(--border);
}
.rail-l {
  left: 56px;
}
.rail-r {
  right: 56px;
}

.head {
  position: absolute;
  top: 17px;
  left: 57px;
  right: 57px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  border-bottom: 1px solid var(--border);
}
.head-meta {
  display: flex;
  gap: 18px;
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}
.head-count {
  color: var(--primary);
}
</style>
