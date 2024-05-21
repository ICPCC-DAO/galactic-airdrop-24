import { nonAuthenticatedBackendActor, authenticatedBackendActor } from '../../utils/actor';
import { createReadStream } from "fs";
import type { TokensData, TokensDataVolt } from '../../../src/declarations/backend/backend.did';
import csvParser from 'csv-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


let tokensData: TokensDataVolt = []; // Ensures that it can be reassigned if necessary
// Convert URL to path and get directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export async function readCsv() {
    return new Promise((resolve, reject) => {
        createReadStream(`${__dirname}/../data/bioniq/tokenIdentifiers.csv`)
            .pipe(csvParser())
            .on('data', (row) => {
                let tokens = [Number(row.collection_mint_number), Number(row.token_index)] as [number, number];
                tokensData.push(tokens);

            })
            .on('end', () => {
                console.log('CSV read complete');
                loadTokensVoltData();
            })
            .on('error', (error) => {
                console.error('Error reading CSV:', error);
                reject(error);
            });
    });
};

// export async function loadTokensData() {
//     console.log("Adding tokens data with length " + tokensData.length + " to backend actor");
//     const result = await authenticatedBackendActor().loadTokensData(tokensData);
//     console.log("Result", result);
// };

export async function loadTokensVoltData() {
    const result = await authenticatedBackendActor().loadTokensDataVolt(tokensData);
    // console.log("Result", result);
}


await readCsv();