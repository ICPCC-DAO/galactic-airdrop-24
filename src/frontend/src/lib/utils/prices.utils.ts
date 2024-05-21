import { pricesStore } from '$lib/stores/prices.store';
import type { PricesStore } from '$lib/stores/prices.store';
import { get } from 'svelte/store';
import type { PrizeFrontend } from '../types/prizes.types'

export function getValuePrize(symbol: string, realAmount: bigint, decimal: bigint, priceStore: PricesStore): number {
    let prices = get(pricesStore).prices;
    for (let [key, value] of prices) {
        if (key === symbol) {
            let amount = Number(realAmount) / Number(10n ** decimal);
            return amount * value;
        }
    }
    return 0;
}


// Returns the total $USD value of all prizes
// Arguments:
// - prizes: List of prizes
// - prices: Map of prices (usually comes from pricesStore)
export function getTotalValuePrizes(prizes: PrizeFrontend[], priceStore: PricesStore): number {
    let totalValue = 0;
    for (let prize of prizes) {
        totalValue += getValuePrize(prize.symbol, prize.amount, prize.decimals, priceStore);
    }
    return totalValue;
}
