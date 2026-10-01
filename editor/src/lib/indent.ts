import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
      indentFirstLine: () => ReturnType;
      outdentFirstLine: () => ReturnType;
    };
  }
}

const STEP = 360; // 0.25in in twips
const MAX = 8640; // 6in in twips

const clamp = (n: number) => Math.max(0, Math.min(MAX, n));

// Shared first-line detector: cursor within one line-height of the
// paragraph's top edge (minus 1px epsilon for font-metric offset).
const isOnFirstLine = (editor: any, $from: any, d: number): boolean => {
  const view = editor.view;
  const cursorTop = view.coordsAtPos($from.pos).top;
  const paraTop = view.coordsAtPos($from.before(d)).top;
  const paraEl = view.nodeDOM($from.before(d)) as HTMLElement;
  const fontSize = parseFloat(getComputedStyle(paraEl).fontSize) || 16;
  const lineHeight =
    parseFloat(getComputedStyle(paraEl).lineHeight) || fontSize * 1.2;
  return cursorTop - paraTop < lineHeight - 1;
};

export const Indent = Extension.create({
  name: "indent",

  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading"],
        attributes: {
          indent: {
            default: 0,
            renderHTML: ({ indent }) => ({
              style: `margin-left: ${(indent / 1440) * 96}px`,
            }),
            parseHTML: (element) => ({
              indent: Math.round(
                (parseFloat(element.style.marginLeft || "0") / 96) * 1440,
              ),
            }),
          },
          firstLine: {
            default: 0,
            renderHTML: ({ firstLine }) => ({
              style: `text-indent: ${(firstLine / 1440) * 96}px`,
            }),
            parseHTML: (element) => ({
              firstLine: Math.round(
                (parseFloat(element.style.textIndent || "0") / 96) * 1440,
              ),
            }),
          },
        },
      },
    ];
  },

  addCommands() {
    const nudge =
      (key: "indent" | "firstLine", dir: 1 | -1) =>
      ({ tr, state, dispatch }: any) => {
        // Resolve the target block explicitly from the cursor: walk up from
        // the cursor's depth to the nearest paragraph/heading and stamp it.
        // (Replaces updateAttributes, whose internal traversal kept landing
        // writes on the first paragraph regardless of cursor.)
        const { $from } = tr.selection;
        for (let d = $from.depth; d >= 0; d--) {
          const node = $from.node(d);
          if (node.type.name === "paragraph" || node.type.name === "heading") {
            const cur = Number((node.attrs as any)[key] ?? 0);
            if (dispatch) {
              tr.setNodeMarkup($from.before(d), undefined, {
                ...node.attrs,
                [key]: clamp(cur + dir * STEP),
              });
            }
            return true;
          }
        }
        return false;
      };
    const indentDecider = ({ tr, state, dispatch, editor }: any) => {
      const { $from } = tr.selection;
      for (let d = $from.depth; d >= 0; d--) {
        const node = $from.node(d);
        if (node.type.name === "paragraph" || node.type.name === "heading") {
          const attrs = node.attrs as any;
          const cur = Number(attrs.indent ?? 0);
          const first = Number(attrs.firstLine ?? 0);
          const onFirstLine = isOnFirstLine(editor, $from, d);
          let nextIndent = cur;
          let nextFirst = first;
          let note = "";
          if (onFirstLine && first === 0) {
            // Fresh first line: one-shot first-line indent (never accumulates).
            nextFirst = STEP;
            note = "[firstline]";
          } else if (onFirstLine) {
            // First line already has its level: grow left only, never absorb.
            // Absorption is non-first-line only.
            nextIndent = clamp(cur + STEP);
          } else {
            // Non-first-line cursor: grow left; absorb firstLine once left
            // meets OR passes it. Exact-match alone can fire at most once
            // per cycle (indent overshoots firstLine permanently after),
            // stranding a double indent forever — meet-or-pass kills it.
            nextIndent = clamp(cur + STEP);
            if (nextIndent >= first && first > 0) {
              nextFirst = 0;
              note = "[absorbed]";
            }
          }
          if (dispatch) {
            tr.setNodeMarkup($from.before(d), undefined, {
              ...attrs,
              indent: nextIndent,
              firstLine: nextFirst,
            });
          }
          console.log(
            "INDENT",
            "margin-left:",
            (nextIndent / 1440) * 96,
            "text-indent:",
            (nextFirst / 1440) * 96,
            onFirstLine ? "line 1" : "line 2",
            note,
          );
          return true;
        }
      }
      return false;
    };
    const outdentDecider = ({ tr, state, dispatch, editor }: any) => {
      const { $from } = tr.selection;
      for (let d = $from.depth; d >= 0; d--) {
        const node = $from.node(d);
        if (node.type.name === "paragraph" || node.type.name === "heading") {
          const attrs = node.attrs as any;
          const cur = Number(attrs.indent ?? 0);
          const first = Number(attrs.firstLine ?? 0);
          const onFirstLine = isOnFirstLine(editor, $from, d);
          let nextIndent = cur;
          let nextFirst = first;
          let note = "";
          if (onFirstLine && first > 0) {
            // Toggle first-line off directly; left indent untouched.
            // This is what makes first-line toggleable at every level.
            nextFirst = 0;
            note = "[cleared firstline]";
          } else if (cur > 0) {
            nextIndent = clamp(cur - STEP);
          } else if (first > 0) {
            nextFirst = 0;
            note = "[cleared firstline]";
          }
          if (dispatch) {
            tr.setNodeMarkup($from.before(d), undefined, {
              ...attrs,
              indent: nextIndent,
              firstLine: nextFirst,
            });
          }
          console.log(
            "OUTDENT",
            "margin-left:",
            (nextIndent / 1440) * 96,
            "text-indent:",
            (nextFirst / 1440) * 96,
            onFirstLine ? "line 1" : "line 2",
            note,
          );
          return true;
        }
      }
      return false;
    };
    return {
      indent: () => indentDecider,
      outdent: () => outdentDecider,
      indentFirstLine: () => nudge("firstLine", 1),
      outdentFirstLine: () => nudge("firstLine", -1),
    };
  },

  addKeyboardShortcuts() {
    return {
      // Given (no gaps — study it, shortcuts arrive pre-taught next slice):
      Tab: ({ editor }) => {
        if (editor.isActive("listItem")) return false;
        return editor.commands.indent();
      },
      "Shift-Tab": ({ editor }) => editor.commands.outdent(),
    };
  },
});
