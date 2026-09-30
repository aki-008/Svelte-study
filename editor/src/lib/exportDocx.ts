import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import type { Editor } from "@tiptap/core";
import { Indent } from "./indent";

export async function exportHardcodedDocx(): Promise<string | null> {
  const doc = new Document({
    sections: [
      { children: [new Paragraph({ children: [new TextRun("Hello Word")] })] },
    ],
  });
  const blob = await Packer.toBlob(doc);
  const path = await save({
    defaultPath: "Untitled.docx",
    filters: [{ name: "Word", extensions: ["docx"] }],
  });
  if (!path) return null; // cancelled — the Cancel-safe rule
  await writeFile(path, new Uint8Array(await blob.arrayBuffer()));
  return path;
}

const pxToIn = (px: number) => px / 96;

export async function exportEditorDocx(editor: Editor): Promise<string | null> {
  const pg = editor.storage.PaginationPlus;
  const section = {
    properties: {
      page: {
        size: {
          width: twips(pxToIn(pg.pageWidth)),
          height: twips(pxToIn(pg.pageHeight)),
        },
        margin: {
          top: twips(pxToIn(pg.marginTop)),
          bottom: twips(pxToIn(pg.marginBottom)),
          left: twips(pxToIn(pg.marginLeft)),
          right: twips(pxToIn(pg.marginRight)),
        },
      },
    },
  };
  const doc = new Document({
    sections: [
      {
        ...section,
        children: jsonToDocxChildren(editor.getJSON() as unknown as PMDoc),
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  const path = await save({
    defaultPath: "Untitled.docx",
    filters: [{ name: "Word", extensions: ["docx"] }],
  });
  console.log(
    "Debug",
    "sect",
    pg.pageWidth,
    pg.pageHeight,
    pg.marginTop,
    pg.marginBottom,
    pg.marginLeft,
    pg.marginRight,
  );
  if (!path) return null; // cancelled — the Cancel-safe rule
  await writeFile(path, new Uint8Array(await blob.arrayBuffer()));
  return path;
}

type PMtext = { text: string; marks?: { type: string }[] };

function toRun(node: PMtext) {
  let bold = false,
    italics = false;
  for (const mark of node.marks ?? []) {
    if (mark.type === "bold") bold = true;
    if (mark.type === "italic") italics = true;
  }
  return new TextRun({ text: node.text, bold, italics });
}

type PMBlock = {
  type: string;
  attrs?: { level?: number; textAlign?: string; indent?: number };
  content?: PMtext[];
};

type HeadingStyle = (typeof HeadingLevel)[keyof typeof HeadingLevel];

const HEADINGS: Record<number, HeadingStyle> = {
  1: HeadingLevel.HEADING_1,
  2: HeadingLevel.HEADING_2,
};

function toParagraph(node: PMBlock): Paragraph {
  const runs = (node.content ?? []).map(toRun);
  const indentVal = node.attrs?.indent;
  const alignment = node.attrs?.textAlign;
  const ALIGN_MAP = {
    center: AlignmentType.CENTER,
    right: AlignmentType.RIGHT,
    justify: AlignmentType.JUSTIFIED,
    // left: AlignmentType.LEFT,
  } as const;

  const alignProp =
    alignment && alignment !== "left"
      ? { alignment: ALIGN_MAP[alignment as keyof typeof ALIGN_MAP] }
      : {};

  const indentProp =
    indentVal && indentVal > 0 ? { indent: { left: indentVal } } : {};

  if (node.type === "heading")
    return new Paragraph({
      heading: HEADINGS[node.attrs?.level ?? 0],
      children: runs,
      ...alignProp,
      ...indentProp,
    });
  return new Paragraph({ children: runs, ...alignProp, ...indentProp });
}

export type PMDoc = {
  type: string;
  content?: PMBlock[];
};

const twips = (inches: number): number => Math.round(inches * 1440);

export function jsonToDocxChildren(doc: PMDoc): Paragraph[] {
  const assemble = (doc.content ?? []).map(toParagraph);
  return assemble;
}
