# Indent Extension (`src/lib/indent.ts`) — Reference

Custom Tiptap extension: per-block `indent` (whole-block left margin) + `firstLine`
(first-line-only text indent) attributes on paragraphs and headings.

## Units

Twips everywhere (1/1440in, integers). `STEP = 360` (0.25in), `MAX = 8640` (6in).
UI converts at boundaries (inches ×96 UI side, twips straight through to docx).

## Attributes (global, paragraphs + headings)

| Attr | Default | Renders as | Reads back from |
|------|---------|-----------|-----------------|
| `indent` | 0 | `margin-left` | `element.style.marginLeft` |
| `firstLine` | 0 | `text-indent` | `element.style.textIndent` |

Round trip or corruption: every `renderHTML` has a mirror `parseHTML`.

## Commands

| Command | Behavior |
|---------|----------|
| `indent()` | State-machine decider (see below) |
| `outdent()` | Mirror unwind (see below) |
| `indentFirstLine()` / `outdentFirstLine()` | Blind ±STEP (ruler/direct use) |

Registered twice: `addCommands` (runtime) + `declare module Commands` (types) —
both required or other files can't compile calling them.

## Tab state machine (`indentDecider`)

Needs cursor-line detection (`isOnFirstLine`: cursor top within one line-height,
minus 1px font-metric epsilon, of paragraph top via `coordsAtPos`).

- Cursor line 1 + `firstLine == 0` → `firstLine = STEP` (one-shot, never accumulates)
- Cursor line 1 + `firstLine > 0` → left `+= STEP`, **no absorption**
- Cursor line 2+ → left `+= STEP`; if new left **meets-or-passes** `firstLine (>0)` → clear `firstLine`

## Outdent mirror

- Line 1 + `firstLine > 0` → clear `firstLine` only (toggle at any left level)
- Else `indent > 0` → unwind one step
- Else `firstLine > 0` → clear it; else swallow (keep focus)

## Shortcuts

Tab → `indent()` (lists pass through to nesting); Shift-Tab → `outdent()`.

## Invariants

1. `firstLine ∈ {0, STEP}` via Tab (ruler may set arbitrary levels later).
2. Absorption is non-first-line only + meet-or-pass (exact-match strands doubles).
3. Targeting is explicit (`$from` ancestor walk + `setNodeMarkup`) — never
   `updateAttributes` (its traversal wrote paragraph 1 regardless of cursor).
4. Mapper reads both attrs; omit-when-default each independently.
