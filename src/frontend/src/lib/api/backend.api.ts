import type {
  User,
  AirdropDashboard,
} from '$declarations/backend/backend.did';
import {
  getAuthenticatedBackendActor,
  getNonAuthenticatedNeutriniteActor,
  getNonAuthenticatedICPSwapActor,
  getNonAuthenticatedICPSwapTokenActor,
  getAuthenticatedExtActor
} from '$lib/utils/actor.utils';
import { isErr } from '$lib/utils/did.utils';

export const getUser = async (): Promise<User | null> => {
  const backendActor = await getAuthenticatedBackendActor();
  let opt = await backendActor.getUser();
  if (isErr(opt)) {
    console.error(opt.err);
    return null;
  } else {
    return opt.ok;
  }
};

export const getAllAirdrops = async (): Promise<AirdropDashboard[]> => {
  const backendActor = await getAuthenticatedBackendActor();
  let result = await backendActor.getAllAirdropsDashboard();
  return result;
}


export const getQualifiedAirdrops = async (): Promise<BigInt[]> => {
  const backendActor = await getAuthenticatedBackendActor();
  let result = await backendActor.getQualifiedAirdrops();
  return result;
}

export const getPricesNeutrinite = async (): Promise<Map<string, number>> => {
  let prices = new Map<string, number>();
  const neutriniteActor = await getNonAuthenticatedNeutriniteActor();
  const ICPSwapActor = await getNonAuthenticatedICPSwapActor();

  // Query the canister from Neutrinite DAO
  let result = await neutriniteActor.get_latest();
  // Iterate over the result to extract symbol and price
  result.forEach(([tokenIds, tokenSymbol, price]) => {
    //tokenSymbol is the form of SYMBOL/USD or SYMBOL/ICP so we need to split it
    let realSymbol = tokenSymbol.split('/')[0];
    // We only want to store the price in USD so we need to keep only if the second part is USD
    if (tokenSymbol.split('/')[1] !== 'USD') {
      return;
    }
    // Change 'CTZ' to 'CAT'
    if (realSymbol === 'CTZ') {
      realSymbol = 'CAT';
    }
    prices.set(realSymbol, price);
  });
  return prices;
}


export const getPricesICPSwap = async (): Promise<Map<string, number>> => {
  let prices = new Map<string, number>();
  const ICPSwapActor = await getNonAuthenticatedICPSwapActor();

  const clownCanisterId = 'fssrl-zyaaa-aaaak-afkia-cai';
  const alienCanisterId = '7tvr6-fqaaa-aaaan-qmira-cai'

  // Get all the canister storage ids 
  let promise1 = ICPSwapActor.tokenStorage(clownCanisterId);
  let promise2 = ICPSwapActor.tokenStorage(alienCanisterId);
  let [clownStorage, alienStorage] = await Promise.all([promise1, promise2]);

  // Get the prices info
  const ICPSwapTokenActorClown = await getNonAuthenticatedICPSwapTokenActor(clownStorage[0] as string);
  const ICPSwapTokenActorAlien = await getNonAuthenticatedICPSwapTokenActor(alienStorage[0] as string);

  let promise4 = ICPSwapTokenActorClown.getTokenPricesData(clownCanisterId, BigInt(0), BigInt(86400), BigInt(100));
  let promise5 = ICPSwapTokenActorAlien.getTokenPricesData(alienCanisterId, BigInt(0), BigInt(86400), BigInt(100));

  let [clownPricesData, alienPricesData] = await Promise.all([promise4, promise5]);

  let alienPrice = alienPricesData[0].high
  let vaultBetPrice = 1;

  prices.set('CTX', 0.0000711);
  prices.set('ALIEN', alienPrice);
  prices.set('VBT', vaultBetPrice);
  prices.set('EYES', 0.0004);
  return prices;
}

