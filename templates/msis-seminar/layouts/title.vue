<!--
  Title slide of the MSIS template. Every text comes from the slide's frontmatter;
  positions are the template's (baseline placed, see .at in styles/msis.css).

  frontmatter:
    kind       top-right label                       default "Technical Seminar"
    heading    title, a string or a list of lines    default: the deck `title`
    author     presenter name
    regno      registration number
    programme  e.g. "M.E. CyberSecurity"
    guide      label above the panel                 default "Under the guidance of"
    panel      up to two members, each { role, name, designation }
    institute  two lines under each member           default MSIS / MAHE, Manipal
-->
<template>
  <div class="slidev-layout tpl">
    <div class="at ts-tech" style="--y: 42.2; --fs: 28; right: 7.2px;">
      {{ $frontmatter.kind ?? 'Technical Seminar' }}
    </div>

    <div
      v-for="(line, i) in [].concat($frontmatter.heading ?? $slidev.configs.title)" :key="`h${i}`"
      class="at ts-c ts-title" :style="{ '--y': +(89.6 + 33.6 * i).toFixed(2), '--fs': 28 }"
    >
      {{ line }}
    </div>

    <div class="at ts-c" style="--y: 201.6; --fs: 18;"><i>by</i></div>
    <div class="at ts-c ts-name" style="--y: 230.4; --fs: 18;">{{ $frontmatter.author }}</div>
    <div class="at ts-c" style="--y: 253.9; --fs: 18;">{{ $frontmatter.regno }}</div>
    <div class="at ts-c" style="--y: 281.4; --fs: 18;">{{ $frontmatter.programme }}</div>
    <div class="at ts-c" style="--y: 322.1; --fs: 20;">
      <b><i>{{ $frontmatter.guide ?? 'Under the guidance of' }}</i></b>
    </div>

    <template v-for="(p, i) in ($frontmatter.panel ?? []).slice(0, 2)" :key="`p${i}`">
      <div class="at ts-pm" :class="`ts-p${i + 1}`" style="--y: 358.7; --fs: 20;">{{ p.role }}</div>
      <div class="at ts-pm" :class="`ts-p${i + 1}`" style="--y: 386.2; --fs: 20;">{{ p.name }}</div>
      <div class="at" :class="`ts-p${i + 1}`" style="--y: 414.9; --fs: 20;">{{ p.designation }}</div>
      <div class="at" :class="`ts-p${i + 1}`" style="--y: 442.3; --fs: 20;">
        {{ ($frontmatter.institute ?? ['Manipal School of Information Sciences', 'MAHE, Manipal'])[0] }}
      </div>
      <div class="at" :class="`ts-p${i + 1}`" style="--y: 479; --fs: 20;">
        {{ ($frontmatter.institute ?? ['Manipal School of Information Sciences', 'MAHE, Manipal'])[1] }}
      </div>
    </template>
  </div>
</template>
