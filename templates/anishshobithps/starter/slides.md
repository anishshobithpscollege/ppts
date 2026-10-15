---
theme: {{THEME}}
title: '{{TITLE_YAML}}'
author: '{{AUTHOR_YAML}}'
info: |
  {{TITLE}}. Built on the anishshobithps template.
duration: 5min # drives the presenter timer
exportFilename: {{NAME}}
download: true # adds a PDF download button to the built site
layout: cover
kicker: Talk · {{YEAR}}
---

# {{TITLE}}

<p class="lead">One sentence that says what this talk gives the room.</p>

<div class="byline mono"><span>{{AUTHOR}}</span><span>{{YEAR}}</span></div>

::right::

<IsoStack
  :slabs="[
    { label: 'base', w: 7, d: 4.6 },
    { label: 'layer', tone: 'lit', w: 5.4, d: 3.6 },
  ]"
  :scale="38"
  mascot
/>

<!--
⏱ 0:15

SAY: Hello. This talk is about ...

NEXT → The problem.
-->

---
layout: default
section: The problem
---

# One idea per slide.

<p class="lead">Use <mark>marks</mark> sparingly. Click steps rise in like the site's sections do.</p>

<div class="grid">
  <Card v-click label="First" tone="lit">Short sentence. <Pill tone="brand">tag</Pill></Card>
  <Card v-click label="Second">Another short sentence.</Card>
</div>

<!--
⏱ 0:30
-->

---
layout: split
section: Code
cols: 1fr 1fr
---

# Code goes in a card.

```bash
echo "shiki, github-light / github-dark"
```

::right::

<Terminal title="~/talk">
  <div class="ln"><span class="t-prompt">$</span> ./run.sh</div>
  <div v-click class="ln"><span class="t-ok">done</span><span class="t-cursor" /></div>
</Terminal>

---
layout: end
---

<div class="end-row">
  <Logo :size="190" waving eyes="happy" />
  <div>

# Thank you.

<p class="lead">Questions? <span class="muted">{{AUTHOR}}</span></p>

  </div>
</div>
