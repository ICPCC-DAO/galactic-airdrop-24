import { authenticatedBackendActor } from '../../utils/actor';
import { createWriteStream, mkdirSync, existsSync } from "fs";
import { join } from 'path';
import { Principal } from '@dfinity/principal';


// Define the directory for the CSV files for logging
const baseDir = `node/scripts/logs/user/`;
const userId = Principal.fromText("dogz6-fcwzc-m2k2k-ylrhg-56i4c-xx6ju-pgkjt-zdixq-vx5x2-5rh3v-jae");

// Ensure the directory exists
if (!existsSync(baseDir)) {
    mkdirSync(baseDir, { recursive: true });
}

// Import the necessary data from the backend canister for each airdrop and save it in a csv file
export async function getPrizeUser(): Promise<void> {
    const actor = authenticatedBackendActor();
    const results = await actor.getUserAdmin(userId);
    if ('ok' in results) {
        const prizes = results.ok.prizes;
        const csvLogFile = join(baseDir, `${userId.toText()}.csv`);
        const csvStream = createWriteStream(csvLogFile, { flags: 'w' });
        csvStream.write('AirdropId,LedgerId,Symbol,Amount,TransferId\n');
        prizes.forEach(prize => {
            //@ts-ignore
            csvStream.write(`${prize.airdropId},${prize.ledgerId},${prize.symbol},${prize.amount},${prize.distributionStatus.Distributed}\n`);
        });
        csvStream.end();
    } else {
        console.error(`Error getting prizes for user ${userId.toText()} 🔴`);
    }

}


await getPrizeUser();
