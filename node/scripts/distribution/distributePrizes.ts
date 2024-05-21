import { authenticatedBackendActor } from '../../utils/actor';
import { exportIdentity } from '../../utils/identity';
import csvParser from 'csv-parser';
import { join } from 'path';
import { createReadStream, createWriteStream, existsSync } from 'fs';
import type { TransferData, TransferResult, TransferError } from '../../../src/declarations/backend/backend.did';
import { Principal } from '@dfinity/principal';
import { authenticatedICRC1Actor } from '../../utils/actor';

// Number of transfers to process at once
const AIRDROP_ID: number = 30;
const BATCH_SIZE = 100;

const CSV_DIR_TRANSFER_DATA = `node/scripts/logs/airdrops`;
const CSV_DIR_TRANSFER_RESULT = `node/scripts/logs/transfers`;

let transferData: TransferData = [];
let transferResults: TransferResult = [];
let startTime = new Date();
console.log(`START :: performTransfers.ts :: ${startTime.toUTCString()}`);

// Import the necessary data from the CSV file
async function loadAirdropData(): Promise<void> {
    let totalAmount = BigInt(0);
    let numberOfParticipants = BigInt(0);

    return new Promise((resolve, reject) => {
        createReadStream(`${CSV_DIR_TRANSFER_DATA}/airdrop_${AIRDROP_ID}.csv`)
            .pipe(csvParser())
            .on('data', (data) => {
                transferData.push([Principal.fromText(data.Principal), Principal.fromText(data.Wallet), BigInt(data.Amount)]);
                totalAmount += BigInt(data.Amount);
                numberOfParticipants++;
            })
            .on('end', () => {
                console.log(`CSV: Total amount ${totalAmount}, Participants ${numberOfParticipants} 🟢`);
                resolve();
            })
            .on('error', (error) => {
                console.error(`CSV data processing error: ${error} 🔴`);
                reject(error);
            });
    });
}

export async function performTransfers() {

    await loadAirdropData();
    const identity = exportIdentity('airdrop_wallet');
    const airdropActor = authenticatedBackendActor();
    const results = await airdropActor.getAirdrop(BigInt(AIRDROP_ID));
    const airdrop = results[0];

    if (airdrop && 'PrizesAssigned' in airdrop.status) {
        // Check if the airdrop has already been processed
        const csvFile = join(CSV_DIR_TRANSFER_RESULT, `airdrop_${AIRDROP_ID}.csv`);
        if (existsSync(csvFile)) {
            console.error(`Airdrop ${AIRDROP_ID} has already been processed 🔴`);
            return;
        }

        if (AIRDROP_ID == 24) {
            console.log("Skipping Airdrop 24");
            return;
        }

        const csvLogFile = join(CSV_DIR_TRANSFER_RESULT, `airdrop_${AIRDROP_ID}.csv`);
        const csvStream = createWriteStream(csvLogFile, { flags: 'w' });



        csvStream.write('UserId,Wallet,TransferId\n');

        const ledgerId = airdrop.tokenDetails.ledgerId;
        const ledgerActor = authenticatedICRC1Actor(identity, ledgerId);
        const fee = airdrop.tokenDetails.fee;

        let globalIndex = 0; // Initialize global index counter

        // Process transfers in batches
        for (let i = 0; i < transferData.length; i += BATCH_SIZE) {
            let batch = transferData.slice(i, i + BATCH_SIZE);
            console.log(`Processing batch from index ${i} to ${i + batch.length - 1} for airdrop ${AIRDROP_ID}`);

            const batchPromises = batch.map((data, index) => ledgerActor.icrc1_transfer({
                to: { owner: data[1], subaccount: [] },
                amount: data[2],
                fee: [fee],
                from_subaccount: [],
                memo: [],
                created_at_time: []
            }).then(result => {
                if ('Ok' in result) {
                    let transferId = result.Ok;
                    csvStream.write(`${data[0]},${data[1]},${transferId.toString()}\n`);
                    transferResults.push([data[0], data[1], { 'Distributed': transferId }]);
                    console.log(`Transfer ${globalIndex + index} : Success 🟢`);
                } else {
                    let error = result.Err;
                    csvStream.write(`${data[0]},${data[1]},${transferErrorToString(error)}\n`);
                    transferResults.push([data[0], data[1], { 'Failed': error }]);
                    console.error(`Transfer ${globalIndex + index} : Failure 🔴`, result);
                }
            }).catch(error => {
                console.error(`Error processing transfer ${globalIndex + index}: ${error}`);
            }));

            await Promise.allSettled(batchPromises);
            globalIndex += batch.length; // Update global index counter after each batch
        }

        csvStream.end();
    } else {
        console.error(`Airdrop ${AIRDROP_ID} is not in the correct status 🔴`);
    }
}

export function transferErrorToString(error: TransferError): string {
    if ('GenericError' in error) {
        return `Generic Error: ${error.GenericError.message} (Code: ${error.GenericError.error_code})`;
    } else if ('TemporarilyUnavailable' in error) {
        return "Service is temporarily unavailable.";
    } else if ('BadBurn' in error) {
        return `Burn amount is too low. Minimum required is ${error.BadBurn.min_burn_amount}.`;
    } else if ('Duplicate' in error) {
        return `This is a duplicate of transaction ${error.Duplicate.duplicate_of}.`;
    } else if ('BadFee' in error) {
        return `Incorrect fee. Expected fee is ${error.BadFee.expected_fee}.`;
    } else if ('CreatedInFuture' in error) {
        return `Transaction cannot be created in the future. Ledger time is ${error.CreatedInFuture.ledger_time.toLocaleString()}.`;
    } else if ('TooOld' in error) {
        return "Transaction is too old.";
    } else if ('InsufficientFunds' in error) {
        return `Insufficient funds. Current balance is ${error.InsufficientFunds.balance}.`;
    } else {
        return "Unknown error.";
    }
}

await performTransfers();
const endTime = new Date();
const elapsedTime = (endTime.getTime() - startTime.getTime()) / 1000;
console.log(`END :: performTransfers.ts :: ${endTime.toUTCString()} - Total time: ${elapsedTime} seconds`);
