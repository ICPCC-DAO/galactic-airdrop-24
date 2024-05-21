import { authStore, type AuthSignInParams } from '$lib/stores/auth.store';
import { userStore } from '$lib/stores/user.store';
import { busy } from '$lib/stores/busy.store';
import { toasts } from '$lib/stores/toasts.store';
import { goto } from '$app/navigation';


const clearDataStores = () => {
};

export const signIn = async (
  params: AuthSignInParams,
): Promise<{ success: 'ok' | 'cancelled' | 'error'; err?: unknown }> => {
  busy.show();

  try {
    await authStore.signIn(params);
    userStore.syncRedirect();
    // app.sync()
    return { success: 'ok' };
  } catch (err: unknown) {
    if (err === 'UserInterrupt') {
      // We do not display an error if user explicitly cancelled the process of sign-in
      return { success: 'cancelled' };
    }

    toasts.error({
      text: `Something went wrong while sign-in.`,
      detail: err,
    });

    return { success: 'error', err };
  } finally {
    busy.stop();
  }
};

export const signOut = async () => {
  await authStore.signOut();

  clearDataStores();
};

export const idleSignOut = async () => {
  await signOut();
};


export const signOutClose = async () => {
  await signOut();
  goto('/');
};