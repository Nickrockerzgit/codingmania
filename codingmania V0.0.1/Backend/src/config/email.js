const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create email transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Email sending function
const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: `"Technoverse" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.response);
        return true;
    } catch (error) {
        console.error('Error sending email: ', error);
        return false;
    }
};

module.exports = {
    transporter,
    sendEmail
};