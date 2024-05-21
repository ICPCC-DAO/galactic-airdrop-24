import type { Identity } from '@dfinity/agent';
import pkgIdentity from '@dfinity/identity';
import pkgIdentity256k1 from '@dfinity/identity-secp256k1';
import pemfile from 'pem-file';
import { execSync } from 'child_process';

const { Secp256k1KeyIdentity } = pkgIdentity256k1;
const { Ed25519KeyIdentity } = pkgIdentity;

/**
 * Source MOPS: https://github.com/ZenVoich/mops/blob/master/cli/pem.js
 * Forum: https://forum.dfinity.org/t/using-dfinity-agent-in-node-js/6169/60?u=peterparker
 */
const decode = (rawKey: any) => {
  const buf = pemfile.decode(rawKey);

  if (rawKey.includes('EC PRIVATE KEY')) {
    if (buf.length !== 118) {
      throw 'expecting byte length 118 but got ' + buf.length;
    }

    return Secp256k1KeyIdentity.fromSecretKey(buf.slice(7, 39));
  }

  if (buf.length !== 85) {
    throw 'expecting byte length 85 but got ' + buf.length;
  }

  let secretKey = Buffer.concat([buf.slice(16, 48), buf.slice(53, 85)]);
  return Ed25519KeyIdentity.fromSecretKey(secretKey);
};

export function exportIdentity(): Identity {
  const commandOutput = execSync('dfx identity export docker').toString('utf-8');
  return decode(commandOutput);
}

export function generateIdentity(): Identity {
  return Ed25519KeyIdentity.generate();
}
