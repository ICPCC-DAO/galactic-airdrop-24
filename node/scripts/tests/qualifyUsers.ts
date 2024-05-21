// This script is used to register N fake users into the backend canister
// Should be run ONCE after the backend canister is installed
import { authenticatedBackendActor } from '../../utils/actor';
import { fetchIdentity } from '../../utils/keys';
import fs from 'fs';
import { NUMBER_OF_USERS, AIRDROP_IDS } from './tests.const';
import type { Principal } from '@dfinity/principal';
import { generatePrincipals } from '../init/generateKeys';

// The script is running - not the time to be able to measure the time it takes to run
let startTime = new Date();
let endTime = new Date();
console.log(`START :: registerFakeUsers.ts :: ${startTime.toUTCString()}`)


// Counters for successful and failed registrations 
let registrationResults: string[] = [];


// Register N fake users and log the results
async function qualifyUserForAirdrop(airdropId: bigint, principals: Principal[]) {
    const backendActor = authenticatedBackendActor();
    let result = await backendActor.qualifyUsers(principals, airdropId);
    console.log(result);
}

// Loop through all airdrop IDs and register users for each airdrop
async function qualifyUsers() {
    let principals: Principal[] = generatePrincipals();
    for (let i = 0; i < AIRDROP_IDS.length; i++) {
        console.log(`Qualifying users for airdrop ${AIRDROP_IDS[i]}`);
        let result = await qualifyUserForAirdrop(AIRDROP_IDS[i], principals);
        console.log(result);
    }
}

await qualifyUsers();

// Calculate the elapsed time in minutes and seconds
endTime = new Date();
const elapsedTime = endTime.getTime() - startTime.getTime();
const minutes = Math.floor(elapsedTime / 60000); // Convert milliseconds to minutes
const seconds = ((elapsedTime % 60000) / 1000).toFixed(0); // Convert remaining milliseconds to seconds
console.log(`Time taken: ${minutes} minutes and ${seconds} seconds`);
console.log(`END :: registerFakeUsers.ts :: ${endTime.toUTCString()}`);
