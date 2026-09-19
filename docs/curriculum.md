# Curriculum — Word Clone Frontend Track (AKSHAT)

Goal: **good, not decent**. Order = easiest first, each row tied to the feature where it's taught.
Level = starting teaching level (L1 Teach → L4 Retrieve). Status lives in `learning-progress.md`.

## Phase 0 — Done (reference)
| # | Topic | Taught via |
|---|-------|-----------|
| 0.1 | `box-sizing`, box model, `margin: 0 auto` centering | Legal sheet |
| 0.2 | Inline style vs stylesheet, lib-owned width/padding | Pagination fight |
| 0.3 | SSR default + `ssr=false` + dynamic `import()` + `onMount` client-only | SSR 500 crash |
| 0.4 | Svelte scoped CSS + `:global()` | Sheet guard |
| 0.5 | Reading lib source (`dist/`) + docs as spec | Pagination spike |

## Phase 1 — Ribbon chrome (current)
| # | Topic | Level | Taught via |
|---|-------|-------|-----------|
| 1.1 | Components: files, imports, composition (`TopBar`/`TabBar`/`Ribbon` in `+page.svelte`) | L1 | TopBar |
| 1.2 | `props` (`$props()`): data down (filename, activeTab) | L1 | TopBar, Ribbon |
| 1.3 | `$state`: local state (`activeTab`) | L1 | TabBar |
| 1.4 | `{#each}`: rendering tab list from array | L1 | TabBar |
| 1.5 | `onclick` handlers + functions (JS basics: `let/const`, functions, arrays) | L1 | TabBar |
| 1.6 | `{#if}`: belt content per tab | L1 | Ribbon |
| 1.7 | Flexbox: rows, groups, labels (Word-style grouped belt) | L1 | Ribbon |
| 1.8 | `disabled` + `title` tooltips, hover styles, placeholder discipline | L2 | Ribbon placeholders |

## Phase 2 — Wiring editor (next)
| # | Topic | Level | Taught via |
|---|-------|-------|-----------|
| 2.1 | Lifting state up: callback prop (`onEditorReady`) to share editor instance | L1 | Size selector |
| 2.2 | `Object.entries` + `<select>`/`bind:value` for `PAGE_SIZES` options | L1 | Size selector |
| 2.3 | Tiptap chains: `editor.chain().focus().updatePageSize(s).run()` | L1 | Size switch |
| 2.4 | Events up: child notifies parent (size change → status text) | L2 | Save-status placeholder |

## Phase 3 — Later (in order)
| # | Topic | Taught via |
|---|-------|-----------|
| 3.1 | Tiny shared store (replace prop-drilling when it hurts) | ribbon-wide state |
| 3.2 | TypeScript basics: `interface`/`type` for `PageSize`, component props | size options |
| 3.3 | JS browser APIs: `document`, `window`, `localStorage` (persist filename/size) | save draft |
| 3.4 | `@media print` CSS (hide chrome, show pages) | printing |
| 3.5 | Manual test habits: overflow paste, resize, console errors | every feature |
| 3.6 | `updateMargins`, custom header/footer per page | Layout tab v2 |

## Progression rule
New topic → L1. Used once with help → `practiced`, L2. Used twice → L3. Own-words explanation + unaided use → `learned`, L4 retrieval only.
