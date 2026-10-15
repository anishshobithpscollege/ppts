<!--
  Read-only Monaco editor whose highlighted lines follow the click count.

    <script setup>
    import code from './exifleak.sh?raw'
    </script>

    <MonacoCode
      :code="code" lang="bash" :height="400"
      :steps="[
        { lines: '6-13', label: 'one helper' },
        { lines: '15-25', label: 'awk turns degrees into decimals' },
      ]"
    />

  Every step costs one click (the component reserves them). Before the first click nothing is
  dimmed. Lines outside the active step fade, and the editor scrolls so the step is in view.
  Colours come from the same shiki themes as the code blocks (setup/shiki.ts).
-->
<script setup lang="ts">
import type * as Monaco from 'monaco-editor'
import { useSlideContext } from '@slidev/client/context.ts'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface Step { lines: string, label?: string }

const props = withDefaults(defineProps<{
  code: string
  steps?: Step[]
  lang?: string
  height?: number // optional fixed height; by default the editor fills the slide body
  fontSize?: number
  lineHeight?: number
}>(), { steps: () => [], lang: 'bash', fontSize: 15, lineHeight: 24 })

const { $clicks } = useSlideContext()

const root = ref<HTMLDivElement>()
const bar = ref<HTMLDivElement>()
const host = ref<HTMLDivElement>()
const hostHeight = ref(props.height ?? 360)
const PAD = 24 // breathing room above and below the editor (see .mc-pad)

// Fill the space the layout gives us, in whole lines so no half line is clipped.
function fit() {
  if (props.height || !root.value || !bar.value)
    return
  const room = root.value.clientHeight - bar.value.offsetHeight - 2
  const lines = Math.max(6, Math.floor((room - PAD) / props.lineHeight))
  hostHeight.value = lines * props.lineHeight
}
const ready = ref(false)
let editor: Monaco.editor.IStandaloneCodeEditor | undefined
let monaco: typeof Monaco | undefined
let collection: Monaco.editor.IEditorDecorationsCollection | undefined

const active = computed(() => {
  const i = Math.min($clicks.value, props.steps.length)
  return i > 0 ? i : 0
})
const label = computed(() => (active.value ? props.steps[active.value - 1]?.label : ''))

function range(spec: string): [number, number] {
  const [a, b] = spec.split('-').map(Number)
  return [a, b ?? a]
}

function apply() {
  if (!editor || !monaco || !collection)
    return
  const model = editor.getModel()
  if (!model)
    return
  if (!active.value) {
    collection.clear()
    editor.setScrollTop(0)
    return
  }
  const total = model.getLineCount()
  const [a, b] = range(props.steps[active.value - 1].lines)
  const out: Monaco.editor.IModelDeltaDecoration[] = []
  if (a > 1) {
    out.push({
      range: new monaco.Range(1, 1, a - 1, model.getLineMaxColumn(a - 1)),
      options: { inlineClassName: 'mc-dim' },
    })
  }
  if (b < total) {
    out.push({
      range: new monaco.Range(b + 1, 1, total, model.getLineMaxColumn(total)),
      options: { inlineClassName: 'mc-dim' },
    })
  }
  out.push({
    range: new monaco.Range(a, 1, b, 1),
    options: { isWholeLine: true, className: 'mc-hl', linesDecorationsClassName: 'mc-hl-gutter' },
  })
  collection.set(out)
  // Scroll in whole lines (no half line at the top or bottom), keeping the step centred.
  const visible = Math.max(1, Math.floor(hostHeight.value / props.lineHeight))
  const first = Math.min(Math.max(1, Math.round(a - (visible - (b - a + 1)) / 2)), Math.max(1, total - visible + 1))
  editor.setScrollTop((first - 1) * props.lineHeight, monaco.editor.ScrollType.Smooth)
}

let observer: ResizeObserver | undefined

onMounted(async () => {
  if (root.value) {
    observer = new ResizeObserver(fit)
    observer.observe(root.value)
  }
  fit()
  const { default: setup } = await import('@slidev/client/setup/monaco.ts')
  const result = await setup()
  monaco = result.monaco
  const model = monaco.editor.createModel(props.code.replace(/\n$/, ''), props.lang)
  editor = monaco.editor.create(host.value!, {
    model,
    readOnly: true,
    domReadOnly: true,
    automaticLayout: true,
    lineNumbers: 'on',
    lineNumbersMinChars: 3,
    lineDecorationsWidth: 10,
    glyphMargin: false,
    folding: false,
    minimap: { enabled: false },
    overviewRulerLanes: 0,
    overviewRulerBorder: false,
    hideCursorInLongLines: true,
    renderLineHighlight: 'none',
    occurrencesHighlight: 'off',
    selectionHighlight: false,
    matchBrackets: 'never',
    contextmenu: false,
    guides: { indentation: false },
    scrollBeyondLastLine: false,
    scrollbar: { vertical: 'hidden', horizontal: 'hidden', handleMouseWheel: false, alwaysConsumeMouseWheel: false },
    padding: { top: 0, bottom: 0 },
    stickyScroll: { enabled: false },
    fontFamily: 'var(--font-mono)',
    fontSize: props.fontSize,
    lineHeight: props.lineHeight,
    fontLigatures: false,
    tabSize: 4,
    bracketPairColorization: { enabled: false },
  })
  collection = editor.createDecorationsCollection()
  ready.value = true
  apply()
})

watch([active, ready, hostHeight], apply)
onBeforeUnmount(() => {
  observer?.disconnect()
  editor?.getModel()?.dispose()
  editor?.dispose()
})
</script>

<template>
  <div ref="root" class="mc">
    <div ref="bar" class="mc-bar">
      <span class="mc-dot" /><span class="mc-dot" /><span class="mc-dot" />
      <span class="mc-file">exifleak.sh</span>
      <span v-if="steps.length" class="mc-step">
        <span class="mc-step-n">{{ active }} / {{ steps.length }}</span>
        <span v-if="label" class="mc-step-l">{{ label }}</span>
      </span>
    </div>
    <div class="mc-pad">
      <div ref="host" class="mc-host" :style="{ height: `${hostHeight}px` }" />
    </div>
    <!-- one invisible v-click per step reserves the clicks -->
    <span v-for="n in steps.length" :key="n" v-click class="mc-marker" aria-hidden="true" />
  </div>
</template>

<style>
.mc {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--slidev-code-background);
  box-shadow: 0 1px 0 var(--shadow);
}
.mc-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--line);
  background: var(--fg-3);
}
.mc-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--fg-15);
}
.mc-file {
  margin-left: 10px;
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.06em;
  color: var(--muted-foreground);
}
.mc-step {
  display: flex;
  gap: 12px;
  align-items: baseline;
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.04em;
}
.mc-step-n {
  color: var(--brand-text);
  font-weight: 600;
}
.mc-step-l {
  color: var(--muted-foreground);
}
.mc-pad {
  padding: 12px 0;
}
.mc-marker {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

/* make Monaco sit on the template's code surface */
.mc .monaco-editor,
.mc .monaco-editor-background,
.mc .monaco-editor .margin,
.mc .monaco-editor .inputarea.ime-input {
  background-color: var(--slidev-code-background) !important;
}
.mc .monaco-editor .line-numbers {
  color: var(--fg-47) !important;
}
.mc .monaco-editor .mc-dim {
  opacity: 0.38;
  transition: opacity 0.4s var(--ease-out);
}
.mc .monaco-editor .mc-hl {
  background: var(--brand-wash);
}
.mc .monaco-editor .mc-hl-gutter {
  width: 3px !important;
  margin-left: 4px;
  background: var(--brand);
}
</style>
