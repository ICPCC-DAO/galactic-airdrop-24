<script lang="ts">
  import { Principal } from '@dfinity/principal';
  import { getAuthenticatedBackendActor } from '$lib/utils/actor.utils';
  import { busy } from '$lib/stores/busy.store';
  import { isErr, toNullable } from '$lib/utils/did.utils';
  import { toasts } from '$lib/stores/toasts.store';
  import { userStore } from '$lib/stores/user.store';
  import IdentityGuard from '$components/guards/IdentityGuard.svelte';

  let email: string = '';
  let wallet: string = '';
  let code: string = '';
  let screen: 'Infos' | 'ValidationCode' = 'Infos';

  function isPrincipalValid(wallet: string): boolean {
    try {
      Principal.fromText(wallet);
      return true;
    } catch (error) {
      return false;
    }
  }

  function isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isCodeValid(code: string): boolean {
    return code.length === 6;
  }

  const handleSubmit = async () => {
    if (!isEmailValid(email)) {
      toasts.error({
        text: 'Invalid email',
      });
      return;
    }
    if (!isPrincipalValid(wallet)) {
      toasts.error({
        text: 'Invalid Principal ID',
      });
      return;
    }
    busy.start();

    try {
      const actor = await getAuthenticatedBackendActor();
      const result = await actor.registerUser(
        email.trim(),
        Principal.fromText(wallet.trim()),
        'Canister1',
      );
      userStore.sync();
      if (isErr(result)) {
        toasts.error({
          text: result.err,
        });
      }
    } catch (error) {
      console.log(error);
    }
    screen = 'ValidationCode';
    busy.stop();
  };

  const handleSubmitCode = async () => {
    if (!isCodeValid(code)) {
      toasts.error({
        text: 'Invalid code',
      });
      return;
    }
    busy.start();

    try {
      const actor = await getAuthenticatedBackendActor();
      const result = await actor.verifyUser(code.trim());
      userStore.sync();
      if (isErr(result)) {
        toasts.error({
          text: result.err,
        });
        busy.stop();
        return;
      }
    } catch (error) {
      console.log(error);
    }
    busy.stop();
    userStore.syncRedirect();
  };
</script>

<IdentityGuard>
  <div class="page">
    <div class="page-content">
      {#if $userStore.user === null}
        <h2 class="title">Join the Massive #ICP Airdrop!</h2>
        <form on:submit|preventDefault={handleSubmit} class="sign-up-form">
          <div class="sign-up-form-email">
            <label for="email">Your Email</label>
            <input
              type="email"
              name="email_field"
              placeholder="Your email"
              maxlength="320"
              bind:value={email}
            />
          </div>
          <div class="sign-up-form-wallet">
            <label for="email"> Your Plug Wallet (Principal ID) </label>
            <input
              type="text"
              name="wallet_field"
              placeholder="Your Plug Wallet (Principal ID)"
              maxlength="320"
              bind:value={wallet}
            />
            <p>
              Your Principal ID is a hyphen-separated string that contains
              various segments of characters.
              <br />
              You can find and copy it from your Plug Wallet.
              <br />
              An example of what your Principal ID might look like is:
              <strong
                >rdqvh-7d7ja-mt3xe-mxeqh-ejo26-piyo7-s2ap2-klyfw-ljixo-gehot-pae</strong
              >
              <br />
              Make sure it is correct, as this is where the rewards will be sent.
            </p>
          </div>
          <button type="submit" class="button-submit button"> Join </button>
        </form>
        <!-- {:else if $userStore.user !== null && $userStore.user?.verificationTime.length === 0}
        <h2 class="title">Validate your account</h2>
        <form on:submit|preventDefault={handleSubmitCode} class="sign-up-code">
          <div class="sign-up-form-code">
            <label for="code">Your Code</label>
            <input
              type="text"
              name="code_field"
              placeholder="Your Code"
              maxlength="6"
              bind:value={code}
            />
          </div>
          <p>
            You should have received an email containing your code. If you
            haven't seen it, please check your spam folder.
          </p>
          <button type="submit" class="submit button">Validate</button>
        </form> -->
      {:else}
        <h2 class="title">Welcome! You are now registered.</h2>
        <p>
          You will be automatically redirected to the home page in a few
          seconds. If you are not redirected, click <a href="/home">here</a>.
        </p>
      {/if}
    </div>
  </div>
</IdentityGuard>

<style lang="scss">
  @use '../../lib/styles/mixins/shadow' as *;
  .page {
    background-color: var(--color-white);
  }

  .title {
    margin-bottom: var(--padding-4x);
  }

  .sign-up-form,
  .sign-up-form-wallet,
  .sign-up-form-email {
    display: flex;
    flex-direction: column;
    gap: var(--padding-2x);
  }

  input[type='email'] {
    width: 75%;
    padding: var(--padding-2x);
    border-radius: 5px;
  }

  input[type='text'] {
    width: 75%;
    padding: var(--padding-2x);
    border-radius: 5px;
  }

  label {
    font-size: 22px;
    text-decoration: underline;
    font-family: 'Nasalization Rg';
  }

  p {
    font-size: 16px;
  }
</style>
