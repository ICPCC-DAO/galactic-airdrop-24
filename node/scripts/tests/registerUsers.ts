// This script is used to register N fake users into the backend canister
// Should be run ONCE after the backend canister is installed
import { authenticatedBackendActor } from '../../utils/actor';
import { generatePrincipals } from '../init/generateKeys';
import type { Principal } from '@dfinity/principal';

// The script is running - not the time to be able to measure the time it takes to run
let startTime = new Date();
let endTime = new Date();
console.log(`START :: registerFakeUsers.ts :: ${startTime.toUTCString()}`)

// Register N fake users and log the results
async function registerFakeUsers() {
    const backendActor = authenticatedBackendActor();
    let principal: Principal[] = generatePrincipals();
    console.log(`Adding ${principal.length} users to the backend`);
    let result = await backendActor.addUsers(principal);
    console.log(result);
}

await registerFakeUsers();

// Calculate the elapsed time in minutes and seconds
endTime = new Date();
const elapsedTime = endTime.getTime() - startTime.getTime();
const minutes = Math.floor(elapsedTime / 60000); // Convert milliseconds to minutes
const seconds = ((elapsedTime % 60000) / 1000).toFixed(0); // Convert remaining milliseconds to seconds
console.log(`Time taken: ${minutes} minutes and ${seconds} seconds`);
console.log(`END :: registerFakeUsers.ts :: ${endTime.toUTCString()}`);
