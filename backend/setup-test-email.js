const nodemailer = require('nodemailer');

// Create a test account using Ethereal Email (free testing service)
async function createTestAccount() {
    try {
        const testAccount = await nodemailer.createTestAccount();

        console.log('\n✅ Test Email Account Created!\n');
        console.log('Copy these credentials to your .env file:\n');
        console.log(`EMAIL_HOST=${testAccount.smtp.host}`);
        console.log(`EMAIL_PORT=${testAccount.smtp.port}`);
        console.log(`EMAIL_USER=${testAccount.user}`);
        console.log(`EMAIL_PASS=${testAccount.pass}`);
        console.log(`\n📧 To view sent emails, visit: https://ethereal.email/messages`);
        console.log(`   Login with: ${testAccount.user} / ${testAccount.pass}\n`);

        // Also save to a file for easy reference
        const fs = require('fs');
        const envContent = `
# Test Email Configuration (Generated)
EMAIL_HOST=${testAccount.smtp.host}
EMAIL_PORT=${testAccount.smtp.port}
EMAIL_USER=${testAccount.user}
EMAIL_PASS=${testAccount.pass}
EMAIL_FROM=Event Management System <noreply@eventmanagement.com>

# To view emails: https://ethereal.email/messages
# Login: ${testAccount.user} / ${testAccount.pass}
`;

        fs.writeFileSync('test-email-config.txt', envContent.trim());
        console.log('✅ Credentials also saved to: test-email-config.txt\n');

    } catch (error) {
        console.error('❌ Error creating test account:', error.message);
    }
}

createTestAccount();
