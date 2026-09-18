<script lang="ts">
	// SLICE 2 will turn this hardcoded name into a prop from +page.svelte.
	// Ignore props for now — static first.
</script>

<div class="topbar">
	<span class="filename">Untitled document</span>
	<div class="actions">
		<button class="save-btn" disabled title="Saving comes later">Save</button>
		<span class="user-chip" title="AKSHAT (placeholder)">A</span>
	</div>
</div>

<style>
	.topbar {
		flex: none;
		display: flex;
		height: 10px;
		justify-content: space-between;
		align-items: center;
		background: #413963;
		padding: 8px 16px;
		border-bottom: 1px solid #e0e0e0;
	}
	.filename {
		font-weight: 600;
		color: white;
	}
	.actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.save-btn {
		padding: 2px 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		background: white;
		cursor: default;
	}
	.save-btn:disabled {
		opacity: 0.6;
	}
	.user-chip {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #0078d4;
		color: white;
		font-size: 13px;
		font-weight: 600;
	}
</style>
