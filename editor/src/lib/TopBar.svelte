<script lang="ts">
  let {
    filename,
    saveStatus,
    onSave,
  }: {
    filename: string;
    saveStatus: string;
    onSave: () => void;
  } = $props();
</script>

<div class="topbar">
  <span class="filename">{filename}</span>
  <div class="actions">
    <span class="save-status">{saveStatus}</span>
    <button class="save-btn" onclick={onSave} title="Saving comes later"
      >{saveStatus}</button
    >
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
    background: #1f1f1f;
    padding: 8px 16px;
    border-bottom: 1px solid #333;
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
    border: 1px solid #555;
    border-radius: 4px;
    background: #3a3a3a;
    color: #eee;
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

  .save-status {
    font-size: 12px;
    color: #9a9a9a;
  }
</style>
