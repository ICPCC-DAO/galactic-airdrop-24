<script lang="ts">
  import { type AuthStoreData, authStore } from '$lib/stores/auth.store';
  import { browser } from '$app/environment';
  import { userStore } from '$lib/stores/user.store';
  import Spinner from '$lib/components/ui/Spinner.svelte';
  import Overlays from '$lib/components/core/Overlays.svelte';
  import { toasts } from '$lib/stores/toasts.store';
  import { isNullish } from '$lib/utils/utils';
  import { signOut } from '$lib/services/auth.services';
  const init = async () => await syncAuthStore();

  const syncAuthStore = async () => {
    if (!browser) {
      return;
    }

    try {
      await authStore.sync(); // Sync the auth store
      if (await authStore.isAuthenticated()) {
        userStore.sync();
      } else {
      }
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const initUser = async ({ identity }: AuthStoreData) => {
    if (isNullish(identity)) {
      return;
    }

    try {
      // TODO: Initialize the user here
    } catch (err: unknown) {
      toasts.error({
        text: `Error initializing the user.`,
        detail: err,
      });

      // There was an error so, we sign the user out otherwise skeleton and other spinners will be displayed forever
      await signOut();
    }
  };

  $: (async () => initUser($authStore))();
</script>

<svelte:window on:storage={syncAuthStore} />

{#await init()}
  <Spinner />
{:then _}
  <slot />
  <Overlays />
{/await}

<style lang="scss" global>
  @import '../lib/styles/global.scss';
</style>
