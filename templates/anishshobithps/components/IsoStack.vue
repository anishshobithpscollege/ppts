<!--
  Exploded isometric stack of slabs, drawn the way the site's figures are: the same
  projector as src/components/diagrams/iso.tsx, three shaded faces per slab, hairline
  edges, brand-green for the one that is "lit", the mascot standing on top.

    <IsoStack :slabs="[{ label: 'pixels', w: 6, d: 4 }, { label: 'EXIF', tone: 'lit', w: 5, d: 3.4 }]" mascot :pin="{ slab: 1, label: '13.35, 74.79' }" />

  slab:  { label?, sub?, tone?: 'default' | 'lit' | 'ghost', w?, d?, h? }  (units, 1 unit = `scale` px)
  gap:   units of air between slabs (the "exploded" distance)
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Slab {
  label?: string
  sub?: string
  tone?: 'default' | 'lit' | 'ghost'
  w?: number
  d?: number
  h?: number
}

const props = withDefaults(defineProps<{
  slabs: Slab[]
  scale?: number
  gap?: number
  mascot?: boolean
  pin?: { slab: number, label: string }
  float?: boolean
}>(), { scale: 34, gap: 1.1, float: true })

const COS = Math.cos(Math.PI / 6)
const P = (x: number, y: number, z: number) => [
  (x - y) * COS * props.scale,
  ((x + y) / 2 - z) * props.scale,
] as const
const pts = (list: (readonly [number, number, number])[]) =>
  list.map(([x, y, z]) => P(x, y, z).map(n => n.toFixed(1)).join(',')).join(' ')

const built = computed(() => {
  let z = 0
  return props.slabs.map((s, i) => {
    const w = s.w ?? 6
    const d = s.d ?? 4
    const h = s.h ?? 0.7
    const x0 = -w / 2
    const x1 = w / 2
    const y0 = -d / 2
    const y1 = d / 2
    const z0 = z
    const z1 = z + h
    z = z1 + props.gap
    const [lx, ly] = P(x0 + 0.35, y1, z0 + h * 0.28)
    return {
      i,
      s,
      z0,
      z1,
      w,
      d,
      h,
      top: pts([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]]),
      left: pts([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]]),
      right: pts([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]]),
      label: { x: lx, y: ly },
      topCenter: P(0, 0, z1),
      cornerR: P(x1, y0, z1),
    }
  })
})

// bounds -> viewBox (include mascot and pin room)
const view = computed(() => {
  const b = built.value
  const sc = props.scale
  const pad = 26
  const pinRoom = props.pin ? 190 : 0
  const all = b.flatMap(s => [
    P(-s.w / 2, -s.d / 2, s.z1), P(s.w / 2, -s.d / 2, s.z1), P(s.w / 2, s.d / 2, s.z1), P(-s.w / 2, s.d / 2, s.z1),
    P(-s.w / 2, s.d / 2, s.z0), P(s.w / 2, s.d / 2, s.z0), P(s.w / 2, -s.d / 2, s.z0),
  ])
  const xs = all.map(p => p[0])
  const ys = all.map(p => p[1])
  const top = Math.min(...ys) - (props.mascot ? sc * 3.1 : 0) - (props.pin ? sc * 1.2 : 0)
  const minX = Math.min(...xs) - pad
  const maxX = Math.max(...xs) + pad + pinRoom
  const maxY = Math.max(...ys) + pad
  return { x: minX, y: top - pad, w: maxX - minX, h: maxY - top + pad }
})

const mascotH = computed(() => props.scale * 2.7)
const top = computed(() => built.value[built.value.length - 1])
const pinAt = computed(() => (props.pin ? built.value[props.pin.slab] : null))
</script>

<template>
  <svg
    class="iso"
    :viewBox="`${view.x} ${view.y} ${view.w} ${view.h}`"
    :style="{ aspectRatio: `${view.w} / ${view.h}` }"
    fill="none"
    aria-hidden="true"
  >
    <!-- vertical guide through the stack -->
    <line
      class="iso-guide"
      :x1="0"
      :y1="built[0] ? built[0].topCenter[1] : 0"
      :x2="0"
      :y2="top ? top.topCenter[1] : 0"
    />

    <g
      v-for="b in built"
      :key="b.i"
      class="slab"
      :class="[`slab--${b.s.tone ?? 'default'}`, { floaty: float }]"
      :style="{ '--lift': `${-4 - b.i * 1.5}px`, 'animation-delay': `${b.i * -0.9}s` }"
    >
      <polygon class="f-left" :points="b.left" />
      <polygon class="f-right" :points="b.right" />
      <polygon class="f-top" :points="b.top" />

      <text
        v-if="b.s.label"
        class="slab-text"
        :transform="`matrix(0.866 0.5 0 1 ${b.label.x} ${b.label.y})`"
        :font-size="scale * 0.36"
      >
        {{ b.s.label }}<tspan v-if="b.s.sub" class="slab-sub" :dx="scale * 0.5" :font-size="scale * 0.27">{{ b.s.sub }}</tspan>
      </text>
    </g>

    <!-- the pin: dashed leader off the chosen slab, ripple, label -->
    <g v-if="pin && pinAt" class="pin" :transform="`translate(${pinAt.cornerR[0]} ${pinAt.cornerR[1]})`">
      <path class="pin-leader" d="M0 0 L38 -30 L150 -30" />
      <circle class="pin-ripple" cx="0" cy="0" r="6" />
      <circle class="pin-dot" cx="0" cy="0" r="4.5" />
      <text class="pin-text" x="46" y="-38" :font-size="scale * 0.4">{{ pin.label }}</text>
    </g>

    <!-- mascot on top of the stack -->
    <g
      v-if="mascot && top"
      class="mascot"
      :class="{ floaty: float }"
      :style="{ '--lift': `${-4 - (built.length - 1) * 1.5}px`, 'animation-delay': `${(built.length - 1) * -0.9}s` }"
      :transform="`translate(${top.topCenter[0]} ${top.topCenter[1]})`"
    >
      <ellipse class="shadow" cx="0" cy="0" :rx="scale * 0.62" :ry="scale * 0.26" />
      <g :transform="`scale(${mascotH / 64}) translate(-32 -60)`">
        <polygon points="32,4 48,60 40.5,60 32,14 23.5,60 16,60" fill="currentColor" />
        <rect class="eye" x="18" y="36" width="11" height="5" rx="2.5" fill="currentColor" />
        <rect class="eye" x="35" y="36" width="11" height="5" rx="2.5" fill="currentColor" />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.iso {
  width: 100%;
  height: auto;
  overflow: visible;
  color: var(--foreground);
}
.iso-guide {
  stroke: color-mix(in oklab, var(--muted-foreground) 50%, var(--background));
  stroke-width: 1;
  stroke-dasharray: 3 4;
  vector-effect: non-scaling-stroke;
}

/* four-tone shading from the site's .iso-art tokens */
.slab polygon {
  stroke: var(--muted-foreground);
  stroke-width: 1;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}
.f-top {
  fill: color-mix(in oklab, var(--foreground) 6%, var(--background));
}
.f-left {
  fill: color-mix(in oklab, var(--foreground) 11%, var(--background));
}
.f-right {
  fill: var(--muted);
}
.slab--lit polygon {
  stroke: var(--ring);
}
.slab--lit .f-top {
  fill: color-mix(in oklab, var(--ring) 16%, var(--background));
}
.slab--lit .f-left {
  fill: color-mix(in srgb, var(--ring) 26%, var(--background));
}
.slab--lit .f-right {
  fill: color-mix(in oklab, var(--ring) 9%, var(--background));
}
.slab--ghost polygon {
  stroke: var(--muted-foreground);
  stroke-dasharray: 3 3;
  fill: transparent;
}

.slab-text {
  fill: color-mix(in oklab, var(--foreground) 80%, var(--background));
  font-family: var(--font-mono);
  font-weight: 600;
  letter-spacing: 0.04em;
}
.slab--lit .slab-text {
  fill: var(--primary);
}
.slab-text .slab-sub {
  fill: var(--muted-foreground);
  font-weight: 400;
}

.floaty {
  animation: site-float 5s ease-in-out infinite;
}

.pin-leader {
  stroke: var(--ring);
  stroke-width: 1.4;
  stroke-dasharray: 4 4;
  vector-effect: non-scaling-stroke;
  animation: site-march 0.9s linear infinite;
}
.pin-dot {
  fill: var(--ring);
}
.pin-ripple {
  fill: none;
  stroke: var(--ring);
  stroke-width: 1.4;
  transform-box: fill-box;
  transform-origin: center;
  animation: site-ripple 1.8s ease-out infinite;
}
.pin-text {
  fill: var(--primary);
  font-family: var(--font-mono);
  font-weight: 600;
}

.mascot .shadow {
  fill: var(--foreground);
  opacity: 0.1;
}
.mascot .eye {
  transform-box: fill-box;
  transform-origin: center;
  animation: eye-blink 4.8s ease-in-out infinite;
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

@media (prefers-reduced-motion: reduce) {
  .floaty,
  .pin-leader,
  .pin-ripple,
  .mascot .eye {
    animation: none;
  }
}
</style>
