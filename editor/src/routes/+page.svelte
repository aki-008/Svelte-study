<script>
	import Tiptap from '$lib/Tiptap.svelte';
	import TopBar from '$lib/TopBar.svelte';
	import TabBar from '$lib/TabBar.svelte';
	import Ribbon from '$lib/Ribbon.svelte';

	let activeTab = $state('Home');
</script>

<main>
	<TopBar />
	<TabBar activeTab={activeTab} onTabChange={(t) => (activeTab = t)} />
	<Ribbon activeTab={activeTab} />
	<Tiptap />
</main>
