<script lang="ts">
  import PrizeCard from '$components/prizes/PrizeCard.svelte';
  import { getTotalValuePrizes } from '$lib/utils/prices.utils';
  import { userStore } from '$lib/stores/user.store';
  import { pricesStore } from '$lib/stores/prices.store';

  $: printedValueUserPrizes = getTotalValuePrizes(
    $userStore.user?.prizes || [],
    pricesStore,
  ).toFixed(2);
</script>

<div class="page">
  <div class="page-content">
    <div class="page-title">
      <h2>Prizes</h2>
      <p>A list of all the prizes you've earned.</p>
    </div>
    <div class="prizes-widgets">
      <div class="prizes-value">
        <div class="user-prizes-value">
          <p>My Prizes</p>
          <h2>${printedValueUserPrizes}</h2>
        </div>
      </div>
    </div>
    <div class="prizes-list">
      {#each $userStore.user?.prizes || [] as prize}
        <PrizeCard {prize} />
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .prizes-widgets {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--padding-4x);

    @media (max-width: 1024px) {
      align-items: flex-start;
      flex-direction: column;
      gap: 1rem;
    }
  }

  .prizes-value {
    display: flex;
    flex-direction: row;
    gap: 1rem;

    @media (max-width: 1024px) {
      flex-direction: column;
      gap: 1rem;
    }
  }

  .user-prizes-value {
    display: flex;
    flex-direction: column;
    background-color: var(--color-black);
    color: var(--color-white);
    border: 2px solid var(--color-black);
    border-radius: 10px;
    padding: var(--padding-2x);
    max-width: 300px;
    font-size: bold;
    gap: 1rem;
  }

  .prizes-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
</style>
