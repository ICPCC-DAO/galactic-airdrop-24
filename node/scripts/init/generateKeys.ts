// This script is used to generate identities only if they do not exist
// The keys of the identities are stored in the keys/keys.json file
import { Principal } from '@dfinity/principal';
import { generateKey } from '../../utils/keys';
import * as fs from 'fs';
import { NUMBER_OF_USERS } from '../tests/tests.const';

const keysFilePath = 'keys/keys.json';

// Read existing keys from a file
function readExistingKeys(filePath: string): Set<string> {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return new Set(JSON.parse(data));
    } catch (error) {
        console.error('Failed to read keys file:', error);
        return new Set<string>();  // Return an empty set if the file doesn't exist or an error occurs
    }
}

// Write updated keys to a file
function writeKeys(filePath: string, keys: Set<string>) {
    fs.writeFileSync(filePath, JSON.stringify([...keys]), 'utf8');
}

// Generate N identities (returning an array of Principals)
export function generatePrincipals() {
    let existingKeys = readExistingKeys(keysFilePath);
    let principals: Principal[] = [];
    let updated = false;

    for (let i = 0; i < NUMBER_OF_USERS; i++) {
        const keyName = `identity-${i}`;

        if (!existingKeys.has(keyName)) {
            try {
                let identity = generateKey(keyName);
                console.log(`Identity ${i}: ${identity.getPrincipal().toText()} successfully created 🟢`);
                principals.push(identity.getPrincipal());
                existingKeys.add(keyName);
                updated = true;
            } catch (error) {
                console.error(`Identity ${i}: failed to create :`, error + '🔴');
            }
        } else {
            console.log(`Identity ${i} already exists, skipping.`);
        }
    }

    if (updated) {
        writeKeys(keysFilePath, existingKeys);
    }

    return principals;
}
generatePrincipals();
