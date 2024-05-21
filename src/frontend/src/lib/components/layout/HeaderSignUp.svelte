<script lang="ts">
  import { onMount } from 'svelte';
  import { signOutClose } from '$lib/services/auth.services';
  import { isBusy } from '$lib/stores/busy.store';
  import MenuMobile from '../ui/MenuMobile.svelte';
  import IconLogoBright from '$components/icons/IconLogoBright.svelte';
  import { authStore } from '$lib/stores/auth.store';
  import IconTelegram from '$components/icons/IconTelegram.svelte';

  let open = false;

  $: if (open) {
    document.body.style.overflow = 'hidden'; // Disable scrolling when the menu is open
  } else {
    document.body.style.overflow = ''; // Enable scrolling when the menu is closed
  }

  let isSticky = true;

  onMount(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  function handleScroll() {
    if (window.scrollY > 10) {
      isSticky = true;
    } else {
      isSticky = false;
    }
  }

  function handleKeyDown(event: any) {
    if (event.key === 'Enter' || event.key === 'Space') {
      open = !open;
      event.preventDefault(); // Prevents default button behavior for 'Space' key
    }
  }
</script>

<header class="sticky">
  <div class="content-wrapper">
    <div class="left">
      <div class="logo">
        <a href="https://icp-cc.com/" target="_blank" rel="noreferrer">
          <IconLogoBright />
        </a>
      </div>
    </div>

    {#if $authStore.identity !== null}
      <div class="right hide-on-mobile">
        <button
          class="
          hide-on-mobile
          button login-button"
          disabled={$isBusy}
          on:click={signOutClose}
        >
          Logout
        </button>
      </div>
    {/if}

    <div class="show-on-mobile">
      <div
        class="button-cursor"
        on:click={() => {
          open = !open;
        }}
        on:keydown={handleKeyDown}
      >
        {open ? '<' : '>'}
      </div>
      {#if open}
        <MenuMobile bind:open />
      {/if}
    </div>
  </div>
</header>

<div class="floating-telegram">
  <a href="https://t.me/+WT1U8eme-jZhMGMx" target="_blank" rel="noreferrer">
    <IconTelegram width={26} color={'var(--color-black'} />
  </a>
</div>

<style lang="scss">
  @use '../../styles/mixins/button' as *;
  header {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    background-color: var(--color-black);
    color: var(--color-white-pure);
    padding: var(--padding-2x) 0;

    @media screen and (max-width: 1024px) {
      padding: var(--padding);
    }
  }

  .content-wrapper {
    grid-column: 2 / 12;
    display: flex;
    justify-content: space-between;
    @media screen and (max-width: 1024px) {
      width: 100%;
    }
  }

  .right {
    a {
      padding: 5px 15px;
      text-decoration: none;
      color: var(--color-white);
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .logo {
    height: 50px;
    width: 150px;
  }

  .right,
  .hide-on-mobile {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .show-on-mobile {
    display: none;
  }

  .floating-telegram {
    position: fixed;
    z-index: 99;
    right: 20px;
    bottom: 20px;
    width: 50px;
    height: 50px;
    background-color: var(--color-white);
    border-radius: 50%;
    display: flex;
    align-items: center;
    a {
      margin: auto;
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: -1px;
    }
  }

  .button-cursor {
    cursor: pointer;
    color: var(--color-black);
  }

  /* Styles for mobile devices */
  @media screen and (max-width: 1024px) {
    .show-on-mobile {
      display: block;
    }
  }

  @media (max-width: 1024px) {
    .hide-on-mobile {
      display: none;
    }
  }

  .left {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: var(--padding-4x);
  }

  .show-on-mobile {
    display: none;

    @media screen and (max-width: 1024px) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .button-cursor {
    font-size: 30px;
  }
</style>
