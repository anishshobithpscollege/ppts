<!--
  The anishshobithps.com mark: a flat "A" with two rounded eyes (components/shared/logo*.tsx).

    <Logo :size="32" wordmark />     mark + "nish" so it reads "Anish"
    <Logo :size="220" draw />        the sketch loader: pencil draws it, fills it in, eyes wake up
    <Logo :size="160" waving eyes="happy" />

  Colour is currentColor, the arm's hand and the pencil body use --brand.
-->
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  size?: number // height in px
  wordmark?: boolean | string // true -> "nish"
  eyes?: 'open' | 'happy' | 'flat'
  waving?: boolean
  draw?: boolean
}>(), { size: 64, eyes: 'open' })

const OUTLINE = 'M32 4 L48 60 L40.5 60 L32 14 L23.5 60 L16 60 Z'
const word = computed(() => (props.wordmark === true ? 'nish' : props.wordmark || ''))
const viewBox = computed(() => (props.waving ? '10 0 50 64' : '12 0 40 64'))
const dims = computed(() => {
  const [, , w, h] = viewBox.value.split(' ').map(Number)
  return { w: Math.round((w / h) * props.size), h: props.size }
})
</script>

<template>
  <span class="logo" :class="{ 'is-draw': draw }" :style="{ '--s': `${size}px` }" role="img" aria-label="Anish Shobith P S">
    <svg :viewBox="viewBox" :width="dims.w" :height="dims.h" fill="none" class="logo-mark" aria-hidden="true">
      <g v-if="waving" class="logo-arm">
        <path d="M44 42 L53 31" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
        <circle cx="54.5" cy="29" r="3.2" fill="var(--ring)" />
      </g>

      <!-- outline: drawn by the pencil, then the body fills in -->
      <path v-if="draw" class="logo-outline" :d="OUTLINE" pathLength="1" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
      <polygon class="logo-body" points="32,4 48,60 40.5,60 32,14 23.5,60 16,60" fill="currentColor" />

      <g class="logo-eyes">
        <template v-if="eyes === 'happy'">
          <path d="M18.5 40 Q23.5 33 28.5 40 M35.5 40 Q40.5 33 45.5 40" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
        </template>
        <template v-else>
          <rect class="logo-eye" x="18" :y="eyes === 'flat' ? 37.5 : 36" width="11" :height="eyes === 'flat' ? 2.5 : 5" :rx="eyes === 'flat' ? 1.25 : 2.5" fill="currentColor" />
          <rect class="logo-eye" x="35" :y="eyes === 'flat' ? 37.5 : 36" width="11" :height="eyes === 'flat' ? 2.5 : 5" :rx="eyes === 'flat' ? 1.25 : 2.5" fill="currentColor" />
        </template>
      </g>

      <!-- pencil follows the outline once, then fades -->
      <g v-if="draw" class="logo-pencil" opacity="0">
        <set attributeName="opacity" to="1" begin="0.15s" fill="freeze" />
        <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.8;1" dur="1.15s" begin="0.15s" fill="freeze" />
        <animateMotion :path="OUTLINE" dur="1s" begin="0.15s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.55 1" />
        <g transform="rotate(-58)">
          <polygon points="0,0 2.4,-0.9 2.4,0.9" fill="currentColor" />
          <polygon points="2.4,-0.9 5.8,-2.1 5.8,2.1 2.4,0.9" stroke="currentColor" stroke-width="0.6" stroke-linejoin="round" fill="var(--background)" />
          <rect x="5.8" y="-2.1" width="12" height="4.2" stroke="currentColor" stroke-width="0.6" fill="var(--ring)" />
          <rect x="17.8" y="-2.1" width="2.2" height="4.2" stroke="currentColor" stroke-width="0.6" fill="var(--muted-foreground)" />
          <path d="M20 -2.1 H21.4 A1.6 2.1 0 0 1 21.4 2.1 H20 Z" stroke="currentColor" stroke-width="0.6" fill="var(--destructive)" />
        </g>
      </g>
    </svg>
    <span v-if="word" class="logo-word">{{ word }}</span>
  </span>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: flex-end;
  gap: calc(var(--s) * 0.06);
  color: var(--foreground);
  line-height: 1;
}
.logo-mark {
  display: block;
  overflow: visible;
}
.logo-word {
  padding-bottom: calc(var(--s) * 0.035);
  font-family: var(--font-display);
  font-size: calc(var(--s) * 0.72);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1;
}

.logo-eye {
  transform-box: fill-box;
  transform-origin: center;
  animation: eye-blink 4.8s ease-in-out infinite;
}
.logo-arm {
  transform-box: view-box;
  transform-origin: 44px 42px;
  animation: arm-wave 2.6s ease-in-out 0.4s infinite;
}

/* sketch loader: outline draws, body fades in, eyes pop, then blink */
.is-draw .logo-outline {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw-outline 1s cubic-bezier(0.45, 0, 0.55, 1) 0.15s forwards;
}
.is-draw .logo-body {
  opacity: 0;
  animation: fade-in 0.5s ease-out 1s forwards;
}
.is-draw .logo-eyes {
  transform-box: fill-box;
  transform-origin: center;
  scale: 0;
  animation: eyes-pop 0.5s var(--ease-pop) 1.45s forwards;
}

@keyframes draw-outline {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes fade-in {
  to {
    opacity: 1;
  }
}
@keyframes eyes-pop {
  to {
    scale: 1;
  }
}
@keyframes eye-blink {
  0%,
  90%,
  100% {
    scale: 1 1;
  }
  94% {
    scale: 1 0.12;
  }
}
@keyframes arm-wave {
  0%,
  50%,
  100% {
    rotate: 0deg;
  }
  10%,
  30% {
    rotate: -20deg;
  }
  20%,
  40% {
    rotate: 12deg;
  }
}

@media (prefers-reduced-motion: reduce) {
  .logo-eye,
  .logo-arm {
    animation: none;
  }
}
</style>
