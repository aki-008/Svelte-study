<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { PAGE_SIZES } from 'tiptap-pagination-plus';

	let { activeTab, editor }: { activeTab: string; editor: Editor | null } = $props();

	type Group = { label: string; buttons: string[] };

	const belts: Record<string, Group[]> = {
		File: [],
		Home: [
			{ label: 'Clipboard', buttons: ['Paste'] },
			{ label: 'Font', buttons: ['B', 'I', 'U'] },
			{ label: 'Paragraph', buttons: ['Bullets', 'Align'] }
		],
		Insert: [
			{ label: 'Tables', buttons: ['Table'] },
			{ label: 'Illustrations', buttons: ['Picture'] }
		],
		Layout: [{ label: 'Paragraph', buttons: ['Spacing'] }]
	};

	const sizes = ['Legal', 'A4', 'A5', 'Letter', 'A3', 'Tabloid'];

	function handleSizeChange(event: Event) {
		const key = (event.target as HTMLSelectElement).value;
		if (!editor) return;
		editor
			.chain()
			.focus()
			.updatePageSize(PAGE_SIZES[key as keyof typeof PAGE_SIZES])
			.run();
	}
</script>

<div class="ribbon">
	{#each belts[activeTab] as group (group.label)}
		<div class="group">
			<div class="items">
				{#each group.buttons as name (name)}
					<button disabled title="Coming soon">{name}</button>
				{/each}
			</div>
			<div class="group-label">{group.label}</div>
		</div>
	{/each}
	{#if activeTab === 'Layout'}
		<div class="group">
			<div class="items">
				<select onchange={handleSizeChange}>
					{#each sizes as size (size)}
						<option selected={size === 'Legal'}>{size}</option>
					{/each}
				</select>
			</div>
			<div class="group-label">Size</div>
		</div>
	{/if}
</div>

<style>
	.ribbon {
		flex: none;
		display: flex;
		gap: 8px;
		background: #2b2b2b;
		padding: 8px 16px;
		border-bottom: 1px solid #3a3a3a;
		min-height: 72px;
	}
	.hint {
		color: #888;
		font-size: 13px;
		align-self: center;
	}
	.group {
		display: flex;
		flex-direction: column;
		border-right: 1px solid #444;
		padding-right: 8px;
	}
	.group:last-child {
		border-right: none;
	}
	.items {
		display: flex;
		gap: 4px;
		flex: 1;
		align-items: center;
	}
	.group-label {
		font-size: 11px;
		color: #9a9a9a;
		text-align: center;
		padding-top: 4px;
	}
	button,
	select {
		padding: 4px 10px;
		border: 1px solid #555;
		border-radius: 4px;
		background: #3a3a3a;
		color: #eee;
		font-size: 13px;
	}
	button:disabled {
		opacity: 0.55;
		cursor: default;
	}
</style>
