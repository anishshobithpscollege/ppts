<!--
  "Title and Content" slide of the MSIS template.
  frontmatter:
    section: title text in the top-right header, e.g. "1. Introduction"
    tsize:   36 for the slides the template sets at 36pt (Outline, Introduction)
    tbase:   optional title baseline in pt when the template's title box sits higher
    frame:   intro | obj | lit | desc | concl | refs | outline  (placeholder position)
-->
<template>
  <div class="slidev-layout tpl">
    <div
      v-if="$frontmatter.section" class="tpl-title" :class="{ t36: $frontmatter.tsize === 36 }"
      :style="$frontmatter.tbase ? { '--y': $frontmatter.tbase } : undefined"
    >
      {{ $frontmatter.section }}
    </div>
    <div class="tpl-body" :class="`frame-${$frontmatter.frame || 'desc'}`">
      <slot />
    </div>
  </div>
</template>
