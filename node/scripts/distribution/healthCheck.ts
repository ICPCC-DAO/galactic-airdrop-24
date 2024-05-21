import csvParser from 'csv-parser';
import { fileURLToPath } from 'url';
import { createReadStream, promises as fsPromises } from 'fs';
import { dirname, join } from 'path';

// Convert URL to path and get directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type AirdropData = {
    ledgerId: string;
    name: string;
    airdropIds: bigint[];
    amountPromised: number;
    amountDisbursed: number;
}

let airdropMap = new Map<string, AirdropData>();

// Read main airdrop data CSV
export async function readCsv() {
    return new Promise((resolve, reject) => {
        createReadStream(`${__dirname}/../data/csv/airdrop_data_2.csv`)
            .pipe(csvParser())
            .on('data', (row) => {
                let ledgerId = row.ledgerId;
                let name = row.name;
                let airdropId = BigInt(row.airdropId);
                let amount = Number(row.amount * 10 ** row.decimals);

                if (airdropMap.has(ledgerId)) {
                    let existingData = airdropMap.get(ledgerId) as AirdropData;
                    existingData.airdropIds.push(airdropId);
                    existingData.amountPromised += amount;
                } else {
                    airdropMap.set(ledgerId, {
                        ledgerId: ledgerId,
                        name: name,
                        airdropIds: [airdropId],
                        amountPromised: amount,
                        amountDisbursed: 0,
                    });
                }
            })
            .on('end', async () => {
                console.log('Main CSV read complete');
                try {
                    await calculateDisbursedAmounts();
                    resolve(Array.from(airdropMap.values()));
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('Error reading CSV:', error);
                reject(error);
            });
    });
}

// Calculate disbursed amounts by reading log files
// Calculate disbursed amounts by reading log files
async function calculateDisbursedAmounts(): Promise<void> {
    const logDirectory = `${__dirname}/../logs/airdrops`;
    const files = await fsPromises.readdir(logDirectory);

    // Initialize a temporary map to hold the total disbursed amounts per airdrop ID to avoid double addition
    const tempDisbursementMap = new Map();

    for (let file of files) {
        console.log(`Processing log file ${file}`);
        if (file === '.DS_Store') {
            continue;
        }
        // Extract airdropId from file name
        let airdropId = BigInt(file.split('_')[1].slice(0, -4));
        console.log(`Airdrop ID: ${airdropId}`);
        let totalDisbursed = 0;

        await new Promise<void>((resolve, reject) => {
            createReadStream(join(logDirectory, file))
                .pipe(csvParser())
                .on('data', (data) => {
                    totalDisbursed += Number(data.Amount);
                })
                .on('end', () => {
                    // Update the temporary map with total disbursed amount for this airdrop ID
                    tempDisbursementMap.set(airdropId, totalDisbursed);
                    resolve();  // Resolves the Promise without returning any value
                })
                .on('error', (error) => {
                    console.error(`Error reading log file ${file}:`, error);
                    reject(error);
                });
        });
    }

    // Update the main airdropMap with the values from the temporary map
    tempDisbursementMap.forEach((amount, airdropId) => {
        airdropMap.forEach((value, key) => {
            if (value.airdropIds.includes(airdropId)) {
                // Get the name of the airdrop
                let airdropName = value.name;
                console.log(`Updating airdrop ${airdropName} with ID ${airdropId} with amount ${amount}`);
                value.amountDisbursed += amount; // Set, not increment
            }
        });
    });
}

await readCsv();
console.log(airdropMap);
