# Learning Progress — AKSHAT (updated after every session)

Statuses: `unseen` → `introduced` (seen with full help) → `practiced` (used with help) → `learned` (own-words + unaided once).

## Learned (retrieve only, never re-teach)
| Topic | Evidence | Learned |
|-------|----------|---------|
| Flex constraint propagation (rationing reaches direct children only; middle layers forward via `flex:1` + `min-height:0`) | Diagnosed `.app` break unaided ("flex:1, direct child, not grandchildren") + named mechanism | 2026-09-17 |

## Practiced (retrieve before re-teaching)
| Topic | Evidence | Last touched |
|-------|----------|--------------|
| Box model + `box-sizing: border-box` | Chose `816` stays `816`; predicted overflow numbers with help | 2026-09-16 |
| Inline style beats stylesheet (lib owns width/padding) | Diagnosed `1010px` fight; removed `8.5in/14in/1in` | 2026-09-16 |
| Pagination model (`Decoration.widget` overlay, continuous doc) | Explained back why gradient failed | 2026-09-16 |
| SSR default + `ssr=false` + dynamic `import()` | Asked sharp why-questions; hasn't yet explained back | 2026-09-16 |
| `pageBreakBackground` = outside color, never transparent | Lived the transparent backfire + fix | 2026-09-16 |
| Svelte scoped CSS + `:global()` | Sheet guard + gap rules via `:global` | 2026-09-16 |
| Reading lib `dist/` source as spec | Traced gap paint to `PaginationPlus.js:626` | 2026-09-16 |
| Flexbox row (`display:flex`, `justify-content`, `align-items`) | TopBar GAP-1 completed unaided from spec | 2026-09-17 |
| Component import + render in route | Wired `TopBar` into `+page.svelte` (GAP-3) unaided | 2026-09-17 |
| Button element + `class` + boolean `disabled` + `title` | TopBar Save button (missed `disabled`/`title` first pass, fixed on review) | 2026-09-17 |
| `{#each}` list rendering | TabBar tabs loop (missing `{tab}` text first pass, fixed on review) | 2026-09-17 |
| Viewport units + `overflow` + flex column shell | App-shell slices (built with guidance) | 2026-09-17 |
| `onclick` + handler function | TabBar `selectTab` (merged `class:active` into handler first pass, fixed on review) | 2026-09-17 |
| `class:active` conditional styling | TabBar active pill (same fix as above) | 2026-09-17 |

## Introduced (teach fully next time seen)
| Topic | Evidence |
|-------|----------|
| `$state` / `$props` / `bind:this` | Present in `Tiptap.svelte` (written with help, not yet explained back) |
| `PAGE_SIZES` shape (`pageHeight/pageWidth`) | Fixed `.height` bug with guidance |
| Tiptap `Editor` lifecycle (`onMount`/`onDestroy`) | In place, not yet explained back |
| `updatePageSize` command chain | Read in docs, never used |

## Unseen (curriculum Phase 1+)
`{#each}`, `{#if}`, `onclick` handlers, components/`props` authorship, flexbox grouping, `Object.entries` + `<select>`, lifting state up, stores, TS types, `localStorage`, print CSS.

## Retrieval log
| Date | Quizzed | Result |
|------|---------|--------|
| 2026-09-17 | Which layer to suspect if chrome scrolls away (`.app`? which line?) | Correct: `flex:1` + direct-children-only reasoning; `min-height:0` co-role flagged as gap, follow-up open |

## Session notes
| Date | Note |
|------|------|
| 2026-09-16 | Ribbon v1 locked: native `<select>` for size (custom menu later), File = fake button, Legal stays default, `+page.svelte` owns `activeTab` + `editor`. AKSHAT learned what native `<select>` and state ownership mean (L1). Next: Slice 1 `TopBar.svelte` static Attempt. |
| 2026-09-17 | Scroll trap built + `.app` forwarding bug lived and fixed. First topic marked `learned` (flex propagation). Open: wiring Attempt (`onEditorReady` → live `updatePageSize`), `min-height:0` follow-up. |
