<script lang="ts">
  import Tiptap from "$lib/Tiptap.svelte";
  import TopBar from "$lib/TopBar.svelte";
  import TabBar from "$lib/TabBar.svelte";
  import Ribbon from "$lib/Ribbon.svelte";
  import { Editor } from "@tiptap/core";

  let activeTab = $state("Home");
  let editor: Editor | null = $state(null);

  let filename = $state("Untitled document");
  let saveStatus = $state("Not saved yet");

  function handleSave() {
    console.log("Save clicked");
    saveStatus = "Saving...";
  }
</script>

<main class="shell">
  <TopBar {filename} {saveStatus} onSave={handleSave} />
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
