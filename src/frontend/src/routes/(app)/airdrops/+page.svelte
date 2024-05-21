<script lang="ts">
  import { airdropsStore } from '$lib/stores/airdrops.store';
  import Airdrop from '$components/airdrops/Airdrop.svelte';
</script>

<div class="page">
  <div class="page-content">
    <div class="page-title">
      <h2>Airdrops</h2>
      <p>A list of all availables airdrops.</p>
    </div>
    <div class="airdrop-list">
      {#each $airdropsStore.airdrops as airdrop}
        <Airdrop {airdrop} />
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .airdrop-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;

    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
</style>
