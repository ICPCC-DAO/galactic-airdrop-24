// Updated imports
import { authenticatedBackendActor } from '../../utils/actor';
import type { SpecialCode } from '../../../src/declarations/backend/backend.did';
import { createReadStream } from "fs";
import { exportIdentity } from '../../utils/identity';
import csvParser from 'csv-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Convert URL to path and get directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


let resultsCsv: any[] = []; // Ensures that it can be reassigned if necessary

export async function readCsv() {
    return new Promise((resolve, reject) => {
        createReadStream(`${__dirname}/../data/csv/special_data.csv`)
            .pipe(csvParser())
            .on('data', (row) => { resultsCsv.push(row); })
            .on('end', () => {
                console.log('CSV read complete:', resultsCsv);
                resolve(resultsCsv);
            })
            .on('error', (error) => {
                console.error('Error reading CSV:', error);
                reject(error);
            });
    });
}

// Create airdrop data
export async function generateSpecialCodes() {
    await readCsv(); // Ensure data is loaded before continuing
    const specialCodes: SpecialCode[] = resultsCsv.map(result => {


        return {
            code: result.code,
            maxUsage: BigInt(result.maxUsage),
            numberOfPoints: BigInt(result.numberOfPoints),
            usageCount: 0n,
        };
    });
    return specialCodes;
}

export async function addSpecialCodes() {
    const identity = exportIdentity('seb');
    console.log('Adding airdrops with identity', identity.getPrincipal().toText());
    const specialCodes = await generateSpecialCodes();
    let result = await authenticatedBackendActor().loadSpecialCodesAdmin(specialCodes);
    console.log('Result', result);
}

addSpecialCodes();
