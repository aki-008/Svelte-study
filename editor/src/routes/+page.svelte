<script>
	import Tiptap from '$lib/Tiptap.svelte';
	import TopBar from '$lib/TopBar.svelte';
	import TabBar from '$lib/TabBar.svelte';
	import Ribbon from '$lib/Ribbon.svelte';

	let activeTab = $state('Home');
</script>

<main class="shell">
	<TopBar />
	<TabBar {activeTab} onTabChange={(t) => (activeTab = t)} />
	<Ribbon {activeTab} />
	<Tiptap onEditorReady={() => console.log('Editor is ready')} />
</main>

<style>
	.shell {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
</style>
