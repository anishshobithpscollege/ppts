# HTTP QUERY Method — seminar deck (Slidev)

M.E. CyberSecurity technical seminar, MSIS, MAHE Manipal. 27 slides, ~18 min + Q&A.

Built on the MSIS "Seminar Template 2026-27": same section order (Title, Presentation Outline,
1. Introduction, 2. Objectives, 3. Literature Review, 4. Description, Conclusion, References,
Queries & Suggestions, Thank You), same logo / double orange rule / footer, same fonts
(Calibri, Arial, Courier New) and colours, widened from 4:3 to 16:9.

- `pnpm install` then `pnpm dev`, which opens http://localhost:3030
- Presenter view (timed notes, click-synced): http://localhost:3030/presenter/
- Content: `slides.md`. Template chrome: `slide-bottom.vue` (logo, rule, footer, slide number),
  `layouts/default.vue` (section title + body frame), `style.css` (fonts, colours, positions).
- The GET → POST → QUERY animation is `components/QueryMorph.vue`.
- Carlito (Calibri's metric-compatible twin) is bundled, so the deck looks the same on machines
  without Microsoft Office; where Calibri is installed it is used directly.

## Exports

```bash
pnpm exec slidev export --output HTTP_QUERY_CyberSecurity_Seminar.pdf
pnpm exec slidev export --with-clicks --output HTTP_QUERY_CyberSecurity_Seminar_click-steps.pdf
pnpm exec slidev export --format pptx-editable --with-clicks=false --output HTTP_QUERY_CyberSecurity_Seminar.pptx
pnpm exec slidev export --format pptx-editable --with-clicks --output HTTP_QUERY_CyberSecurity_Seminar_click-steps.pptx
python3 scripts/pptx-widescreen.py HTTP_QUERY_CyberSecurity_Seminar.pptx HTTP_QUERY_CyberSecurity_Seminar_click-steps.pptx
```

The last step turns Slidev's 10 × 5.625 in PowerPoint into 13.33 × 7.5 in widescreen, so font
sizes read exactly as in the template (28 pt titles, 20 pt text), and names Calibri instead of Carlito.
