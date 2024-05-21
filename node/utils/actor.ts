import type { ActorSubclass, HttpAgentOptions, Identity } from '@dfinity/agent';
import { Actor, HttpAgent } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';
import type { Principal } from '@dfinity/principal';
import { readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { idlFactory as idlFactoryBackend } from '../../src/declarations/backend';
import { idlFactory as idlFactoryICRC1 } from '../../src/declarations/icrc1/icrc1.did';
import type { _SERVICE as Backend } from '../../src/declarations/backend/backend.did';
import type { _SERVICE as ICRC_1 } from '../../src/declarations/icrc1/icrc1.did';
import { exportIdentity } from './identity';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function createActor<T>(
  canisterId: string | Principal,
  idlFactory: IDL.InterfaceFactory,
  options: HttpAgentOptions,
): ActorSubclass<T> {
  const agent = new HttpAgent({
    host:
      process.env.DFX_NETWORK === 'ic'
        ? 'https://icp0.io'
        : 'http://127.0.0.1:4943',
    ...options,
  });
  if (process.env.DFX_NETWORK !== 'ic') {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        'Unable to fetch root key. Check to ensure that your local replica is running',
      );
      console.error(err);
    });
  }
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
}

const canisters =
  process.env.DFX_NETWORK === 'ic'
    ? JSON.parse(
      readFileSync(`${__dirname}/../../canister_ids.json`).toString(),
    )
    : JSON.parse(
      readFileSync(
        `${__dirname}/../../.dfx/local/canister_ids.json`,
      ).toString(),
    );
const backendID =
  process.env.DFX_NETWORK === 'ic'
    ? canisters.backend.ic
    : canisters.backend.local;

export function authenticatedBackendActor(): ActorSubclass<Backend> {
  let identity = exportIdentity('seb_2');
  return createActor(backendID, idlFactoryBackend, {
    identity,
  });
}

export function nonAuthenticatedBackendActor(): ActorSubclass<Backend> {
  return createActor(backendID, idlFactoryBackend, {});
}

export function customBackendActor(identity: Identity): ActorSubclass<Backend> {
  return createActor(backendID, idlFactoryBackend, {
    identity,
  });
}

export function authenticatedICRC1Actor(identity: Identity, canisterId: Principal): ActorSubclass<ICRC_1> {
  return createActor(canisterId, idlFactoryICRC1, {
    identity,
  });
}