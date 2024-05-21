import { authenticatedBackendActor, authenticatedICRC1Actor } from '../../utils/actor';
import { Principal } from '@dfinity/principal';
import { createReadStream } from "fs";
import csvParser from 'csv-parser';
import { AIRDROP_ID, CSV_DIR } from '../data/const/airdrops.const';
import { exportIdentity } from '../../utils/identity';

type AirdropData = {
    totalAmount: bigint;
    numberOfParticipants: bigint;
    fee?: bigint;
    decimals?: bigint;
    ledgerId?: Principal;
};

async function readCsvAirdropData(): Promise<AirdropData> {
    let totalAmount = BigInt(0);
    let numberOfParticipants = BigInt(0);

    return new Promise((resolve, reject) => {
        createReadStream(`${CSV_DIR}/transferData.csv`)
            .pipe(csvParser())
            .on('data', (data) => {
                totalAmount += BigInt(data.Amount);
                numberOfParticipants++;
            })
            .on('end', () => {
                console.log(`CSV: Total amount ${totalAmount}, Participants ${numberOfParticipants} 🟢`);
                resolve({ totalAmount, numberOfParticipants });
            })
            .on('error', (error) => {
                console.error(`CSV data processing error: ${error} 🔴`);
                reject(error);
            });
    });
}

async function fetchLiveAirdropData(): Promise<AirdropData> {
    const actor = authenticatedBackendActor();
    const result = await actor.getAirdropAdmin(BigInt(AIRDROP_ID));

    if (result.length === 0) {
        throw new Error("No airdrop data available");
    }

    const airdrop = result[0];
    const { amount, decimals, fee } = airdrop.tokenDetails;
    const totalAmount = amount - BigInt(airdrop.qualified.length) * fee;

    console.log(`Fetched live airdrop data successfully 🟢`);
    return {
        totalAmount,
        numberOfParticipants: BigInt(airdrop.qualified.length),
        ledgerId: airdrop.tokenDetails.ledgerId,
        fee: BigInt(fee),
        decimals: BigInt(decimals)
    };
}

async function verifyWalletBalance(airdropData: AirdropData): Promise<void> {
    const identity = exportIdentity("airdrop_wallet_test");
    const ledgerActor = authenticatedICRC1Actor(identity, airdropData.ledgerId!);

    const balance = await ledgerActor.icrc1_balance_of({ owner: identity.getPrincipal(), subaccount: [] });
    const decimals = BigInt(await ledgerActor.icrc1_decimals());

    if (balance < airdropData.totalAmount + airdropData.fee! * airdropData.numberOfParticipants) {
        throw new Error("Insufficient wallet balance");
    }

    console.log(`Wallet balance: ${balance}, Amount to be distributed: ${airdropData.totalAmount}, Fee: ${airdropData.fee}, Decimals: ${airdropData.decimals} 🟢`);
}

async function performHealthCheck() {
    try {
        const csvData = await readCsvAirdropData();
        const liveData = await fetchLiveAirdropData();

        if (csvData.totalAmount !== liveData.totalAmount || csvData.numberOfParticipants !== liveData.numberOfParticipants) {
            console.error("Data mismatch between live and CSV records:");
            console.error(`CSV Data: Total amount ${csvData.totalAmount}, Participants ${csvData.numberOfParticipants}`);
            console.error(`Live Data: Total amount ${liveData.totalAmount}, Participants ${liveData.numberOfParticipants}`);
            throw new Error("Data mismatch between live and CSV records");
        }

        await verifyWalletBalance(liveData);
        console.log(`Health check successful for Airdrop ID: ${AIRDROP_ID} 🟢`);
    } catch (error) {
        console.error(`Health check failed: ${error} 🔴`);
    }
}

await performHealthCheck();
