<script lang="ts">
  import { fade } from 'svelte/transition';
  import { busy } from '$lib/stores/busy.store';
  import Spinner from '$lib/components/ui/Spinner.svelte';
  import { isNullish, nonNullish } from '$lib/utils/utils';

  const close = () => {
    if (isNullish($busy) || !$busy.close) {
      return;
    }

    busy.stop();
  };
</script>

{#if nonNullish($busy)}
  <div
    transition:fade
    on:click={close}
    on:keydown|stopPropagation={close}
    class:close={$busy.close}
  >
    <div class="content">
      {#if $busy.spinner}
        <div class="spinner">
          <Spinner />
        </div>
      {/if}

      {#if $busy.close}
        <button
          on:click|stopPropagation={close}
          on:keydown|stopPropagation={close}
          aria-label="close"
          class="text close button">Cancel</button
        >
      {/if}
    </div>
  </div>
{/if}

<style lang="scss">
  @use '../../styles/mixins/interaction';
  @use '../../styles/mixins/overlay';
  @use '../../styles/mixins/display';
  @use '../../styles/mixins/media';
  @use '../../styles/mixins/button';

  div {
    z-index: calc(var(--z-index) + 1000);

    position: fixed;
    @include display.inset;

    @include overlay.backdrop(dark);

    &.close {
      @include interaction.tappable;
    }
  }

  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    width: fit-content;

    background: transparent;
  }

  .spinner {
    position: relative;
    background: transparent;
  }

  .close {
    align-self: flex-end;
  }

  .text {
    font-size: var(--font-size-very-small);
    color: var(--label-color);
  }

  button {
    font-size: 1.4em;
    color: var(--color-white);
    background-color: var(--color-primary);
    margin: 0 auto;
  }

  .close {
    margin-top: var(--padding-2x);
  }
</style>
