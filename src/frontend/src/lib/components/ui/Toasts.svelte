<script lang="ts">
  import Toast from './Toast.svelte';
  import { toasts } from '$lib/stores/toasts.store';
</script>

<div class="toast-list">
  {#each $toasts as toast (toast.id)}
    <Toast msg={toast} />
  {/each}
</div>

<style>
  .toast-list {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
