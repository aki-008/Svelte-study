<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import { StarterKit } from "@tiptap/starter-kit";
  import { TextAlign } from "@tiptap/extension-text-align";
  import { Indent } from "$lib/indent";
  import Ruler from "$lib/Ruler.svelte";

  let element: HTMLElement | undefined = $state();
  let editorState: { editor: Editor | null } = $state({ editor: null });

  // Parent passes this in; we ring the bell once the editor exists.
  let { onEditorReady }: { onEditorReady: (editor: Editor) => void } = $props();

  onMount(async () => {
    const { PaginationPlus } = await import("tiptap-pagination-plus");

    editorState.editor = new Editor({
      element: element as HTMLElement,
      extensions: [
        StarterKit,
        PaginationPlus.configure({
          // Exact Legal: 8.5in x 14in @96dpi = 816 x 1344, 1in = 96px margins
          pageWidth: 816,
          pageHeight: 1344,
          marginTop: 96,
          marginBottom: 96,
          marginLeft: 96,
          marginRight: 96,
          pageGap: 32,
          pageBreakBackground: "#383838",
          pageGapBorderColor: "transparent",
          footerRight: "",
        }),
        // BubbleMenu.configure({
        // 	element: bubbleMenu
        // })
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Indent,
      ],
      content: `
      `,
      onTransaction: ({ editor }) => {
        // Update the state signal to force a re-render
        editorState = { editor };
      },
    });

    onEditorReady(editorState.editor as Editor);
  });
  onDestroy(() => {
    editorState.editor?.destroy();
  });
</script>

<div style="position: relative" class="app">
  <Ruler editor={editorState.editor} />
  <div class="background">
    <div bind:this={element} class="editor-page"></div>
  </div>
</div>

<style>
  /*button.active {
		background: black;
		color: white;
	}*/
  .editor-page {
    box-sizing: border-box;
    background: transparent;
    margin: 0 auto;
    /* box-shadow: none; */
    padding: 0;
  }

  .app {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }

  .background {
    background-color: #383838;
    padding: 20px;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  :global(.rm-with-pagination) {
    background: white;
    box-sizing: border-box;
    margin: 0 auto;
    /* box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2); */
    border: none;
  }

  /* Grey only on the gap strip itself (already set via pageBreakBackground);
	   header/footer zones stay transparent so the 1in top/bottom
	   margins read as white paper, Word-style. */
  :global(.rm-with-pagination .rm-pagination-gap) {
    background-color: #383838;
  }

  /* Tame paragraph spacing (browser default ~1em top+bottom amplifies
	   every page-straddle by ~32px). Line-spacing stays a separate future knob. */
  :global(.rm-with-pagination p) {
    margin-top: 0;
    margin-bottom: 6px;
  }
</style>
