import type { ActorSubclass, HttpAgentOptions, Identity } from '@dfinity/agent';
import { Actor, HttpAgent } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';
import type { Principal } from '@dfinity/principal';
import type { _SERVICE as Backend } from '../declarations/backend/backend.did.js';
import { idlFactory } from '../declarations/backend/index.js';
import { exportIdentity } from './identity.js';

const backendID = 'ma7mv-qyaaa-aaaaj-qa3xq-cai';

export function createActor<T>(
  canisterId: string | Principal,
  idlFactory: IDL.InterfaceFactory,
  options: HttpAgentOptions,
): ActorSubclass<T> {
  const agent = new HttpAgent({
    host: 'https://icp0.io',
    ...options,
  });
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
}

export function authenticatedBackendActor(): ActorSubclass<Backend> {
  let identity = exportIdentity();
  return createActor(backendID, idlFactory, {
    identity,
  });
}

export function nonAuthenticatedBackendActor(): ActorSubclass<Backend> {
  return createActor(backendID, idlFactory, {});
}

export function customBackendActor(identity: Identity): ActorSubclass<Backend> {
  return createActor(backendID, idlFactory, {
    identity,
  });
}
