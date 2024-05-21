<script lang="ts">
  import type { Modal } from '$lib/types/modals';
  import AlienModal from './AlienModal.svelte';
  import ConfModal from './ConfModal.svelte';
  import AirdropModal from './AirdropModal.svelte';

  let modal: Modal | undefined = undefined;
  const close = () => (modal = undefined);
</script>

{#if modal?.type === 'alien_modal'}
  <AlienModal on:closeModal={close} />
{/if}
{#if modal?.type === 'conf_modal'}
  <ConfModal on:closeModal={close} />
{/if}
{#if modal?.type === 'airdrop_modal'}
  <AirdropModal on:closeModal={close} />
{/if}

<svelte:window on:openModal={({ detail }) => (modal = detail)} />
