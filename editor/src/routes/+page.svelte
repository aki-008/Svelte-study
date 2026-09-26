<script lang="ts">
  import Tiptap from "$lib/Tiptap.svelte";
  import TopBar from "$lib/TopBar.svelte";
  import TabBar from "$lib/TabBar.svelte";
  import Ribbon from "$lib/Ribbon.svelte";
  import { Editor } from "@tiptap/core";
  import { exportEditorDocx, type PMDoc } from "$lib/exportDocx";

  let activeTab = $state("Home");
  let editor: Editor | null = $state(null);

  let filename = $state("Untitled document");
  let saveStatus = $state("Not saved yet");

  async function handleSave() {
    if (!editor) {
      saveStatus = "No editor yet";
      return;
    }
    saveStatus = "Saving...";
    const path = await exportEditorDocx(editor.getJSON() as unknown as PMDoc);
    if (!path) {
      saveStatus = "Save cancelled";
      return;
    }
    filename = path.split(/[/\\]/).pop() ?? "Untitled document";
    const now = new Date();
    saveStatus = `Saved ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
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
