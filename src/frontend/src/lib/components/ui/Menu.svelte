<script lang="ts">
  import { fly } from 'svelte/transition';
  import { scrollToSection } from '$lib/utils/ui.utils';
  import { signIn } from '$lib/services/auth.services';
  import { isBusy } from '$lib/stores/busy.store';

  export let open: Boolean = false;

  function closeMenu() {
    open = false;
  }

  function navigateToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      closeMenu();
      scrollToSection(new Event('click'), `#${sectionId}`);
    }
  }
</script>

{#if open}
  <div class="menu">
    <p
      transition:fly={{ y: -15, delay: 20 }}
      on:click={() => navigateToSection('why-motoko')}
      on:keydown={(e) => {
        if (e.key === 'Enter') {
          navigateToSection('why-motoko');
        }
      }}
    >
      Why Motoko?
    </p>

    <p
      transition:fly={{ y: -15, delay: 40 }}
      on:click={() => navigateToSection('program')}
      on:keydown={(e) => {
        if (e.key === 'Enter') {
          navigateToSection('program');
        }
      }}
    >
      Program
    </p>
    <p
      transition:fly={{ y: -15, delay: 40 }}
      on:click={() => navigateToSection('get-started')}
      on:keydown={(e) => {
        if (e.key === 'Enter') {
          navigateToSection('get-started');
        }
      }}
    >
      Get Started
    </p>
    <p
      transition:fly={{ y: -15, delay: 40 }}
      on:click={() => navigateToSection('about')}
      on:keydown={(e) => {
        if (e.key === 'Enter') {
          navigateToSection('about');
        }
      }}
    >
      About
    </p>
    <button
      class="button login-button plausible-event-name=Login"
      disabled={$isBusy}
      on:click={async () => await signIn({})}
    >
      Login
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

  .login-button {
    margin-left: var(--padding-2x);
    background-color: var(--color-secondary);
  }
</style>
