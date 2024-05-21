import { idlFactory as idlFactoryBackend } from '$declarations/backend';
import type { _SERVICE as BackendActor } from '$declarations/backend/backend.did';
import type { _SERVICE as NeutriniteActor } from '$declarations/neutrinite/neutrinite.did';
import { idlFactory as idlFactoryNeutrinite } from '$declarations/neutrinite/neutrinite.did';
import type { _SERVICE as ICPSwapActor } from '$declarations/icpswap/icpswap.did';
import { idlFactory as idlFactoryICPSwap } from '$declarations/icpswap/icpswap.did';
import type { _SERVICE as ICPSwapTokenActor } from '$declarations/icpswap_token/icpswap/icpswap_token.did';
import { idlFactory as idlFactoryICPSwapToken } from '$declarations/icpswap_token/icpswap/icpswap_token.did';
import type { _SERVICE as ExtActor } from '$declarations/ext/ext.did';
import { idlFactory as idlFactoryExt } from '$declarations/ext/ext.did';

import { authStore } from '$lib/stores/auth.store';
import {
  Actor,
  HttpAgent,
  type ActorConfig,
  type Identity,
} from '@dfinity/agent';
import { get } from 'svelte/store';

export const getAuthenticatedBackendActor = async (): Promise<BackendActor> => {
  const identity: Identity | undefined | null = get(authStore).identity;
  if (!identity) throw new Error('Not logged ');
  const canisterId = import.meta.env.VITE_BACKEND_CANISTER_ID;
  const host =
    process.env.DFX_NETWORK == 'ic'
      ? 'https://icp0.io'
      : 'http://localhost:4943';
  const agent = new HttpAgent({
    identity,
    host,
  });
  if (process.env.DFX_NETWORK !== 'ic') {
    await agent.fetchRootKey();
  }

  let configuration: ActorConfig = {
    canisterId,
    agent,
  };

  return Actor.createActor(idlFactoryBackend, configuration);
};

export const getNonAuthenticatedBackendActor =
  async (): Promise<BackendActor> => {
    const canisterId = import.meta.env.VITE_BACKEND_CANISTER_ID;
    const host =
      process.env.DFX_NETWORK == 'ic'
        ? 'https://icp0.io'
        : 'http://localhost:4943';

    const agent = new HttpAgent({
      host,
      identity: undefined,
    });

    if (process.env.DFX_NETWORK !== 'ic') {
      await agent.fetchRootKey();
    }

    let configuration: ActorConfig = {
      canisterId,
      agent,
    };
    return Actor.createActor(idlFactoryBackend, configuration);
  };


export const getNonAuthenticatedNeutriniteActor = async (): Promise<NeutriniteActor> => {
  const canisterId = "u45jl-liaaa-aaaam-abppa-cai";
  const host =
    process.env.DFX_NETWORK == 'ic'
      ? 'https://icp0.io'
      : 'http://localhost:4943';
  const agent = new HttpAgent({ host });
  if (process.env.DFX_NETWORK !== 'ic') {
    await agent.fetchRootKey();
  }

  let configuration: ActorConfig = {
    canisterId,
    agent,
  };

  return Actor.createActor(idlFactoryNeutrinite, configuration);
}

export async function getNonAuthenticatedICPSwapActor(): Promise<ICPSwapActor> {
  const canisterId = "ggzvv-5qaaa-aaaag-qck7a-cai";

  const identity: Identity | undefined | null = get(authStore).identity;
  if (!identity) throw new Error('Not logged ');

  const host = process.env.DFX_NETWORK == 'ic' ? 'https://icp0.io' : 'http://localhost:4943';

  const agent = new HttpAgent({
    identity,
    host,
  });

  if (process.env.DFX_NETWORK !== 'ic') {
    await agent.fetchRootKey();
  }

  let configuration: ActorConfig = {
    canisterId,
    agent,
  };

  return Actor.createActor(idlFactoryICPSwap, configuration);
};

export async function getNonAuthenticatedICPSwapTokenActor(canisterId: string): Promise<ICPSwapTokenActor> {
  const host = process.env.DFX_NETWORK == 'ic' ? 'https://icp0.io' : 'http://localhost:4943';

  const agent = new HttpAgent({
    host,
  });

  if (process.env.DFX_NETWORK !== 'ic') {
    await agent.fetchRootKey();
  }

  let configuration: ActorConfig = {
    canisterId,
    agent,
  };

  return Actor.createActor(idlFactoryICPSwapToken, configuration);
}

export async function getAuthenticatedExtActor(): Promise<ExtActor> {
  const canisterId = "w2nny-fyaaa-aaaak-qce3a-cai";
  const identity: Identity | undefined | null = get(authStore).identity;
  if (!identity) throw new Error('Not logged ');
  const host = process.env.DFX_NETWORK == 'ic' ? 'https://icp0.io' : 'http://localhost:4943';

  const agent = new HttpAgent({
    identity,
    host,
  });

  if (process.env.DFX_NETWORK !== 'ic') {
    await agent.fetchRootKey();
  }

  let configuration: ActorConfig = {
    canisterId,
    agent,
  };

  return Actor.createActor(idlFactoryExt, configuration);

};