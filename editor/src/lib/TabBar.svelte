<script lang="ts">
	// State now lives in +page.svelte (the noticeboard). TabBar only
	// displays activeTab and reports clicks through onTabChange.
	let { activeTab, onTabChange }: { activeTab: string; onTabChange: (name: string) => void } =
		$props();

	const tabs = ['File', 'Home', 'Insert', 'Layout'];

	function selectTab(name: string) {
		onTabChange(name);
	}
</script>

<div class="tabbar">
	{#each tabs as tab (tab)}
		<button onclick={() => selectTab(tab)} class:active={activeTab === tab}>
			{tab}
		</button>
	{/each}
</div>

<style>
	.tabbar {
		flex: none;
		display: flex;
		gap: 4px;
		background: #413963;
		padding: 0 16px;
	}
	.hint {
		color: white;
		opacity: 0.6;
		font-size: 13px;
		padding: 8px 0;
	}
	button {
		background: transparent;
		border: none;
		color: white;
		padding: 8px 14px;
		font-size: 14px;
		cursor: pointer;
	}
	button:hover {
		background: rgba(255, 255, 255, 0.12);
	}
	button.active {
		background: white;
		color: #413963;
		font-weight: 600;
	}
</style>
