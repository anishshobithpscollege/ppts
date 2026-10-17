<!--
  The template's Literature Review table ("Light Style 3 - Accent 2"), built from the
  shadcn-vue Table primitives. Columns and widths are the template's.

    <LitTable :rows="[
      { authors: 'J. Reschke, J. M. Snell, M. Bishop', title: 'The HTTP QUERY Method',
        href: 'https://www.rfc-editor.org/rfc/rfc10008.html', venue: 'RFC 10008, 2026',
        dataset: '...', purpose: '...', findings: '...' },
    ]" />

  size: text size in pt (default 15.5), so a slide with fewer rows can use more space.
-->
<script setup lang="ts">
interface Row {
  authors: string
  title: string
  href?: string
  venue: string
  dataset: string
  purpose: string
  findings: string
}

withDefaults(defineProps<{ rows: Row[], size?: number }>(), { size: 15.5 })

const cols = ['23.2%', '21.9%', '26.9%', '28%']
const heads = ['Authors and Title', 'Dataset', 'Purpose of Study', 'Key Findings']
</script>

<template>
  <!-- the style lands on the Table's wrapper div; .lit reads the size from --lit-fs (msis.css) -->
  <Table class="lit table-fixed border-collapse" :style="{ '--lit-fs': `${size}px` }">
    <colgroup><col v-for="w in cols" :key="w" :style="{ width: w }"></colgroup>
    <TableHeader>
      <TableRow class="border-b-2 border-border">
        <TableHead
          v-for="h in heads" :key="h"
          class="h-[30px] border border-border px-[6px] text-center text-[18px] font-bold text-foreground"
        >
          {{ h }}
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="(r, i) in rows" :key="i" class="border-0" :class="i % 2 === 0 ? 'bg-secondary' : 'bg-background'">
        <TableCell class="whitespace-normal border border-border p-[5px_7px] align-top">
          {{ r.authors }}, “<a v-if="r.href" :href="r.href" target="_blank" rel="noopener" class="text-chart-3 underline">{{ r.title }}</a><template v-else>{{ r.title }}</template>,” {{ r.venue }}
        </TableCell>
        <TableCell class="whitespace-normal border border-border p-[5px_7px] align-top">{{ r.dataset }}</TableCell>
        <TableCell class="whitespace-normal border border-border p-[5px_7px] align-top">{{ r.purpose }}</TableCell>
        <TableCell class="whitespace-normal border border-border p-[5px_7px] align-top">{{ r.findings }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
