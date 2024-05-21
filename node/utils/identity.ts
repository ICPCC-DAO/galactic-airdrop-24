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
export function exportIdentity(name: string): Identity {
  const commandOutput = execSync(`dfx identity export ${name}`).toString('utf-8');
  const privateKey = extractPrivateKey(commandOutput);
  return decode(privateKey);
}

function extractPrivateKey(output: string): string {
  const lines = output.split('\n');

  let startIndex = -1;
  let endIndex = -1;

  // Find the first line containing "BEGIN" and "PRIVATE KEY"
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("BEGIN") && lines[i].includes("PRIVATE KEY")) {
      startIndex = i;
      break;
    }
  }

  if (startIndex === -1) {
    throw new Error("Invalid identity export output: missing BEGIN PRIVATE KEY section");
  }

  // Find the last line containing "END" and "PRIVATE KEY"
  for (let i = startIndex + 1; i < lines.length; i++) {
    if (lines[i].includes("END") && lines[i].includes("PRIVATE KEY")) {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) {
    throw new Error("Invalid identity export output: missing END PRIVATE KEY section");
  }

  // Concatenate lines between startIndex and endIndex
  const privateKeyLines = lines.slice(startIndex, endIndex + 1);
  return privateKeyLines.join('\n');
}
export function generateIdentity(): Identity {
  return Ed25519KeyIdentity.generate();
}
