<script lang="ts">
  import { fly } from 'svelte/transition';
  import { signOutClose } from '$lib/services/auth.services';
  import { scrollToSection } from '$lib/utils/ui.utils';
  import { isBusy } from '$lib/stores/busy.store';
  import { goto } from '$app/navigation';

  export let open: Boolean = false;

  function closeMenu() {
    open = false;
  }
</script>

{#if open}
  <div class="menu">
    <p
      transition:fly={{ y: -15, delay: 20 }}
      on:click={(e) => goto('/home')}
      on:keydown={(e) => goto('/home')}
    >
      Home
    </p>
    <p
      transition:fly={{ y: -15, delay: 40 }}
      on:click={(e) => goto('/airdrops')}
      on:keydown={(e) => goto('/airdrops')}
    >
      Airdrops
    </p>
    <p
      transition:fly={{ y: -15, delay: 40 }}
      on:click={(e) => goto('/prizes')}
      on:keydown={(e) => goto('/prizes')}
    >
      Prizes
    </p>
    <p
      transition:fly={{ y: -15, delay: 40 }}
      on:click={(e) => goto('/profile')}
      on:keydown={(e) => goto('/profile')}
    >
      Profile
    </p>
    <button class="button" disabled={$isBusy} on:click={signOutClose}>
      Logout
    </button>
  </div>
{/if}

<style>
  .menu {
    position: absolute;
    top: 58px;
    width: 100vw;
    height: 100vh;
    left: 0;
    opacity: 1;
    z-index: 80;
    padding-top: 0;
    color: #eef;
    background-color: var(--color-black);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--padding-2x) 0;
    row-gap: var(--padding-2x);
  }
  p {
    cursor: pointer;
    width: max-content;
  }
  p:hover {
    text-decoration: underline;
  }
</style>
