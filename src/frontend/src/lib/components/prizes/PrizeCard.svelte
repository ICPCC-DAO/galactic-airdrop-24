<script lang="ts">
  import type { Prize } from '$declarations/backend/backend.did';
  import { pricesStore } from '$lib/stores/prices.store';
  import { getValuePrize } from '$lib/utils/prices.utils';
  import { Principal } from '@dfinity/principal';

  export let prize: Prize = {
    decimals: 8n,
    ledgerId: Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai'),
    distributionStatus: { NotDistributed: null },
    airdropId: 0n,
    amount: 100000000n,
    symbol: 'ICP',
  };
  // Utility function to format large numbers or show "N/A" for zero values
  function formatNumber(num: number): string {
    // Notice parameter type is now number
    if (num >= 1000000) {
      return (num / 1000000).toFixed(4) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(4) + 'K';
    } else if (num > 0) {
      return num.toFixed(4); // Ensures fractional numbers are correctly displayed
    } else {
      return 'N/A'; // Handle zero as "N/A"
    }
  }

  function formatPrice(num: number): string {
    if (num >= 1000000) {
      return '$' + (num / 1000000).toFixed(4) + 'M';
    } else if (num >= 1000) {
      return '$' + (num / 1000).toFixed(4) + 'K';
    } else if (num > 0) {
      return '$' + num.toFixed(4); // Ensures fractional numbers are correctly displayed
    } else {
      return 'N/A'; // Handle zero as "N/A"
    }
  }

  $: printedAmount = formatNumber(
    Number(prize.amount) / Number(10n ** prize.decimals),
  );
  $: printedValue = formatPrice(
    getValuePrize(prize.symbol, prize.amount, prize.decimals, pricesStore),
  );
</script>

<div class="prize">
  <img
    src={`https://o5cc5-dqaaa-aaaaj-qa3ya-cai.icp0.io/logo/${prize.ledgerId.toString()}.png`}
    alt="Logo Prize"
    class="prize-logo"
  />
  <div class="prize-info">
    <div class="prize-amount-symbol">
      <div class="prize-symbol">
        {prize.symbol}
      </div>
      <div class="prize-amount">
        {printedAmount}
      </div>
    </div>
    <div class="prize-value-status">
      <div class="prize-value">
        {printedValue}
      </div>
      <div class="prize-status">
        {#if 'NotDistributed' in prize.distributionStatus}
          Sending 🟡
        {:else if 'Distributed' in prize.distributionStatus}
          Sent 🟢
        {:else if 'Failed' in prize.distributionStatus}
          Failed 🔴
        {/if}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .prize {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid var(--color-black);
    border-radius: 10px;
    background-color: var(--color-black);
    color: var(--color-white);
    cursor: pointer;
    font-weight: bold;
    width: 330px;
    height: 100px;
    font-size: 18px;

    @media (max-width: 1024px) {
      width: 100%;
    }
  }

  .prize-logo {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }

  .prize-info {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    padding: 0.5rem;
    width: 100%;
  }

  .prize-amount-symbol {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .prize-value-status {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
