<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import { StarterKit } from '@tiptap/starter-kit';

	let element: HTMLElement | undefined = $state();
	let editorState: { editor: Editor | null } = $state({ editor: null });

	// Parent passes this in; we ring the bell once the editor exists.
	let { onEditorReady }: { onEditorReady: (editor: Editor) => void } = $props();

	onMount(async () => {
		const { PaginationPlus } = await import('tiptap-pagination-plus');

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
					pageBreakBackground: '#383838',
					pageGapBorderColor: 'transparent',
					footerRight: 'Page {page}'
				})
				// BubbleMenu.configure({
				// 	element: bubbleMenu
				// })
			],
			content: `
        <h1>Hello Svelte! 🌍️ </h1>
      `,
			onTransaction: ({ editor }) => {
				// Update the state signal to force a re-render
				editorState = { editor };
			}
		});

		onEditorReady(editorState.editor as Editor);
	});
	onDestroy(() => {
		editorState.editor?.destroy();
	});
</script>

<div style="position: relative" class="app">
	<!-- {#if editorState.editor}
		<div class="fixed-menu">
			<button
				onclick={() => editorState.editor!.chain().focus().toggleHeading({ level: 1 }).run()}
				class:active={editorState.editor!.isActive('heading', { level: 1 })}
			>
				H1
			</button>
			<button
				onclick={() => editorState.editor!.chain().focus().toggleHeading({ level: 2 }).run()}
				class:active={editorState.editor!.isActive('heading', { level: 2 })}
			>
				H2
			</button>
			<button
				onclick={() => editorState.editor!.chain().focus().setParagraph().run()}
				class:active={editorState.editor!.isActive('paragraph')}
			>
				P
			</button>
		</div>
	{/if} -->
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
</style>
