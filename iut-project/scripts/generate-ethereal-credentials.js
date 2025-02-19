'use strict';

const nodemailer = require('nodemailer');

async function generateEtherealCredentials() {
    // Generate test SMTP service account
    const testAccount = await nodemailer.createTestAccount();

    console.log('Ethereal Email Credentials:');
    console.log('SMTP_USER=' + testAccount.user);
    console.log('SMTP_PASS=' + testAccount.pass);
    console.log('\nEthereal Email Preview URL: https://ethereal.email');
    console.log('Login with the credentials above to view sent emails');
}

generateEtherealCredentials().catch(console.error);
