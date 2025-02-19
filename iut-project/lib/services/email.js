'use strict';

const Nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Create reusable transporter using Ethereal
        this.transporter = Nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: 'gqdqxd3vrihqxz2h@ethereal.email',
                pass: 'enK5suteFN7U4r7Mvu'
            }
        });
    }

    async sendWelcomeEmail(user) {
        try {
            const info = await this.transporter.sendMail({
                from: '"Hapi App" <gqdqxd3vrihqxz2h@ethereal.email>',
                to: user.email,
                subject: 'Welcome to Our App!',
                text: `Hello ${user.firstName},\n\nWelcome to our application! We're excited to have you on board.\n\nBest regards,\nThe Team`,
                html: `
                    <h1>Welcome ${user.firstName}!</h1>
                    <p>We're excited to have you on board.</p>
                    <p>Best regards,<br>The Team</p>
                `
            });

            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', Nodemailer.getTestMessageUrl(info));
            return info;
        } catch (error) {
            console.error('Error sending welcome email:', error);
            throw error;
        }
    }
}

module.exports = EmailService;
