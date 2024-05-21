import csvParser from 'csv-parser';
import { authenticatedBackendActor } from '../../utils/actor';
import { TransferResult } from '../../../src/declarations/backend/backend.did';
import { createReadStream } from "fs";
import { Principal } from '@dfinity/principal';


const AIRDROP_ID = 30;

const CSV_DIR_TRANSFER_RESULT = `node/scripts/logs/transfers`;
let transferResult: TransferResult = [];

async function readTransferResult(): Promise<void> {
    return new Promise((resolve, reject) => {
        createReadStream(`${CSV_DIR_TRANSFER_RESULT}/airdrop_${AIRDROP_ID}.csv`)
            .pipe(csvParser())
            .on('data', (data) => {
                transferResult.push([Principal.fromText(data.UserId), Principal.fromText(data.Wallet), { Distributed: BigInt(data.TransferId) }]);
            })
            .on('end', () => {
                console.log(`Transfer results have been read`);
                resolve();
            })
            .on('error', (error) => {
                console.error(`CSV data processing error: ${error} 🔴`);
                reject(error);
            });
    });

}

async function notifyDistribution() {
    console.log(`Notifying distribution for airdrop ${AIRDROP_ID}`);
    const actor = authenticatedBackendActor();
    await readTransferResult();
    await actor.notifyDistribution(BigInt(AIRDROP_ID), transferResult);
    console.log("Distribution notified 🟢");
};

await notifyDistribution();