<script lang="ts">
	import Tiptap from '$lib/Tiptap.svelte';
	import TopBar from '$lib/TopBar.svelte';
	import TabBar from '$lib/TabBar.svelte';
	import Ribbon from '$lib/Ribbon.svelte';
	import { Editor } from '@tiptap/core';

	let activeTab = $state('Home');
	let editor: Editor | null = $state(null);
</script>

<main class="shell">
	<TopBar />
	<TabBar {activeTab} onTabChange={(t) => (activeTab = t)} />
	<Ribbon {activeTab} {editor} />
	<Tiptap onEditorReady={(e) => (editor = e)} />
</main>

<style>
	.shell {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
</style>
