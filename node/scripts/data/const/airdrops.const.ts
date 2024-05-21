// Define maximum duration for the airdrop in nanoseconds (equivalent to 5 minutes)
export const MAX_DURATION_NANOSECONDS = 5 * 60 * 1000 * 1000 * 1000;

// Define maximum number of participants for the airdrop (5000 participants)
export const MAX_PARTICIPANTS = 10000;

// Define distribution tiers for the airdrop prizes: [Tier1, Tier2, Tier3]
// Tier1: 0.5% of total prizes, Tier2: 50% of remaining prizes, Tier3: 49.5% of remaining prizes
export const distributionTiers: [number, number, number] = [0.005, 0.5, 0.495];

// Define distribution of prizes among tiers: [Tier1, Tier2, Tier3]
// Tier1: 50% of total prizes, Tier2: 25% of remaining prizes, Tier3: 25% of remaining prizes
export const distributionPrizes: [number, number, number] = [0.50, 0.25, 0.25];

export const AIRDROP_IDS = Array.from({ length: 41 }, (_, i) => BigInt(i)); // Generates an array from 0n to 40n