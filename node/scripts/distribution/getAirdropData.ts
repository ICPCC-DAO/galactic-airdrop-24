import { authenticatedBackendActor } from '../../utils/actor';
import { createWriteStream, mkdirSync, existsSync } from "fs";
import { join } from 'path';


// Define the directory for the CSV files for logging
const baseDir = `node/scripts/logs/conf/`;

// Ensure the directory exists
if (!existsSync(baseDir)) {
    mkdirSync(baseDir, { recursive: true });
}

// Import the necessary data from the backend canister for each airdrop and save it in a csv file
export async function getAirdropData(): Promise<void> {
    const actor = authenticatedBackendActor();
    const results = await actor.exportDataAirdrop()
    const csvLogFile = join(baseDir, `conf_airdrop_data.csv`);
    const csvStream = createWriteStream(csvLogFile, { flags: 'w' });
    csvStream.write('Email,Principal,Wallet,Amount\n');
    results.forEach(transfer => {
        csvStream.write(`${transfer[0]}, ${transfer[1].toString()}, ${transfer[2].toString()}, ${transfer[3]}\n`);
    });
    csvStream.end();
}


await getAirdropData();
