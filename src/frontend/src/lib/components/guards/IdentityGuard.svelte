<script lang="ts">
  import { authStore } from '$lib/stores/auth.store';
  import { signIn } from '$lib/services/auth.services';
</script>

{#if $authStore.identity === null}
  <div class="page">
    <div
      on:keydown={async (e) => {
        if (e.key === 'Enter') {
          await signIn({});
        }
      }}
      class="button-login button"
      on:click={async () => await signIn({})}
    >
      Login
    </div>
    <ul class="tutorials">
      <li>
        To participate in the Galactic Airdrop you need both
        <a href="https://plugwallet.ooo/" target="_blank" rel="noreferrer"
          >Plug Wallet</a
        >
        and an
        <a href="https://identity.ic0.app/" target="_blank" rel="noreferrer"
          >Internet Identity</a
        >
      </li>
      <li>
        <a
          href="https://drive.google.com/file/d/1xD4a0qkH7huxKbbE90vMeAyLBYr4IySL/view"
          target="_blank"
          rel="noreferrer">How to create an Internet Identity?</a
        >
      </li>
      <li>
        <a
          href="https://drive.google.com/file/d/1paZhIu2nacNApe7tBM504S3jbXuMoZ0M/view"
          target="_blank"
          rel="noreferrer">How to create a Plug wallet?</a
        >
      </li>
    </ul>
  </div>
{:else}
  <slot />
{/if}

<style lang="scss">
  .page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .button-login {
    background-color: var(--color-yellow);
  }
</style>
