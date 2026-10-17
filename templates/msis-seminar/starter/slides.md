---
theme: {{THEME}}
title: '{{TITLE_YAML}}'
author: '{{AUTHOR_YAML}}'
info: |
  {{TITLE}}. Technical seminar, Manipal School of Information Sciences, MAHE, Manipal.
duration: 18min # 18 min talk + 2 min Q&A (college guideline); drives the presenter timer
exportFilename: {{NAME}}
download: {{NAME}}.pdf # download button on the built site; serves exports/{{NAME}}.pdf (from `pnpm export`)

# Title slide: every field below is printed by the `title` layout.
layout: title
kind: Technical Seminar
heading: # one entry per line, as in the template
  - '{{TITLE_YAML}}'
regno: Registration Number
programme: M.E. CyberSecurity
panel:
  - { role: 'Panel Member 1:', name: Name, designation: Designation }
  - { role: 'Panel Member 2:', name: Name, designation: Designation }
---

<!--
⏱ 0:20 (ends 0:20)

SAY: Good morning. My seminar is on ... (one or two sentences: topic and roadmap).

NEXT → Here is the outline.
-->

---
layout: outline
items:
  - 'Introduction: ...'
  - Objectives
  - 'Literature Review: ...'
  - 'Description: ...'
  - Conclusion
---

<!-- ⏱ 0:20 (ends 0:40) -->

---
section: 1. Introduction
tsize: 36
frame: intro
---

# Topic line in brown under the section title

<ul class="bul">
  <li>First point</li>
  <li>Second point
    <ul class="bul">
      <li>Sub-point (the template uses an en dash here)</li>
    </ul>
  </li>
  <li v-click>Appears on click</li>
</ul>

<!--
⏱ 1:00 (ends 1:40)

SAY: ...

[click] ...

NEXT → ...
-->

---
section: 2. Objectives
frame: obj
---

<ul class="bul obj">
  <li>Objective one</li>
  <li>Objective two</li>
  <li>Objective three</li>
</ul>

<style>
.obj { margin-top: 18px; }
.obj > li { font-size: 24px; margin-top: 16px; }
</style>

---
section: 3. Literature Review
frame: lit
---

<table class="tbl lit">
  <colgroup><col style="width: 23.2%"><col style="width: 21.9%"><col style="width: 26.9%"><col style="width: 28%"></colgroup>
  <thead><tr><th>Authors and Title</th><th>Dataset</th><th>Purpose of Study</th><th>Key Findings</th></tr></thead>
  <tbody>
    <tr><td>A. Author, B. Author, “<a href="https://example.org">Paper title</a>,” Venue, 2026</td><td>What data the study used</td><td>What the study set out to do</td><td>What it found</td></tr>
    <tr><td>C. Author, “<a href="https://example.org">Another paper</a>,” Venue, 2025</td><td>...</td><td>...</td><td>...</td></tr>
  </tbody>
</table>

---
section: 4. Description
frame: desc
---

# Topic line

<ul class="bul">
  <li>Point</li>
</ul>

<!--
Cards, flow nodes and tables are available as .card / .cd-lav, .node + .arrow, .tbl.
See templates/msis-seminar/README.md.
-->

---
section: Conclusion
frame: concl
---

<ul class="bul">
  <li>Takeaway one</li>
  <li>Takeaway two</li>
</ul>

---
section: References
frame: refs
---

<div class="refs">
  <p><span>[1]</span>A. Author, “<a href="https://example.org">Title</a>,” Venue, 2026.</p>
  <p><span>[2]</span>B. Author, “<a href="https://example.org">Title</a>,” Venue, 2025.</p>
</div>

---
layout: queries
---

<!--
⏱ Q&A (2–3 min)

Likely questions and short answers:

• "..." ...
-->

---
layout: thank-you
---
