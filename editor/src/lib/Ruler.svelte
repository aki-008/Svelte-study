<script lang="ts">
  import type { Editor } from "@tiptap/core";

  let { editor }: { editor: Editor | null } = $props();
  const pg = $derived(editor?.storage.PaginationPlus);
  let pageWidth = $derived(pg?.pageWidth ?? 816);
  let marginLeft = $derived(pg?.marginLeft ?? 96);
  let marginRight = $derived(pg?.marginRight ?? 96);
  let contentWidth = $derived(pageWidth - marginLeft - marginRight);

  // let ticks = $derived(
  //   Array.from({ length: Math.floor(pageWidth / 96) + 1 }, (_, i) => i * 96),
  // );

  let inchTicks = $derived(
    Array.from({ length: Math.floor(pageWidth / 96) + 1 }, (_, i) => ({
      pos: i * 96,
      label: i,
    })),
  );

  let subTicks = $derived(
    Array.from({ length: Math.floor(pageWidth / 24) + 1 }, (_, i) => ({
      pos: i * 96,
      label: i,
    })),
  );
  const clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, n));

  let drag = $state<{
    side: "left" | "right";
    startX: number;
    startLeft: number;
    startRight: number;
  } | null>(null);

  function markerDown(e: PointerEvent, side: "left" | "right") {
    if (!editor) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag = {
      side,
      startX: e.clientX,
      startLeft: marginLeft,
      startRight: marginRight,
    };
  }

  function markerMove(e: PointerEvent) {
    if (!drag || !editor) return;
    if (e.buttons === 0) {
      drag = null;
      return;
    }
    const dx = e.clientX - drag.startX;
    let newLeft = drag.startLeft;
    let newRight = drag.startRight;
    if (drag.side === "left") {
      newLeft = clamp(
        drag.startLeft + dx,
        0,
        pageWidth - drag.startRight - 200,
      );
    } else {
      newRight = clamp(
        drag.startRight - dx,
        0,
        pageWidth - drag.startLeft - 200,
      );
    }
    editor
      .chain()
      .focus()
      .updateMargins({
        top: pg?.marginTop ?? 96,
        bottom: pg?.marginBottom ?? 96,
        left: Math.round(newLeft),
        right: Math.round(newRight),
      })
      .run();
  }

  function markerUp() {
    drag = null;
  }
</script>

<div class="ruler" style="width: {pageWidth}px">
  <div class="zone margin" style="width: {marginLeft}px"></div>
  <div class="zone content" style="width: {contentWidth}px">
    {#each subTicks as t (t)}
      <div class="tick sub" style="left: {t}px"></div>
    {/each}
    {#each inchTicks as { pos, label } (pos)}
      <span class="tick num" style="left: {pos}px">{label}</span>
    {/each}
  </div>
  <div
    class="marker left"
    role="separator"
    aria-orientation="vertical"
    aria-label="Left margin"
    style="left: {marginLeft}px"
    title="Left margin — drag"
    onpointerdown={(e) => markerDown(e, "left")}
    onpointermove={markerMove}
    onpointerup={markerUp}
  ></div>
  <div
    class="marker right"
    role="separator"
    aria-orientation="vertical"
    aria-label="Right margin"
    style="left: {pageWidth - marginRight}px"
    title="Right margin — drag"
    onpointerdown={(e) => markerDown(e, "right")}
    onpointermove={markerMove}
    onpointerup={markerUp}
  ></div>
  <div class="zone margin" style="width: {marginRight}px"></div>
</div>

<style>
  .ruler {
    display: flex;
    margin: 0 auto;
    height: 12px;
    background: #2b2b2b;
    border-bottom: 1px solid #444;
  }
  .zone.margin {
    background: #1a1a1a;
  }
  .zone.content {
    background: #3a3a3a;
    position: relative;
  }
  .zone.content::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background: #555;
  }
  .tick.sub {
    position: absolute;
    top: 0;
    width: 1px;
    height: 6px;
    background: #666;
  }
  .tick.num {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    font-size: 9px;
    color: #aaa;
    line-height: 1;
    padding-top: 1px;
  }
  .ruler {
    position: relative;
  }
  .marker {
    position: absolute;
    top: 0;
    width: 10px;
    height: 100%;
    margin-left: -5px;
    background: #0078d4;
    cursor: ew-resize;
    opacity: 0.7;
  }
  .marker:hover {
    opacity: 1;
  }
</style>
