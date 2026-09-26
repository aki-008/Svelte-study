# Foundations Checklist — before second dev joins (AKSHAT)

Rule: nothing merges unless `npm run check` (0 errors) + `npm run build` (green) pass.
Each item lists concrete acceptance criteria, not vibes.

## 1. Shared page-spec module (`src/lib/pageSpecs.ts`)
- [ ] One module exports per-size `{ width, height, margins }` in px + `twips()` helper + `SIZE_KEYS` list.
- [ ] `Tiptap.svelte` initial config imports from it (no inline `816/1344/96` literals).
- [ ] `Ribbon.svelte` `EXACT` map deleted; handler reads the module.
- [ ] `exportDocx.ts` `LEGAL_SECTION` derived from it (per-size sections later).
- [ ] `Ribbon` dropdown options derived from its key list (A5 stays excluded via one exported constant).
- [ ] Test: switch every size → DevTools `--rm-page-width` matches module values exactly.

## 2. Shared editor store (`src/lib/editorStore.ts`)
- [ ] Store holds `{ editor, activeTab, pageSize, filename, saveStatus }` (Svelte 5 shared `$state` class or runes-based store).
- [ ] Exactly ONE creation site: `Tiptap.svelte` `onMount` writes it; `onDestroy` clears it (no double-init possible).
- [ ] `+page.svelte` prop-threading for `editor`/`activeTab` removed; components read the store.
- [ ] `Ribbon`, `TopBar`, future ruler read from store; no new props added for shared facts.
- [ ] Test: reload → all components see the editor; destroy/remount (HMR) never duplicates it.

## 3. Mapper tripwire (first test file)
- [ ] Test runner added (`vitest` recommended; pure functions, no DOM needed).
- [ ] One test per StarterKit node in use (doc/paragraph/heading/text/bold/italic/bulletList/listItem): maps without throwing, text preserved.
- [ ] Unknown node test: degrades to plain paragraph, no throw.
- [ ] `npm run check`-adjacent script (`npm test`) documented in ARCHITECTURE.md.

## 4. Shared command functions (`src/lib/commands.ts`)
- [ ] `setPageSize(key)`, `setMargins(...)`, `indent()/outdent()`, `setAlignment(...)` live here — one function per action.
- [ ] Ribbon handlers call them (no inline `editor.chain()` in components except via these).
- [ ] Future ruler drags will call the same functions (note in ARCHITECTURE.md).
- [ ] Guards inside (`!editor` → no-op, unknown key → no-op), not scattered across callers.

## 5. `docs/ARCHITECTURE.md` (friend reads this day one)
- [ ] JSON-source-of-truth diagram (ProseMirror JSON → screen projection + docx projection).
- [ ] Parity rule: every rendered node maps; unknowns degrade, never throw.
- [ ] Data flow: store-first, props only for local UI facts; callback pattern retired where store fits.
- [ ] Capabilities workflow: how to add a Tauri permission (CLI + narrow in `default.json`).
- [ ] Branch rule: feature branches, green `check`+`build` before merge.
- [ ] Pointer to `docs/` vs `learning/` split.

## 6. Branch discipline + CI gate
- [ ] Repo hosted (GitHub) with `main` protected (or agreed equivalent).
- [ ] Every push runs `check` + `build` automatically (GitHub Action or documented manual gate if CI deferred).
- [ ] Red merges refused — no exceptions, no "I'll fix it after."

## Explicitly parked (not this list)
Lists/tables/images mapping, indent extension, rulers, `.docx` import, print CSS, custom size dropdown.
