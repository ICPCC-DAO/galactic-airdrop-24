<script lang="ts">
  import { onMount } from 'svelte';
  import { airdropsStore } from '$lib/stores/airdrops.store';
  import { toasts } from '$lib/stores/toasts.store';
  import { getAuthenticatedBackendActor } from '$lib/utils/actor.utils';
  import { isErr } from '$lib/utils/did.utils';
  import { busy } from '$lib/stores/busy.store';
  import { emit } from '$lib/utils/event.utils';
  import IdentityGuard from '$components/guards/IdentityGuard.svelte';
  import IconQuestion from '$components/icons/IconQuestion.svelte';
  import { userStore } from '$lib/stores/user.store';
  import type { AirdropDashboard } from '$declarations/backend/backend.did';

  let code: string = '';
  let black = '#000000';

  // Reactive variable to trigger image reload
  let timestamp = new Date().getTime();

  // Function to refresh the image
  function refreshImage() {
    timestamp = new Date().getTime(); // Update timestamp to current time
  }

  let currentAirdrop: AirdropDashboard | null = null;

  // Function to fetch random airdrop from the store
  function getRandomAirdrop() {
    const airdrops = $airdropsStore.airdrops;
    if (airdrops.length > 0) {
      return airdrops[Math.floor(Math.random() * airdrops.length)];
    }
    return null; // Return null if no airdrops are available
  }

  // Set and clear interval for updating the currentAirdrop
  onMount(() => {
    const interval = setInterval(() => {
      if ($airdropsStore.airdrops.length > 0) {
        currentAirdrop = getRandomAirdrop();
      }
    }, 15000);

    // Immediate update if not already set
    if ($airdropsStore.airdrops.length > 0 && currentAirdrop === null) {
      currentAirdrop = getRandomAirdrop();
    }

    return () => {
      clearInterval(interval); // Cleanup the interval when component is unmounted
    };
  });

  // Reactive update when airdropsStore changes
  $: if ($airdropsStore.airdrops.length > 0 && currentAirdrop === null) {
    currentAirdrop = getRandomAirdrop();
  }

  const handleSubmit = async () => {
    busy.start();
    try {
      const actor = await getAuthenticatedBackendActor();
      const result = await actor.submitCode(code.trim(), 'Canister1');
      if (isErr(result)) {
        toasts.error({ text: result.err });
      } else {
        if (result.ok.length > 12) {
          toasts.success({ text: result.ok });
        } else {
          let alienId = result.ok;
          if (alienId != '42') {
            toasts.success({ text: 'Your alien has leveled up! 👽' });
            refreshImage();
          }
          toasts.success({
            text: 'You are now qualified for this airdrop! 🎉',
          });
        }
      }
    } catch (error) {
      toasts.error({ text: 'An error occurred while submitting the code 😢' });
    } finally {
      busy.stop();
      userStore.sync();
      airdropsStore.sync();
    }
  };

  const handleInterrogationAlien = () => {
    emit({ message: 'openModal', detail: { type: 'alien_modal' } });
  };

  const handleInterrogationAirdrop = () => {
    emit({ message: 'openModal', detail: { type: 'airdrop_modal' } });
  };
</script>

<IdentityGuard>
  <div class="page">
    <div class="page-content">
      <div class="page-title">
        <div class="page-title-left">
          <h2>Home</h2>
          <p>Submit codes, earn rewards and level-up your alien.</p>
        </div>
      </div>
      <div class="airdrop">
        <div class="airdrop-left">
          <div class="alien-widgets">
            <div class="alien-widgets-level">
              {#if $userStore.user}
                <p>Level: {$userStore.user.alienLevel}</p>
              {/if}
            </div>
            <div
              class="alien-widgets-question"
              on:click={handleInterrogationAlien}
              on:keydown={handleInterrogationAlien}
            >
              <IconQuestion width={40} color={black} />
            </div>
          </div>
          <div class="airdrop-alien">
            {#if $userStore.user && $userStore.user.alienId.length > 0}
              <img
                src={`https://te62g-3iaaa-aaaal-qi43a-cai.raw.icp0.io/?index=${$userStore.user.alienId[0]}&nocache=${timestamp}`}
                alt="Alien"
              />
            {:else}
              <img src="/egg.GIF" alt="Alien" />
            {/if}
          </div>
          <div class="airdrop-tweet">
            {#if $userStore.user && $userStore.user.alienId.length > 0}
              <a
                href={`https://twitter.com/intent/tweet?text=Today,%20I'm%20embarking%20on%20the%20Alien%20Tech%20Invasion!%20🚀%20Check%20out%20my%20awesome%20Galactic%20Alien,%20now%20at%20Level%20${$userStore.user.alienLevel}!%0A%0A[UPLOAD%20YOUR%20ALIEN%20NFT%20HERE]%0A%0AJoin%20the%20fun%20at%20%23ICPCC24.%20%0AWatch%20live:%20https://www.icp-cc.com/live`}
                class="tweet-button"
                target="_blank"
                rel="noreferrer"
              >
                <button class="button">Share your Alien!</button>
              </a>
            {/if}
          </div>

          <div class="airdrop-submit">
            <div class="input">
              <div class="input-top">
                {#if $userStore.user}
                  <p>
                    Qualified: {$airdropsStore.qualifiedAirdrops.length}/41
                  </p>
                {/if}
                <div
                  class="alien-widgets-question"
                  on:click={handleInterrogationAirdrop}
                  on:keydown={handleInterrogationAirdrop}
                >
                  <IconQuestion width={40} color={black} />
                </div>
              </div>
              <input
                type="text"
                name="code_field"
                placeholder="Enter Valid Code"
                maxlength="24"
                bind:value={code}
              />
            </div>
            <div class="submit">
              <button class="button button-submit" on:click={handleSubmit}
                >Submit</button
              >
            </div>
          </div>
        </div>
        <div class="airdrop-right" />
      </div>
    </div>
  </div>
</IdentityGuard>

<style lang="scss">
  .airdrop {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    @media (max-width: 1024px) {
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }
  }

  .airdrop-alien {
    display: flex;
    border: 3px solid var(--color-black);
    border-radius: 5px;
    width: 256px;
    height: 256px;

    @media (max-width: 1024px) {
      width: 100%;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .page-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 2rem;

    @media (max-width: 1024px) {
      flex-direction: column;
      gap: 2rem;
    }
  }

  .airdrop-left {
    display: flex;
    flex-direction: column;
  }

  .airdrop-submit {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: flex-end;
    margin-top: var(--padding-2x);

    @media (max-width: 1024px) {
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }
  }

  .alien-widgets {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    max-width: 256px;
  }

  .airdrop-tweet {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: var(--padding-2x);
    width: 256px;

    @media (max-width: 1024px) {
      width: 100%;
    }

    .button {
      background-color: var(--color-blue);
      color: var(--color-white);
      width: 256px;

      @media (max-width: 1024px) {
        width: 100%;
      }
    }
  }

  .alien-widgets-question {
    cursor: pointer;
  }

  input[type='text'] {
    width: 500px;
    height: 50px;
    padding: var(--padding);
    border: 3px solid var(--color-black);
    border-radius: 5px;
    @media (max-width: 1024px) {
      width: 100%;
    }
  }

  .button-submit {
    background-color: var(--color-green);
  }

  .submit,
  .input {
    display: flex;
    flex-direction: column;
  }

  .input-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 500px;

    @media (max-width: 1024px) {
      width: 100%;
    }
  }

  p {
    color: var(--color-black); // Regular text color
    font-size: 1em;
    margin-bottom: 20px;
  }

  a {
    text-decoration: none;
  }
</style>
