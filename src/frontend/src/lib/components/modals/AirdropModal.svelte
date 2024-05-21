<script lang="ts">
  import Modal from '$lib/components/ui/Modal.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const close = () => dispatch('closeModal');
</script>

<Modal on:closeModal={close}>
  <div class="message">
    <h2>Galactic Airdrop 🛸</h2>
    <p>
      The Galactic Airdrop is a massive airdrop event happening parallel to the
      ICPCC 2024 Conference. Follow the livestream to find codes and earn
      rewards from ICP ecosystem projects. The total prize pool is estimated
      worth more than $100,000.
    </p>
    <h4>Rules</h4>
    <ul>
      <li>
        <strong>Obtaining Codes:</strong> Watch the
        <a
          href="https://www.youtube.com/watch?v=qCDQKwOp938"
          target="_blank"
          rel="noreferrer"
          >ICPCC Livestream
        </a>to find valid codes.
      </li>
      <li>
        <strong>Airdrops:</strong>
        <ul>
          <li>
            Each valid code qualifies you for one entry into an airdrop raffle.
          </li>
          <li>
            There is a waiting period between entering the raffle and the
            drawing of winners.
          </li>
          <li>
            Airdrops conclude either when the maximum number of participants is
            reached or 5 minutes after starting.
          </li>
          <li>
            Winners will see new prizes added to the Prize section of their
            account.
          </li>
          <li>
            Check the Airdrop section for a list of available airdrops and their
            current status.
          </li>
        </ul>
      </li>
      <li>
        <strong>Rewards Distribution:</strong> Rewards will be distributed within
        48 hours post-event and will be sent to your Plug Wallet.
      </li>
      <li>
        <strong>Blacklist Policy:</strong> If you submit more than 100 codes in total
        during the livestream, or if you repeatedly spam the 'Submit' button, your
        account will be blacklisted. As a result, you will not receive any rewards.
      </li>
      <li>
        <strong>Legal disclaimer:</strong> By participating in the Galactic Airdrop,
        you agree to the terms and conditions of the event. See Legal disclaimer
        for more information.
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
