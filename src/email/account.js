const nodemailer = require('nodemailer');
require('dotenv').config({ path: './config/dev.env' });



// Function to send the email
const sendWelcomeEmail = async (email, name) => {

    // Create a transporter object using Gmail service
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'pratiyank49@gmail.com',
            pass: process.env.GMAIL_APP_PASS, // Use the App Password here if 2FA is enabled
        },
    });

    // Set up email data
    let mailOptions = {
        from: '"Pratiyank" ', // sender address
        to: email, // list of receivers
        subject: 'Thanks for joining in', // Subject line
        text: `Welcome to the app ${name}. Let me know how you get along with the app`, // plain text body
        html: `Welcome to the app ${name}. Let me know how you get along with the app`, // html body
    };

    // Send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

const sendCancelationEmail = async (email, name) => {

    // Create a transporter object using Gmail service
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'pratiyank49@gmail.com',
            pass: process.env.GMAIL_APP_PASS, // Use the App Password here if 2FA is enabled
        },
    });

    // Set up email data
    let mailOptions = {
        from: '"Pratiyank" ', // sender address
        to: email, // list of receivers
        subject: "We're Sad to See You Go, Your Profile Has Been Deleted", // Subject line
        text: `Dear ${name}, Your profile have been successfully deleted as per your request. We're sorry to see you leave, and we hope that your experience with us was valuable.`, // plain text body
        html: `Dear ${name}, Your profile have been successfully deleted as per your request. We're sorry to see you leave, and we hope that your experience with us was valuable.`, // html body
    };

    // Send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}

// main().catch(console.error);