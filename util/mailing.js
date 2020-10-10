const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const transporter = nodemailer.createTransport(smtpTransport({
    host: process.env.MAIL.HOST,
    port: process.env.MAIL.PORT,
    secure: true, // use SSL
    auth: {
        user: process.env.MAIL.USER,
        pass: process.env.MAIL.PASSWORD
    }
}));

module.exports = transporter;