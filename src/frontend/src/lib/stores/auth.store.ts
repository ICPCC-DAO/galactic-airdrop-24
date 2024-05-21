import {
  AUTH_MAX_TIME_TO_LIVE,
  AUTH_POPUP_HEIGHT,
  AUTH_POPUP_WIDTH,
} from '$lib/constants/constants';
import { createAuthClient } from '$lib/utils/auth.utils';
import { popupCenter } from '$lib/utils/window.utils';
import type { Identity } from '@dfinity/agent';
import type { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { derived, writable, type Readable } from 'svelte/store';

export interface AuthStoreData {
  identity: Identity | undefined | null;
}

let authClient: AuthClient | undefined | null;

export interface AuthSignInParams {
  domain?: 'internetcomputer.org' | 'ic0.app';
}

export interface AuthStore extends Readable<AuthStoreData> {
  sync: () => Promise<void>;
  signIn: (params: AuthSignInParams) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: () => Promise<boolean>;
  getPrincipal: () => Promise<Principal>;
}

const initAuthStore = (): AuthStore => {
  const { subscribe, set, update } = writable<AuthStoreData>({
    identity: undefined,
  });

  return {
    subscribe,

    sync: async () => {
      authClient = authClient ?? (await createAuthClient());
      const isAuthenticated: boolean = await authClient.isAuthenticated();

      set({
        identity: isAuthenticated ? authClient.getIdentity() : null,
      });
    },

    signIn: ({ domain }: AuthSignInParams) =>
      // eslint-disable-next-line no-async-promise-executor
      new Promise<void>(async (resolve, reject) => {
        authClient = authClient ?? (await createAuthClient());

        const identityProvider: string =
          process.env.DFX_NETWORK === 'ic'
            ? 'https://identity.ic0.app'
            : `http://${process.env.INTERNET_IDENTITY_CANISTER_ID}.localhost:4943`;
        await authClient?.login({
          maxTimeToLive: AUTH_MAX_TIME_TO_LIVE,
          onSuccess: () => {
            update((state: AuthStoreData) => ({
              ...state,
              identity: authClient?.getIdentity(),
            }));

            resolve();
          },
          onError: reject,
          identityProvider,
          windowOpenerFeatures: popupCenter({
            width: AUTH_POPUP_WIDTH,
            height: AUTH_POPUP_HEIGHT,
          }),
        });
      }),

    signOut: async () => {
      const client: AuthClient = authClient ?? (await createAuthClient());

      await client.logout();

      authClient = null;

      update((state: AuthStoreData) => ({
        ...state,
        identity: null,
      }));
    },
    isAuthenticated: async () => {
      return authClient?.isAuthenticated() ?? false;
    },
    getPrincipal: async () => {
      return authClient?.getIdentity().getPrincipal() ?? Principal.anonymous();
    },
  };
};

export const authStore = initAuthStore();

export const authSignedInStore: Readable<boolean> = derived(
  authStore,
  ({ identity }) => identity !== null && identity !== undefined,
);
