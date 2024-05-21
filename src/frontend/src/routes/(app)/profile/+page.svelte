<script lang="ts">
  import { userStore } from '$lib/stores/user.store';
  import { meetupCodeToLocation } from '$lib/utils/meetup.utils';
  import { authStore } from '$lib/stores/auth.store';
  import { emit } from '$lib/utils/event.utils';
  import IconQuestion from '$components/icons/IconQuestion.svelte';

  let black = '#000000';

  const handleInterrogationConf = () => {
    emit({
      message: 'openModal',
      detail: {
        type: 'conf_modal',
      },
    });
  };
</script>

<div class="page">
  <div class="page-content">
    <div class="page-title">
      <h2>Profile</h2>
      <p>Consult your personal information.</p>
    </div>
    {#if $userStore.user}
      <div class="form-wrapper">
        <div class="form-field">
          <div class="form-field">
            <label for="id">User (Principal ID)</label>
            {#if $authStore?.identity}
              <p>{$authStore?.identity.getPrincipal().toString()}</p>
            {/if}
          </div>
          <label for="wallet">Wallet (Principal ID)</label>
          <p>{$userStore.user.wallet}</p>
          <label for="email">Email</label>
          <p>
            {$userStore.user.email}
          </p>
          <div
            class="airdrop-points
          "
          >
            <label for="airdrop-points">$CONF Airdrop Allocation</label>
            <div
              class="alien-widgets-question"
              on:click={handleInterrogationConf}
              on:keydown={handleInterrogationConf}
            >
              <IconQuestion width={40} color={black} />
            </div>
          </div>

          <p>{$userStore.user.numberOfPoints}</p>
        </div>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  @use '../../../lib/styles/mixins/shadow' as *;
  .page {
    background-color: var(--color-white);
  }

  label {
    font-family: 'Nasalization Rg', sans-serif;
    font-weight: bold;
  }

  .form-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: var(--padding-4x);
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: var(--padding-2x);
  }

  .airdrop-points {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--padding-2x);
  }
</style>
