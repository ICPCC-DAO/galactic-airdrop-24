import dotenv from 'dotenv';
import Mailgun from 'mailgun.js';
import FormData from 'form-data';

dotenv.config();

const mailgun = new Mailgun.default(FormData);
const mg = mailgun.client({ username: 'api', key: `${process.env.MAILGUN_API_KEY}` });

export async function sendVerificationEmail(
  email: string,
  verificationCode: string
): Promise<any> {
  try {
    const msg = await mg.messages.create('icp-cc-airdrop.com', {
      from: "<noreply@icp-cc-airdrop.com>",
      to: [`${email}`], // Assuming you want to send the email to the address provided as an argument
      subject: "Verification Code",
      text: `Your verification code is: ${verificationCode}`,
      html: `<h1>Your verification code is: ${verificationCode}</h1>`,
    });
    return msg; // Optionally return the response
  } catch (err) {
    console.error(err);
    throw err; // Rethrow if you want calling code to handle it
  }
};