<script lang="ts">
  import type { AirdropDashboard } from '../../../../../declarations/backend/backend.did';
  import { airdropsStore } from '$lib/stores/airdrops.store';
  import { Principal } from '@dfinity/principal';
  import { getValuePrize } from '$lib/utils/prices.utils';
  import { isOpen, isPending } from '$lib/utils/airdrops.utils';
  import IconX from '$components/icons/IconX.svelte';
  import IconTelegram from '$components/icons/IconTelegram.svelte';
  import IconWebsite from '$components/icons/IconWebsite.svelte';

  const white = '#ffffff';

  export let airdrop: AirdropDashboard = {
    status: { Open: null },
    metadata: {
      id: BigInt(123456789),
      name: 'Crypto Collectors Fest',
      description:
        'An exclusive event to distribute rare digital collectibles to the most active users.',
      learnMore: 'https://crypto-collectors-fest.com',
      twitter: 'https://twitter.com/icp_cc',
      chat: 'https://oc.app/',
    },
    tokenDetails: {
      ledgerId: Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai'),
      symbol: 'CCF',
      decimals: BigInt(2),
      amount: BigInt(1000000),
      fee: BigInt(100),
    },
    numberOfQualified: BigInt(300),
    limits: {
      maxParticipants: BigInt(500),
    },
  };

  $: printedAmount =
    airdrop.tokenDetails.amount / 10n ** airdrop.tokenDetails.decimals;
  $: rawPrintedValue = getValuePrize(
    airdrop.tokenDetails.symbol,
    airdrop.tokenDetails.amount,
    airdrop.tokenDetails.decimals,
  ).toFixed(2);

  // Reactive statement to handle zero value
  $: printedValue = rawPrintedValue === '0.00' ? 'N/A' : `$${rawPrintedValue}`;

  function isUserQualified(airdropId: BigInt): boolean {
    if (!$airdropsStore.qualifiedAirdrops) return false;

    for (const id of $airdropsStore.qualifiedAirdrops) {
      if (id === airdropId) {
        return true;
      }
    }
    return false;
  }
</script>

<div class="airdrop">
  <div class="airdrop-top">
    <div class="airdrop-title">
      <img
        class="airdrop-title-logo"
        src={`https://o5cc5-dqaaa-aaaaj-qa3ya-cai.icp0.io/logo/${airdrop.tokenDetails.ledgerId.toString()}.png`}
        alt="logo project"
        loading="lazy"
      />
      <div class="airdrop-title-name">{airdrop.metadata.name}</div>
    </div>
  </div>
  <div class="airdrop-middle">
    <p class="airdrop-description">{airdrop.metadata.description}</p>
    <ul class="airdrop-details">
      <li class="airdrop-value-real">
        <strong>Prize</strong>:
        {printedAmount}
        {airdrop.tokenDetails.symbol}
      </li>
      <li class="airdrop-value-symbol">
        <strong>Value</strong>:
        {printedValue}
      </li>
      {#if isPending(airdrop)}
        <strong><li class="airdrop-not-started">Not started 🟡</li> </strong>
      {:else if isUserQualified(airdrop.metadata.id)}
        <strong><li class="airdrop-qualified">Qualified 🟢</li> </strong>
      {:else}
        <strong
          ><li class="airdrop-not-qualified">Not qualified 🔴</li>
        </strong>
      {/if}
      <li class="airdrop-remaining-participants">
        <strong>Participants</strong>: {airdrop.numberOfQualified}/{airdrop
          .limits.maxParticipants}
      </li>
    </ul>
  </div>
  <div class="airdrop-bottom">
    <div class="icon-twitter">
      <a href={airdrop.metadata.twitter} target="_blank" rel="noreferrer">
        <IconX color={white} width={26} />
      </a>
    </div>
    <div class="icon-website">
      <a href={airdrop.metadata.learnMore} target="_blank" rel="noreferrer">
        <IconWebsite color={white} width={26} />
      </a>
    </div>
    <div class="icon-openchat">
      <a href={airdrop.metadata.chat} target="_blank" rel="noreferrer">
        <IconTelegram color={white} width={26} />
      </a>
    </div>
  </div>
</div>

<style lang="scss">
  .airdrop {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: var(--padding-2x);
    border: 2px solid var(--color-black);
    border-radius: 10px;
    background-color: var(--color-black);
    color: var(--color-white);
    align-items: center;

    @media (max-width: 1024px) {
      width: 100%;
    }
  }

  .airdrop-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    font-family: 'Nasalization Rg', sans-serif;
  }

  .airdrop-title-name {
    font-size: 30px;
    font-weight: bold;
    text-align: center;
  }

  .airdrop-middle {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    align-items: center;
    justify-content: center;
  }

  .airdrop-description {
    font-size: 20px;
    height: 60px; // Consistent height for description
    overflow: hidden;
    text-align: center;
  }

  .airdrop-details {
    padding: 0;
    margin: 0;
    font-size: 18px;
    height: 120px;
    justify-self: center;
  }

  .airdrop-bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center; // Aligns icons vertically in the center
    width: 100%; // Ensures the bottom section expands to full width of the card
  }

  .airdrop img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
</style>
