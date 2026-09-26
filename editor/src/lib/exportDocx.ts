import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";

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

export async function exportEditorDocx(docJson: PMDoc): Promise<string | null> {
  const doc = new Document({
    sections: [{ ...LEGAL_SECTION, children: jsonToDocxChildren(docJson) }],
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
  attrs?: { level?: number };
  content?: PMtext[];
};

type HeadingStyle = (typeof HeadingLevel)[keyof typeof HeadingLevel];

const HEADINGS: Record<number, HeadingStyle> = {
  1: HeadingLevel.HEADING_1,
  2: HeadingLevel.HEADING_2,
};

function toParagraph(node: PMBlock): Paragraph {
  const runs = (node.content ?? []).map(toRun);
  if (node.type === "heading")
    return new Paragraph({
      heading: HEADINGS[node.attrs?.level ?? 0],
      children: runs,
    });
  return new Paragraph({ children: runs });
}

export type PMDoc = {
  type: string;
  content?: PMBlock[];
};

const twips = (inches: number): number => Math.round(inches * 1440);

const LEGAL_SECTION = {
  properties: {
    page: {
      size: { width: twips(8.5), height: twips(14) },
      margins: {
        top: twips(1),
        bottom: twips(1),
        left: twips(1),
        right: twips(1),
      },
    },
  },
};
export function jsonToDocxChildren(doc: PMDoc): Paragraph[] {
  const assemble = (doc.content ?? []).map(toParagraph);
  return assemble;
}
