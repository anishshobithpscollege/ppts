<!--
  GET -> POST -> QUERY "morph" (the deck's central animation).
  Driven by the slide's click count (pass :step="$clicks", slide needs clicks: 5):
    0  GET: query input lives in the URI
    1  POST: the same query data slides into the request content
    2  QUERY: method changes, content stays
    3-5  Safe / Idempotent / Body-oriented confirmed one by one
  Tokens sit on a monospace grid (Courier New advance = 0.6em), so a token's
  position is just (row, column); moving tokens cross-fade URI form -> JSON form.
-->
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ step: number }>()

const FS = 18
const CW = FS * 0.6
const LH = 28

const stage = computed(() => Math.min(Math.max(props.step, 0), 2))

type Pos = [number, number]
interface Tok { text: string, cls?: string, at: [Pos, Pos, Pos], show: [boolean, boolean, boolean] }

const ALL: [boolean, boolean, boolean] = [true, true, true]
const URI_ONLY: [boolean, boolean, boolean] = [true, false, false]
const BODY: [boolean, boolean, boolean] = [false, true, true]
const fixed = (p: Pos): [Pos, Pos, Pos] => [p, p, p]

const tokens: Tok[] = [
  { text: 'GET', cls: 'qm-method qm-get', at: fixed([0, 0]), show: [true, false, false] },
  { text: 'POST', cls: 'qm-method qm-post', at: fixed([0, 0]), show: [false, true, false] },
  { text: 'QUERY', cls: 'qm-method qm-query', at: fixed([0, 0]), show: [false, false, true] },
  { text: '/search', at: [[0, 4], [0, 5], [0, 6]], show: ALL },
  { text: '?', cls: 'qd', at: fixed([0, 11]), show: URI_ONLY },
  { text: '&', cls: 'qd', at: fixed([0, 22]), show: URI_ONLY },
  { text: '&', cls: 'qd', at: fixed([0, 41]), show: URI_ONLY },
  { text: 'HTTP/1.1', cls: 'dim', at: [[0, 60], [0, 13], [0, 14]], show: ALL },
  { text: 'Host: example.com', cls: 'hdr', at: fixed([1, 0]), show: ALL },
  { text: 'Content-Type: application/json', cls: 'hdr', at: fixed([2, 0]), show: BODY },
  { text: '{', cls: 'js', at: fixed([4, 0]), show: BODY },
  { text: '"filters": {', cls: 'js', at: fixed([6, 2]), show: BODY },
  { text: '}', cls: 'js', at: fixed([6, 43]), show: BODY },
  { text: '}', cls: 'js', at: fixed([7, 0]), show: BODY },
  // The query data itself: URI form fades out while the JSON form fades in,
  // both travelling from the request line down into the content.
  { text: 'q=security', cls: 'qd', at: [[0, 12], [5, 2], [5, 2]], show: URI_ONLY },
  { text: '"q": "security",', cls: 'qd', at: [[0, 12], [5, 2], [5, 2]], show: BODY },
  { text: 'filters[year]=2026', cls: 'qd', at: [[0, 23], [6, 15], [6, 15]], show: URI_ONLY },
  { text: '"year": 2026,', cls: 'qd', at: [[0, 23], [6, 15], [6, 15]], show: BODY },
  { text: 'filters[type]=rfc', cls: 'qd', at: [[0, 42], [6, 29], [6, 29]], show: URI_ONLY },
  { text: '"type": "rfc"', cls: 'qd', at: [[0, 42], [6, 29], [6, 29]], show: BODY },
]

function style(t: Tok) {
  const [r, c] = t.at[stage.value]
  return {
    transform: `translate(${c * CW}px, ${r * LH}px)`,
    opacity: t.show[stage.value] ? 1 : 0,
  }
}

type St = 'ok' | 'bad' | 'warn' | 'wait'
interface Cell { k: string, st: St, v: string }

const cells = computed<Cell[]>(() => {
  const s = stage.value
  const n = props.step
  if (s === 0) {
    return [
      { k: 'Safe', st: 'ok', v: 'no state change requested' },
      { k: 'Idempotent', st: 'ok', v: 'can be retried' },
      { k: 'Body-oriented', st: 'bad', v: 'query is in the URI' },
    ]
  }
  if (s === 1) {
    return [
      { k: 'Safe', st: 'bad', v: 'not by definition' },
      { k: 'Idempotent', st: 'bad', v: 'not by definition' },
      { k: 'Body-oriented', st: 'ok', v: 'query is in the content' },
    ]
  }
  return [
    { k: 'Safe', st: n >= 3 ? 'ok' : 'wait', v: n >= 3 ? 'per RFC 10008 §2' : '…' },
    { k: 'Idempotent', st: n >= 4 ? 'ok' : 'wait', v: n >= 4 ? 'per RFC 10008 §2' : '…' },
    { k: 'Body-oriented', st: n >= 5 ? 'ok' : 'wait', v: n >= 5 ? 'query is in the content' : '…' },
  ]
})

const method = computed(() => ['GET', 'POST', 'QUERY'][stage.value])
</script>

<template>
  <div class="qm">
    <div class="qm-panel" :style="{ '--fs': `${FS}px`, 'height': `${LH * 8 + 27}px` }">
      <span v-for="(t, i) in tokens" :key="i" class="qm-tok" :class="t.cls" :style="style(t)">{{ t.text }}</span>
      <span class="qm-tag qm-tag-uri" :style="{ transform: `translate(${28 * CW}px, ${1.15 * LH}px)`, opacity: stage === 0 ? 1 : 0 }">
        ▲ query input sits in the URI
      </span>
      <span class="qm-tag qm-tag-body" :style="{ transform: `translate(${24 * CW}px, ${4.1 * LH}px)`, opacity: stage >= 1 ? 1 : 0 }">
        ◀ same query input, now request content
      </span>
    </div>
    <div class="qm-strip">
      <div v-for="c in cells" :key="c.k" class="qm-cell" :class="`st-${c.st}`">
        <div class="qm-cell-k">
          <carbon-checkmark-filled v-if="c.st === 'ok'" class="qm-ic" />
          <carbon-close-filled v-else-if="c.st === 'bad'" class="qm-ic" />
          <carbon-help v-else class="qm-ic" />
          {{ c.k }}
        </div>
        <div class="qm-cell-v">{{ c.v }}</div>
      </div>
    </div>
    <div class="qm-cap">
      <M :t="method" />
      <span v-if="stage === 0">Safe and idempotent, but the query is squeezed into the URI.</span>
      <span v-else-if="stage === 1">Query is in the content, but POST only says “process this”.</span>
      <span v-else>Query in the content <b>and</b> safe + idempotent semantics.</span>
    </div>
  </div>
</template>

<style scoped>
.qm-panel {
  position: relative;
  font-family: var(--courier);
  font-size: var(--fs);
  font-weight: 700;
  line-height: 28px;
  border: 1.5px solid var(--indigo);
  background: #fff;
  padding: 12px 18px;
  color: #000;
}
.qm-tok {
  position: absolute;
  left: 18px;
  top: 12px;
  white-space: pre;
  transition: transform 1s cubic-bezier(0.45, 0, 0.2, 1), opacity 0.7s ease;
}
.qm-tok.qm-method {
  color: #fff;
  border-radius: 2px;
  box-shadow: 0 0 0 2px var(--mc);
  background: var(--mc);
}
.qm-tok.qm-get { --mc: var(--indigo); }
.qm-tok.qm-post { --mc: var(--brown); }
.qm-tok.qm-query { --mc: var(--orange); }
.qm-tok.qd { background: var(--aqua); box-shadow: 0 0 0 1.5px var(--aqua); }
.qm-tok.hdr, .qm-tok.dim { font-weight: 400; }
.qm-tag {
  position: absolute;
  left: 18px;
  top: 12px;
  font-family: var(--calibri);
  font-size: 17px;
  font-weight: 700;
  line-height: 1.2;
  padding: 2px 8px;
  border: 1.5px solid var(--brown);
  color: var(--brown);
  background: #fff;
  white-space: nowrap;
  transition: opacity 0.6s ease 0.3s;
}
.qm-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 12px;
}
.qm-cell {
  border: 1.5px solid var(--indigo);
  padding: 5px 12px 7px;
  background: #fff;
  transition: background 0.4s ease, border-color 0.4s ease;
}
.qm-cell-k { font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.qm-cell-v { font-size: 17px; margin-left: 32px; }
.qm-ic { font-size: 24px; flex: none; }
.st-ok { border-color: var(--teal); background: var(--teal-t); }
.st-ok .qm-ic { color: var(--teal); }
.st-bad { border-color: var(--brown); border-width: 2px; }
.st-bad .qm-ic { color: var(--brown); }
.st-wait { border-style: dashed; }
.st-wait .qm-ic { color: var(--grey); }
.qm-cap {
  margin-top: 12px;
  font-size: 22px;
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
