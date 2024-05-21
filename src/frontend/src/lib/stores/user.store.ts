import { goto } from '$app/navigation';
import type { User } from '$declarations/backend/backend.did';
import { getUser } from '$lib/api/backend.api';
import { writable, type Readable } from 'svelte/store';
import { authStore } from './auth.store';
export interface UserStoreData {
  user: User | undefined | null;
}

export interface UserStore extends Readable<UserStoreData> {
  sync: () => Promise<void>;
  syncRedirect: () => Promise<void>;
  clear: () => Promise<void>;
}

const initUserStore = (): UserStore => {
  const { subscribe, set } = writable<UserStoreData>({
    user: undefined,
  });

  return {
    subscribe,
    sync: async () => {
      try {
        const user = await getUser();
        set({ user: user });
      } catch (error) {
        console.error('Error fetching your information:', error);
      }
    },
    syncRedirect: async () => {
      try {
        console.log('Syncing user');
        const user = await getUser();

        set({ user: user });
        if (user && user.verificationTime.length > 0) {
          goto('/home');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    },
    clear: async () => {
      set({
        user: undefined,
      });
    },
  };
};

export const userStore = initUserStore();

authStore.subscribe((state) => {
  if (state.identity) {
    userStore.sync();
  }
});
