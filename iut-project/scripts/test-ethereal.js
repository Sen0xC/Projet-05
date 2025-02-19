const nodemailer = require('nodemailer');

async function testEthereal() {
    try {
        // Generate test SMTP service account
        const testAccount = await nodemailer.createTestAccount();
        console.log('Credentials generated:');
        console.log('Host:', testAccount.smtp.host);
        console.log('Port:', testAccount.smtp.port);
        console.log('Secure:', testAccount.smtp.secure);
        console.log('User:', testAccount.user);
        console.log('Pass:', testAccount.pass);

        // Create a transporter and test it
        const transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });

        // Test the connection
        await transporter.verify();
        console.log('SMTP connection verified successfully!');

        // Send a test email
        const info = await transporter.sendMail({
            from: '"Test" <test@example.com>',
            to: 'test@example.com',
            subject: 'Test Email',
            text: 'This is a test email'
        });

        console.log('Test email sent:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error:', error);
    }
}

testEthereal();
