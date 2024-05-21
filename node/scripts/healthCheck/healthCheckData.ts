import { authenticatedICRC1Actor } from '../../utils/actor';
import { Principal } from '@dfinity/principal';
import { createReadStream } from "fs";
import csvParser from 'csv-parser';
import { exportIdentity } from '../../utils/identity';

type AirdropData = {
    name: string;
    numberOfAirdrop: bigint;
    amountPerAirdrop: bigint;  // Renamed from totalAmount
    fee: bigint;
    decimals: bigint;
    ledgerId?: Principal;
};

let airdrops: AirdropData[] = [];

async function loadCSVData(): Promise<void> {
    const airdropMap = new Map();

    return new Promise((resolve, reject) => {
        createReadStream(`node/scripts/data/csv/airdrops.csv`)
            .pipe(csvParser())
            .on('data', (data) => {
                let name = data.name;
                let ledgerId = Principal.fromText(data.ledgerId);
                let fee = BigInt(data.fee);
                let decimals = BigInt(data.decimals);
                let amount = BigInt(data.amount); // Represents amount per airdrop

                if (airdropMap.has(name)) {
                    let existingData = airdropMap.get(name);
                    // Separately check each parameter
                    if ((existingData.ledgerId.toText() !== ledgerId.toText())) {
                        console.error(`Ledger ID mismatch for airdrop '${name}': expected ${existingData.ledgerId}, found ${ledgerId}`);
                        reject(new Error(`Ledger ID mismatch for airdrop '${name}'.`));
                        return;
                    }
                    if (fee !== existingData.fee) {
                        console.error(`Fee mismatch for airdrop '${name}': expected ${existingData.fee}, found ${fee}`);
                        reject(new Error(`Fee mismatch for airdrop '${name}'.`));
                        return;
                    }
                    if (decimals !== existingData.decimals) {
                        console.error(`Decimals mismatch for airdrop '${name}': expected ${existingData.decimals}, found ${decimals}`);
                        reject(new Error(`Decimals mismatch for airdrop '${name}'.`));
                        return;
                    }
                    if (amount !== existingData.amountPerAirdrop) {
                        console.error(`Amount per airdrop mismatch for '${name}': expected ${existingData.amountPerAirdrop}, found ${amount}`);
                        reject(new Error(`Amount per airdrop mismatch for '${name}'.`));
                        return;
                    }
                    existingData.numberOfAirdrop++; // Increment if all checks pass
                } else {
                    airdropMap.set(name, {
                        name: name,
                        numberOfAirdrop: BigInt(1),
                        amountPerAirdrop: amount,
                        fee: fee,
                        decimals: decimals,
                        ledgerId: ledgerId
                    });
                }
            })
            .on('end', () => {
                airdrops = Array.from(airdropMap.values());
                console.log(`CSV data processed successfully for ${airdrops.length} airdrops 🟢`);
                resolve();
            })
            .on('error', (error) => {
                console.error(`CSV data processing error: ${error} 🔴`);
                reject(error);
            });
    });
}

async function verifyAirdrop(airdropData: AirdropData): Promise<void> {
    const identity = exportIdentity("airdrop_wallet");
    const ledgerActor = authenticatedICRC1Actor(identity, airdropData.ledgerId!);

    // Retrieve the current balance, fee, and decimals from the ledger for validation
    const balance = await ledgerActor.icrc1_balance_of({ owner: identity.getPrincipal(), subaccount: [] });
    const feePerTransaction = BigInt(await ledgerActor.icrc1_fee());
    const ledgerDecimals = BigInt(await ledgerActor.icrc1_decimals());

    // Compute the total fee and required amount including the number of occurrences
    const totalRequiredFee = feePerTransaction * airdropData.numberOfAirdrop;
    const totalRequiredAmount = airdropData.amountPerAirdrop * airdropData.numberOfAirdrop * (10n ** airdropData.decimals);

    // Perform the checks
    if (balance < totalRequiredAmount) {
        throw new Error(`Insufficient balance in wallet: available ${balance}, required ${totalRequiredAmount + totalRequiredFee} for airdrop '${airdropData.name}'`);
    }

    if (airdropData.fee !== feePerTransaction) {
        throw new Error(`Fee mismatch for '${airdropData.name}': expected ${airdropData.fee}, found ${feePerTransaction}`);
    }

    if (airdropData.decimals !== ledgerDecimals) {
        throw new Error(`Decimals mismatch for '${airdropData.name}': expected ${airdropData.decimals}, found ${ledgerDecimals}`);
    }

    let amountRemaining = balance - totalRequiredAmount;

    // Confirmation log if all checks pass
    console.log(`Airdrop verified: ${airdropData.name}, Remaining : ${amountRemaining} 🟢`);
}

async function performHealthCheck() {
    try {
        await loadCSVData();
        for (let airdropData of airdrops) {
            await verifyAirdrop(airdropData);
        }
        console.log(`Health check successful 🟢`);
        printRecap(); // Call recap after verification is complete
    } catch (error) {
        console.error(`Health check failed: ${error} 🔴`);
    }
}

function printRecap() {
    console.log("Airdrop Recap:");
    airdrops.forEach(airdrop => {
        console.log(`Airdrop "${airdrop.name}" - Occurrences: ${airdrop.numberOfAirdrop}, Total Amount: ${airdrop.amountPerAirdrop * airdrop.numberOfAirdrop}`);
    });
}


performHealthCheck();