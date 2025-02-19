'use strict';

const Nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        console.log('Creating email transporter with:', {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            user: process.env.SMTP_USER
        });
        
        this.transporter = Nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            debug: true // Enable debug logging
        });
    }

    async sendWelcomeEmail(user) {
        return this.sendMail({
            to: user.email,
            subject: 'Welcome to Movie App!',
            text: `Hello ${user.firstName},\n\nWelcome to Movie App!`,
            html: `<h1>Welcome to Movie App!</h1><p>Hello ${user.firstName},</p><p>Thank you for joining!</p>`
        });
    }

    async sendMail(options) {
        try {
            console.log('Sending email to:', options.to);
            const info = await this.transporter.sendMail({
                from: process.env.SMTP_FROM,
                ...options
            });
            console.log('Email sent:', info.messageId);
            const previewUrl = Nodemailer.getTestMessageUrl(info);
            console.log('Preview URL:', previewUrl);
            return {
                ...info,
                previewUrl
            };
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

module.exports = EmailService;
