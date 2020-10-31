const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.seznam.cz',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

/* const sendMail = (emailOptions) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(emailOptions, (err, info) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(info);
            }
        })
    })
}

const promiseTransporter = {};
promiseTransporter.sendMail = sendMail; */

module.exports = transporter;