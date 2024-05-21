<script lang="ts">
  import { toasts } from '$lib/stores/toasts.store';
  import { fade, fly } from 'svelte/transition';
  import type { ToastLevel, ToastMsg } from '$lib/types/toast';
  import IconClose from '$lib/components/icons/IconClose.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { isNullish } from '$lib/utils/utils';

  export let msg: ToastMsg;

  // Adjust the close function to use the toast's id
  const close = () => {
    if (msg && msg.id !== undefined) {
      toasts.hide(msg.id);
    }
  };

  let text: string;
  let level: ToastLevel;
  let detail: string | undefined;

  $: ({ text, level, detail } = msg);

  let timer: number | undefined;

  onMount(() => {
    const { duration, id } = msg;

    if (!duration || duration <= 0) {
      return;
    }

    setTimeout(() => toasts.hide(id), duration); // Pass `id` to `hide`
  });

  onDestroy(() => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  });

  let reorgDetail: string | undefined;
  $: if (isNullish(detail)) {
    reorgDetail = undefined;
  } else {
    // Present the message we throw in the backend first
    const trapKeywords = 'trapped explicitly:';
    if (!detail.includes(trapKeywords)) {
      reorgDetail = detail;
    } else {
      const splits = detail.split(trapKeywords);
      const last = splits.splice(-1);
      reorgDetail = `${last[0]?.trim() ?? ''}${
        splits.length > 0 ? ` | Stacktrace: ${splits.join('').trim()}` : ''
      }`;
    }
  }
</script>

<div
  role="dialog"
  class="toast"
  class:error={level === 'error'}
  class:warn={level === 'warning'}
  class:success={level === 'success'}
  class:info={level === 'info'}
  in:fly={{ y: 100, duration: 200 }}
  out:fade={{ delay: 100 }}
>
  <p title={text}>
    {text}{reorgDetail ? ` | ${reorgDetail}` : ''}
  </p>

  <button class="text" on:click={close} aria-label="Close"><IconClose /></button
  >
</div>

<style lang="scss">
  .toast {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--color-primary);
    color: var(--color-primary-contrast);

    width: 100%; // Make width responsive within the container
    padding: var(--padding-2x) calc(var(--padding-2x) * 2);
    box-sizing: border-box;

    margin-bottom: 1rem; // space between toasts

    @media (min-width: 768px) {
      max-width: var(--section-max-width);
    }

    &.success {
      background: var(--color-green);
      color: var(--color-dark);
    }

    &.info {
      background: var(--color-blue);
      color: var(--color-white);
    }

    &.error {
      background: var(--color-red);
      color: var(--color-white);
    }

    &.warn {
      background: var(--color-yellow);
      color: var(--color-dark);
    }
  }

  p {
    margin: var(--padding);
    font-size: 1.2rem;
    font-weight: 500;
  }
</style>
