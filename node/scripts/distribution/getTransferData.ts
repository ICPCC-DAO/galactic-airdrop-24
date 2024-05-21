import { authenticatedBackendActor } from '../../utils/actor';
import { createWriteStream, mkdirSync, existsSync } from "fs";
import { join } from 'path';
import { TransferData } from '../../../src/declarations/backend/backend.did';
import { AIRDROP_IDS } from '../data/const/airdrops.const';
import { Transfer } from '../../../src/declarations/icrc1/icrc1.did';

// Define the directory for the CSV files for logging
const baseDir = `node/scripts/logs/airdrops/`;

// Ensure the directory exists
if (!existsSync(baseDir)) {
    mkdirSync(baseDir, { recursive: true });
}

// Import the necessary data from the backend canister for each airdrop and save it in a csv file
export async function getTransfersDataForAllAirdrops(): Promise<TransferData[]> {
    const actor = authenticatedBackendActor();
    const allTransferData: TransferData[] = [];

    for (const airdropId of AIRDROP_IDS) {
        const results = await actor.getTransfersDataAirdrop(BigInt(airdropId));
        if ('ok' in results) {
            const csvLogFile = join(baseDir, `airdrop_${airdropId}.csv`);
            const csvStream = createWriteStream(csvLogFile, { flags: 'w' });
            csvStream.write('Principal,Wallet,Amount\n');
            results.ok.forEach(transfer => {
                csvStream.write(`${transfer[0].toString()},${transfer[1].toString()},${transfer[2]}\n`);
            });
            csvStream.end();
            allTransferData.push(results.ok);
        } else {
            throw new Error(`Error getting transfers data for airdrop ${airdropId}: ${results.err}`);
        }
    }

    return allTransferData;
}

await getTransfersDataForAllAirdrops();
