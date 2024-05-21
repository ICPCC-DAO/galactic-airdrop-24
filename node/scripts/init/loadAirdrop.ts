// Updated imports
import { authenticatedBackendActor } from '../../utils/actor';
import type { AirdropDistribution, AirdropInit, AirdropLimits, AirdropMetadata, AirdropTiming, TokenDetails } from '../../../src/declarations/backend/backend.did';
import { createReadStream } from "fs";
import { exportIdentity } from '../../utils/identity';
import csvParser from 'csv-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Principal } from '@dfinity/principal';
import { MAX_DURATION_NANOSECONDS, MAX_PARTICIPANTS, distributionPrizes, distributionTiers } from '../data/const/airdrops.const';

// Convert URL to path and get directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


let resultsCsv: any[] = []; // Ensures that it can be reassigned if necessary

export async function readCsv() {
    return new Promise((resolve, reject) => {
        createReadStream(`${__dirname}/../data/csv/airdrops_data.csv`)
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
export async function generateAirdropsInit() {
    await readCsv(); // Ensure data is loaded before continuing
    const airdrops: AirdropInit[] = resultsCsv.map(result => {
        const metadata: AirdropMetadata = {
            id: BigInt(result.airdropId),
            name: result.name,
            description: result.description,
            learnMore: result.learnMore,
            twitter: result.twitter,
            chat: result.chat,
        };

        const tokenDetails: TokenDetails = {
            ledgerId: Principal.fromText(result.ledgerId),
            symbol: result.symbol,
            decimals: BigInt(result.decimals),
            amount: BigInt(result.amount * 10 ** result.decimals),
            fee: BigInt(result.fee),
        };

        const timing: AirdropTiming = {
            maxDuration: BigInt(MAX_DURATION_NANOSECONDS),
            startTime: [],
            endTime: [],
        }

        const distribution: AirdropDistribution = {
            distributionTiers,
            distributionPrizes,
        }

        const limits: AirdropLimits = {
            maxParticipants: BigInt(MAX_PARTICIPANTS),
        }

        return {
            metadata,
            tokenDetails,
            timing,
            distribution,
            limits,
            code: result.code,
        };
    });
    return airdrops;
}

export async function addAirdrops() {
    const identity = exportIdentity('seb');
    console.log('Adding airdrops with identity', identity.getPrincipal().toText());
    const initData = await generateAirdropsInit();
    console.log('Adding airdrops', initData);
    for (const airdrop of initData) {
        let result = await authenticatedBackendActor().loadAirdropAdmin(airdrop);
        console.log('Airdrop added', result);
    }
}

addAirdrops();
