import { getPricesICPSwap, getPricesNeutrinite } from '$lib/api/backend.api';
import { writable, type Readable } from 'svelte/store';
import { authStore } from './auth.store';

export interface PricesStoreData {
    prices: Map<string, number>; // SYMBOL -> USD price
}

export interface PricesStore extends Readable<PricesStoreData> {
    syncPrices: () => Promise<void>;
    clearPrices: () => Promise<void>;
}

const initPricesStore = (): PricesStore => {
    const { subscribe, update } = writable<PricesStoreData>({
        prices: new Map(),
    });

    let pricesInterval: ReturnType<typeof setInterval> | null = null;

    const syncPrices = async () => {
        console.log('Syncing prices');
        try {
            const pricesNeutrinitePromise = getPricesNeutrinite();
            const pricesICPSwapPromise = getPricesICPSwap();

            // Promise.all waits for all promises to resolve
            const [pricesNeutrinite, pricesICPSwap] = await Promise.all([
                pricesNeutrinitePromise,
                pricesICPSwapPromise,
            ]);

            // Merge the two maps
            const mergedPrices = new Map([...pricesNeutrinite, ...pricesICPSwap]);

            update((state) => ({
                prices: mergedPrices,
            }));

        } catch (error) {
            console.error('Error fetching prices:', error);
        }
    };

    const clearPrices = async () => {
        update(() => ({
            prices: new Map(),
        }));
    };

    authStore.subscribe((state) => {
        if (state.identity) {
            if (pricesInterval === null) {
                syncPrices();
                pricesInterval = setInterval(syncPrices, 60000); // Sync prices every minute
            }
        } else {
            if (pricesInterval !== null) {
                clearInterval(pricesInterval);
                pricesInterval = null;
            }
        }
    });

    return {
        subscribe,
        syncPrices,
        clearPrices,
    };
};

export const pricesStore = initPricesStore();
