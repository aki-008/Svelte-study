import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
  }
}

const STEP = 360; // 0.25in in twips
const MAX = 8640; // 6in in twips

const clamp = (n: number) => Math.max(0, Math.min(MAX, n));

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
        },
      },
    ];
  },

  addCommands() {
    const nudge =
      (dir: 1 | -1) =>
      ({ tr, state, dispatch }: any) => {
        // Resolve the target block explicitly from the cursor: walk up from
        // the cursor's depth to the nearest paragraph/heading and stamp it.
        // (Replaces updateAttributes, whose internal traversal kept landing
        // writes on the first paragraph regardless of cursor.)
        const { $from } = tr.selection;
        for (let d = $from.depth; d >= 0; d--) {
          const node = $from.node(d);
          if (node.type.name === "paragraph" || node.type.name === "heading") {
            const cur = Number((node.attrs as any).indent ?? 0);
            if (dispatch) {
              tr.setNodeMarkup($from.before(d), undefined, {
                ...node.attrs,
                indent: clamp(cur + dir * STEP),
              });
            }
            return true;
          }
        }
        return false;
      };
    return {
      indent: () => nudge(1),
      outdent: () => nudge(-1),
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
