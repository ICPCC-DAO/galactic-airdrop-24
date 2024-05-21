<script lang="ts">
  import Modal from '$lib/components/ui/Modal.svelte';
  import { createEventDispatcher } from 'svelte';
  import { busy } from '$lib/stores/busy.store';
  import { toasts } from '$lib/stores/toasts.store';
  import { getAuthenticatedBackendActor } from '$lib/utils/actor.utils';
  import { cleanAddress } from '$lib/utils/ext.utils';
  const dispatch = createEventDispatcher();
  import { isErr } from '$lib/utils/did.utils';
  const close = () => dispatch('closeModal');
  import { userStore } from '$lib/stores/user.store';

  let ckBTCAddress = '';
  const handleTransfer = async () => {
    if (ckBTCAddress === '') {
      toasts.error({ text: 'Please input your ckBTC Principal from Bioniq' });
      return;
    }

    busy.start();
    try {
      const actor = await getAuthenticatedBackendActor();
      const address = cleanAddress(ckBTCAddress);
      console.log('Cleaned address: ', address);
      const result = await actor.transferAlien(address);
      if (isErr(result)) {
        toasts.error({ text: result.err });
      } else {
        toasts.success({ text: 'Your alien is now availabe on Bioniq' });
      }
    } catch (error) {
      toasts.error({
        text: 'An error occurred while transferring the alien 😢',
      });
    } finally {
      busy.stop();
      userStore.sync();
    }
  };
</script>

<Modal on:closeModal={close}>
  <div class="message">
    <h2>Galactic Alien 👽</h2>
    <h4>How to transfer your Alien?</h4>
    <ul>
      <li>
        <strong>Get ckBTC address:</strong> Log in to the Bioniq marketplace. Go
        to your profile, navigate to the wallet section, select "receive" and
        <strong>ckBTC</strong>
        and copy your ckBTC Principal address.
      </li>
      <li>
        <strong>Transfer:</strong> Paste the copied address into the input field
        below and click the "Transfer" button.
      </li>
      <li>
        <strong>Done</strong> Your alien is now available on Bioniq under the "My
        Inscriptions" section. You can now inscribe your alien as a Bitcoin Ordinal.
      </li>
    </ul>
    <h4>Transfer</h4>
    <div class="transfer">
      <input
        type="text"
        name="code_field"
        placeholder="Input your ckBTC Principal from Bioniq"
        bind:value={ckBTCAddress}
      />
      <div class="submit">
        <button class="button button-submit" on:click={handleTransfer}
          >Transfer</button
        >
      </div>
    </div>
  </div>
</Modal>

<style lang="scss">
  h4 {
    margin-top: 2rem;
    text-decoration: underline;
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

  .transfer {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }

  .button-submit {
    background-color: var(--color-green);
  }

  ul.numbered-list {
    list-style: none; /* Remove default bullet points */
    counter-reset: list-counter; /* Reset the counter */
  }

  ul.numbered-list li {
    counter-increment: list-counter; /* Increment the counter */
    margin-bottom: 5px; /* Add some spacing between list items */
  }

  ul.numbered-list li::before {
    content: counter(list-counter) '. '; /* Add the counter before the list item */
    font-weight: bold; /* Make the numbers bold */
  }
</style>
