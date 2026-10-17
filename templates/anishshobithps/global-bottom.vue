<!--
  The site's <MouseGlow>: a soft brand-tinted blob that trails the pointer. It sits under the
  slides, never takes pointer events, and is invisible until the pointer moves (so exports
  and a parked laser pointer stay clean).
-->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const root = ref<HTMLElement | null>(null)
const x = ref(-999)
const y = ref(-999)
const visible = ref(false)

let frame = 0
let px = 0
let py = 0

function place() {
  frame = 0
  const el = root.value?.parentElement
  if (!el) return
  const r = el.getBoundingClientRect()
  const scale = r.width / (el.offsetWidth || r.width)
  x.value = (px - r.left) / scale
  y.value = (py - r.top) / scale
}
function move(e: PointerEvent) {
  px = e.clientX
  py = e.clientY
  visible.value = true
  if (!frame) frame = requestAnimationFrame(place)
}
function leave() {
  visible.value = false
}

onMounted(() => {
  window.addEventListener('pointermove', move, { passive: true })
  document.documentElement.addEventListener('pointerleave', leave)
})
onBeforeUnmount(() => {
  window.removeEventListener('pointermove', move)
  document.documentElement.removeEventListener('pointerleave', leave)
  cancelAnimationFrame(frame)
})
</script>

<template>
  <div ref="root" class="glow" aria-hidden="true" :style="{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`, opacity: visible ? 1 : 0 }" />
</template>

<style scoped>
.glow {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: color-mix(in oklab, var(--ring) 10%, transparent);
  filter: blur(48px);
  pointer-events: none;
  transition: opacity 0.3s ease;
  will-change: transform;
}
</style>
