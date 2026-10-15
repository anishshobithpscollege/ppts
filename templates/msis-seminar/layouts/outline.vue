<!--
  "Presentation Outline" slide of the MSIS template.
  frontmatter:
    items  the numbered outline entries, a list of strings
  "References" is appended, unnumbered, as in the template.
-->
<template>
  <div class="slidev-layout tpl">
    <div class="tpl-title t36" style="--y: 42.3">Presentation Outline</div>
    <div class="tpl-body frame-outline">
      <div class="ol">
        <div
          v-for="(item, i) in $frontmatter.items ?? []" :key="i"
          class="ol-i" :style="{ top: `${(-3.4 + 36 * i).toFixed(1)}px` }"
        >
          <span>{{ i + 1 }}.</span>{{ item }}
        </div>
        <div class="ol-i ol-ref" :style="{ top: `${(-3.4 + 36 * ($frontmatter.items ?? []).length).toFixed(1)}px` }">
          References
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>
