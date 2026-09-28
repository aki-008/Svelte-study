# Future Bugs & Features (MVP-excluded, parked with evidence)

## Bugs (accepted for MVP, fix with real-user evidence)

### 1. Straddling paragraphs stretch across page gutters
- Symptom: a `<p>` starting near a page bottom renders straight through the break band onto the next page (DevTools: one box spanning the gutter), pooling whitespace at page bottoms.
- Cause: overlay pagination cuts at fixed arithmetic heights with no knowledge of node positions (verified: survives margin-0, spacing tame, zone restoration — it's architectural, not settings).
- Tried: paragraph spacing 16px→6px (shrinks each stretch ~26px, doesn't remove), header/footer zone restoration.
- Options when revisited: (a) snap cuts between blocks (needs lib hooks that don't exist — effectively a fork), (b) fork layout engine, (c) content-splitting pagination (separate editor per page — rebuild).
- Bar to reopen: a real user loses real work to it (content loss, not aesthetics).

### 2. Header/footer options (placeholder entry — expand when scoped)
- Footer text currently emptied for testing (`footerRight: ''`); zones render for margins.
- Future: per-page header/footer content, toggles, first-page-different.

## Parked features (decided, not started)

- **Lists mapping** (`bulletList`/`orderedList` → docx numbering) + Home list buttons. Degrade-to-paragraph is today's correct behavior.
- **Tables & images** (editor UI + mapper, each its own slice).
- **`.docx` import** (OOXML parsing — the iceberg; export-only until then).
- **Print CSS** (`@media print`: hide chrome, show pages; headers/footers won't print per lib limits).
- **Custom size dropdown** (Word-style menu replacing native `<select>`; needs click-outside handling).
- **Narrow-size treatment** (A5 removed; A3-wide overflow open — zoom-to-fit or horizontal scroll TBD).
- **Save-path memory** (Save vs Save-As; currently always-prompt).
- **Word margin verify** (P4: Narrow/Normal/custom readings in real Word — still unreported).
- **D1 gate rows** (styled headings/marks + list-degrade in real Word — partially reported, not matrixed).
