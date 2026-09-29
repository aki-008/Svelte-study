# Development Journal — Word Clone (AKSHAT, solo backend dev learning frontend)

Chronological: what we built, what broke, what fixed it, what's still open.
Companion docs: `instructions.md` (how we work), `curriculum.md` (what's taught),
`learning-progress.md` (AKSHAT's skill log), `foundations-checklist.md` (pre-teammate),
`future-bugs-N-features.md` (parked items).

## Phase 0 — Legal scaffold (start)

- Built single centered Legal page in `Tiptap.svelte`: grey `.background` + white
  `.editor-page` (`8.5in × 14in`, `1in` padding, `box-sizing: border-box`, `margin: 0 auto`).
- Bug: `bind:this={element},` trailing comma → Svelte directive parse error. Fix: remove comma.
- Bug: `color: grey` on wrapper painted text, not background. Fix: `background-color`.

## Phase 1 — Pagination gap attempts

- Attempt: `repeating-linear-gradient` fake page cuts. Failed: background is paint-only,
  text writes straight through gaps. Lesson logged: real breaks need layout, not paint.
- Decision: spike `tiptap-pagination-plus@3.1.0` (supports Tiptap v3, has `PAGE_SIZES.LEGAL`).

## Phase 2 — Pagination spike + fights

- `PAGE_SIZES.LEGAL` = `818×1404`, not true Legal `816×1344` (preset drift — taught preset-vs-exact).
- Bug: lib `onCreate` writes `width` + `padding` inline, fighting our stylesheet CSS
  (`818+96+96 = 1010px` overflow). Fix: stripped our width/padding, kept
  `box-sizing/margin/background` guard; Attempt A (outer transparent tray, inner sheet owns styling).
- Bug: `dist/index.js` misses `.js` extensions → Vite SSR `500 ERR_MODULE_NOT_FOUND`.
  Fix: dynamic `import()` in `onMount` + route `ssr=false` (later global under Tauri).
- Gap color saga: `transparent` gap showed container white (invisible breaks) → set
  `pageBreakBackground` = outside color; then whole `.breaker` band grey painted
  header/footer zones too → narrowed to gap strip only so 1in margins stay white paper.
- Footer `{page}` renders via CSS counter; header/footer heights auto-measured.

## Phase 3 — Ribbon chrome (TopBar/TabBar/Ribbon)

- TopBar (filename placeholder + fake Save), TabBar (`{#each}` + `activeTab` + click),
  Ribbon (Word-style labeled groups, placeholders), Layout Size `<select>` (native first).
- State ownership lesson: `activeTab` lifted TabBar → `+page.svelte` (noticeboard pattern).
- Wiring: `onEditorReady` callback prop lifts the `Editor` instance to the page.
- Bug: `PAGE_SIZES['Letter']` undefined (title-case vs UPPER keys) → lib threw reading
  `.pageHeight`, size "stuck" until reload. Fix: derive options from `Object.entries(PAGE_SIZES)`
  (single source of truth) + `if (!size)` guard + synced `currentSize` display.

## Phase 4 — App-shell scroll trap

- Goal: chrome pinned, only grey viewport scrolls. Built: body lock → `.shell` 100vh column
  → `.background` trap (`flex:1`, `min-height:0`, `overflow-y:auto`) → chrome `flex:none`.
- Bug: trap dead — `.background` is the *grandchild*; middle layer `.app` (unstyled) grew
  past viewport, window scrollbar murdered → stuck with chrome pushed away.
  Fix: `.app { display:flex; flex-direction:column; flex:1; min-height:0 }` forwards the budget.
- Lesson learned (AKSHAT, unaided diagnosis): flex constraints reach direct children only.

## Phase 5 — Tauri 2 migration

- Moved to clean Tauri+SvelteKit template (`adapter-static` SPA, global `ssr=false`).
- Deleted dead `demo/` server routes (imported removed backend — build-breaker).
- Removed template `@ts-expect-error`; window `1100×900` (+maximized), bundle `nsis`-only.
- `check` 0/0, `build` green; smoke test passed in webview.

## Phase 6 — Docx save track (export-only contract)

- Installed `docx@9.7.2` (browser-safe) + `plugin-fs`/`plugin-dialog`; capabilities narrowed
  to `allow-write/read-text-file`, `allow-write-file` (binary needs its own door), `allow-save`.
- D0 spike (hardcoded file opens clean in Word) → mapper pipeline:
  `toRun` (text+marks) → `toParagraph` (blocks+headings) → assembly + Legal sectPr → `handleSave`.
- Typing lessons banked: `unknown` rejects, `typeof`+indexed access, index-signature fix.
- Bug: exporter used hardcoded `LEGAL_SECTION` (everything saved as Legal/1in).
  Fix: read live `editor.storage.PaginationPlus` (4th truth converges into the 1st).
- Bug: `getJOSN()` typo; GAP-2 half-applied (JSON fed to Editor-typed param) — both compiler-caught.
- Open: P4 Word matrix (Narrow/zero/A4+Legal readings) — AKSHAT to run.

## Phase 7 — Margins track (in progress)

- `MARGIN_PRESETS` (Normal/Narrow/Moderate/Wide) + `currentMargins`/`currentPreset` +
  shared `applyMargins`; Rule A (size switches keep margin choice).
- Native preset dropdown + custom inch inputs (`bind:value`, ×96 boundary, `Custom` flag).
- Straddle saga (screenshot-verified): paragraphs crossing gutters stretch (spacing was
  amplifier: 16px→6px; testing `display:none` had killed top/bottom margins — restored).
- Decision: straddles accepted for MVP (overlay cuts blind to nodes; snapping needs lib fork).
  Parked in `future-bugs-N-features.md` with reopen bar (real user work loss).
- Pending: header/footer optional-content control; cut-snapping only on evidence.

## Pending threads (checked against tree)

- P4 Word matrix + D1 gate rows (AKSHAT runtime session).
- Foundations checklist (6 items, for second dev).
- Lists/tables/images mapping; `.docx` import (parked iceberg); print CSS; custom dropdown;
  A3-wide overflow verdict; save-path memory; A5-cause note.

## Phase 9 — Alignment end-to-end (closed 2026-09-20)

- C1: `@tiptap/extension-text-align` + `types` config + four Home buttons (guard/chain/active-pill);
  fixed `Alingment` typo, stray `</div>` orphaning Layout, duplicate `alignText` pasted into
  Tiptap.svelte (5 phantom errors — lesson: read the filename in check output first).
- C2: mapper `alignment` via enum drawer (`ALIGN_MAP`), omit-when-default; all four verified in Word.
- Saga notes: docs-first instinct praised (enum over magic strings); root cause was misspelled
  property KEY (`alingment`) — silent-key family 3rd instance; fix-then-harden order observed
  (prove transfer before beautifying). Nit open: hoist `ALIGN_MAP` to module scope.

## Phase 8 — Margin-transfer bug hunt (closed 2026-09-20)

- Symptom: page size reached the Word file, margins always saved as 1 inch no matter the UI.
- Dead ends, in order: comparing against old saved files by mistake (fixed by unique filenames),
  UI-to-editor delivery failure (console proved delivery worked), exporter code shape (checked twice).
- Root cause: the docx library v9 renamed its margins setting to singular `margin`; our code sent
  the old plural `margins`, which the library silently ignored and filled with defaults instead
  (proof: even header/footer values we never set appeared — untouched-defaults signature).
  Size worked because its setting name never changed. Confirmed in the installed type file + official docs.
- Fix: one word (`margins:` → `margin:`). Proved by A3+Wide unzip reading exact expected numbers.
- Durable lesson: the type-checker doesn't catch misspelled settings smuggled through spread
  (`...object`) — green checks don't mean spelled-right keys. Check new library settings against
  the installed type file, and prove with one real output.
