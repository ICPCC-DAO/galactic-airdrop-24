import cron from 'node-cron';
import { authenticatedBackendActor } from './actor.js';
import { sendVerificationEmail } from './api.js';
import type { Email } from '../declarations/backend/backend.did.js';
import { exportIdentity } from './identity.js';

const toSend = new Set<Email>();
const sent = new Set<Email>();
const failedAttempts = new Map<Email, number>(); // To keep track of failed attempts
let isProcessing = false;

// Rate limit in actions per minute
const RATE_LIMIT = 1000;
let actionsProcessedThisMinute = 0;
let currentMinute = new Date().getMinutes();

console.log('Docker identity is : ', exportIdentity().getPrincipal().toText());

async function getEmails() {
  try {
    const emails = await authenticatedBackendActor().getEmails();
    emails.forEach((email) => {
      let totalEmails = toSend.size + sent.size;
      // Check if email is not already in toSend or
      if (
        !Array.from(toSend).some((a) => a.id === email.id) &&
        !Array.from(sent).some((a) => a.id === email.id)
      ) {
        toSend.add(email);
        failedAttempts.set(email, 0); // Initialize failed attempts
      }
      let newTotalActions = toSend.size + sent.size;
      console.log('Nb of new actions', newTotalActions - totalEmails);
    });
  } catch (e) {
    console.error('Error querying canister', e);
  }
}

function extractInfoFromEmail(email: Email): { emailAddress: string, verificationCode: string } {
  // Extract the information you need from the email
  return {
    emailAddress: email.email,
    verificationCode: email.code,
  };
};


async function processEmail(email: Email) {
  console.log('Processing email', email);
  try {
    let { emailAddress, verificationCode } = extractInfoFromEmail(email);
    await sendVerificationEmail(emailAddress, verificationCode);
    // Mark the action as completed
    toSend.delete(email);
    sent.add(email);
  } catch (error) {
    console.error('Error processing email:', error);
    await handleFailedAttempt(email);
  }

}

async function handleFailedAttempt(email: Email) {
  const attempts = failedAttempts.get(email) || 0;
  if (attempts < 2) {
    // Retry the action up to 2 more times
    failedAttempts.set(email, attempts + 1);
    toSend.add(email); // Add it back to the queue for retry
  } else {
    // Mark the action as completed after 3 unsuccessful attempts
    toSend.delete(email);
    sent.add(email);
  }
}

async function notifyCompletion() {
  // console.log('Notifying completion');
  try {
    const emailIds = Array.from(sent).map((email) => email.id);
    if (emailIds.length > 0) {
      let result = await authenticatedBackendActor().reportSentEmails(emailIds);
      if ('ok' in result) {
        sent.clear();
      }
    }
  } catch (error) {
    console.error('Error notifying completion:', error);
  }
}
async function processCronJob() {
  if (!isProcessing) {
    isProcessing = true;
    try {
      await getEmails();
      await notifyCompletion();
      if (toSend.size === 0 && sent.size === 0) {
        console.log('No actions to perform - can sleep for a while!');
      } else {
        for (let email of toSend) {
          let newMinute = new Date().getMinutes();
          if (newMinute !== currentMinute) {
            // Reset the counter and update the minute
            actionsProcessedThisMinute = 0;
            currentMinute = newMinute;
          }
          if (actionsProcessedThisMinute < RATE_LIMIT) {
            await processEmail(email);
            actionsProcessedThisMinute++;
          } else {
            console.log('Rate limit reached');
            break;
          }
        }
        await notifyCompletion();
      }
    } catch (error) {
      console.error('Error in cron job:', error);
    } finally {
      isProcessing = false;
    }
  }
}


// Run the cron job every 5 seconds 
cron.schedule('*/5 * * * * *', processCronJob);