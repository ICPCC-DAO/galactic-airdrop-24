import type { AirdropDashboard } from '$declarations/backend/backend.did';
import { getAllAirdrops, getQualifiedAirdrops } from '$lib/api/backend.api';
import { writable, type Readable } from 'svelte/store';
import { authStore } from './auth.store';

export interface AirDropStoreData {
  airdrops: AirdropDashboard[];
  qualifiedAirdrops: BigInt[];
}

export interface AirdropStore extends Readable<AirDropStoreData> {
  sync: () => Promise<void>;
  clear: () => Promise<void>;
}

const initAirdropStore = (): AirdropStore => {
  const { subscribe, set } = writable<AirDropStoreData>({
    airdrops: [],
    qualifiedAirdrops: [],
  });

  let intervalId: ReturnType<typeof setInterval> | null = null;

  const sync = async () => {
    try {
      let airdrops = await getAllAirdrops();
      let qualifiedAirdrops = await getQualifiedAirdrops();
      set({
        airdrops,
        qualifiedAirdrops,
      });
    } catch (error) {
      console.error('Error fetching airdrops:', error);
    }
  };

  const startSync = () => {
    if (intervalId === null) {
      intervalId = setInterval(sync, 5000); // Sync every 5000 ms (5 seconds)
    }
  };

  const stopSync = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  authStore.subscribe((state) => {
    if (state.identity) {
      sync();
      startSync();
    } else {
      stopSync();
    }
  });

  return {
    subscribe,
    sync,
    clear: async () => {
      stopSync(); // Optional: Stop syncing when clearing data
      set({
        airdrops: [],
        qualifiedAirdrops: [],
      });
    },
  };
};

export const airdropsStore = initAirdropStore();
