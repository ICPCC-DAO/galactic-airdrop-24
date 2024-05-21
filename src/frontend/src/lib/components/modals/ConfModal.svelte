<script lang="ts">
  import Modal from '$lib/components/ui/Modal.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const close = () => dispatch('closeModal');
</script>

<Modal on:closeModal={close}>
  <div class="message">
    <h2>$CONF Airdrop 🎁</h2>
    <p>
      <strong> $CONF</strong> is the native token of the
      <strong> ICPCC LLC DAO</strong>.
    </p>
    <p>
      By participating in ICPCC 2024, you are eligible to receive $CONF tokens.
      Those tokens will be airdropped post-DAO launch. During the event, collect
      <strong>Airdrop Allocation Points</strong>.
      <br />
    </p>
    <h4>Rules</h4>
    <ul>
      <li>
        <strong>Airdrop Points:</strong> Points determine your share of the 4% $CONF
        token airdrop and are non-transferable with no cash value. They do not represent
        actual tokens or guarantee a specific number of $CONF tokens.
      </li>
      <li>
        <strong>Virtual attendees</strong> must elevate their Galactic Alien to
        <strong>Level 5</strong> to receive
        <strong>1 Airdrop Allocation Point.</strong> for participating.
      </li>
      <li>
        <strong>In-person attendees</strong> for ICPCC 2024 need to enter a
        special code within this dApp to claim
        <strong>2 Airdrop Allocation Points</strong> for attending.
      </li>
      <li>
        <strong>Meetup organizers</strong> for ICPCC 2024 need to enter a
        special code within this dApp to claim
        <strong>6 Airdrop Allocation Points.</strong> for organizing.
      </li>
      <li>
        <strong>ICPCC 2023 attendees</strong> automatically qualify for
        <strong>6 Airdrop Allocation Points</strong> through their minted “ICP Community
        Conference 2023” proof-of-attendance NFTs.
      </li>
      <li>
        <strong>Additional Information:</strong> to learn more about
        <strong> $CONF </strong> or the <strong>ICPCC LLC DAO</strong>, read the
        <a
          href="https://litepaper.icp-cc.com/"
          target="_blank"
          rel="noreferrer"
        >
          Litepaper</a
        >.
      </li>
    </ul>
  </div>
</Modal>

<style>
  h4 {
    margin-top: 2rem;
    text-decoration: underline;
  }
</style>
