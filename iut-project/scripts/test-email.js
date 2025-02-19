'use strict';

require('dotenv').config();
const EmailService = require('../lib/services/email');

async function testEmail() {
    try {
        const emailService = new EmailService();
        const info = await emailService.sendMail({
            to: 'test@example.com',
            subject: 'Test Email',
            text: 'This is a test email',
            html: '<h1>Test Email</h1><p>This is a test email</p>'
        });
        
        console.log('Email sent successfully');
        console.log('Preview URL:', info.previewUrl);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

testEmail();