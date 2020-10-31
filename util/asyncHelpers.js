const path = require('path');
const fs = require('fs');

const generateInvoice = require('./generateInvoice');
const transporter = require('./mailing');

const Order = require('../models/order');
const EmailTemplates = require('../templates/emails');

exports.cancelOrder = async (orderId) => {

    const order = await Order.findById(orderId);
    if (!order) {
        const err = new Error('Order does not exist');
        err.status = 404;
        throw err;
    }

    order.isCanceled = true;

    const invoiceName = 'invoice-cancel-' + order._id + '.pdf';
    const invoicePath = path.join('pdf', 'invoices', invoiceName);
    order.cancelInvoiceUrl = invoicePath;

    // Generate a cancel invoice
    await generateInvoice(order, invoicePath);

    await order.save();

    // Send notification about cancelled order
    const emailTemplate = EmailTemplates.canceledOrder(order);
    transporter.sendMail({
        from: process.env.MAIL_USER,
        to: order.email,
        cc: process.env.MAIL_USER,
        subject: emailTemplate[0],
        html: emailTemplate[1],
        attachments: [{
            filename: invoiceName,
            path: invoicePath,
            contentType: 'application/pdf'
        }]
    }, (err, info) => {
        if (err) {
            console.log(err);
            return { success: false };
        }
        return { success: true };
    })

}

exports.paidOrderHandler = async (order) => {

    // Mark order as paid
    order.isPayed = true;
    await order.save();

    // Send notification about successfull payment
    const emailTemplate = EmailTemplates.paymentSuccess(order);
    transporter.sendMail({
        from: process.env.MAIL_USER,
        to: order.email,
        cc: process.env.MAIL_USER,
        subject: emailTemplate[0],
        html: emailTemplate[1]
    }, (err, info) => {
        if (err) {
            console.log(err);
            return { success: false };
        }
        return { success: true };
    })

}

exports.getVariableSymbol = async (date) => {
    const constantsRaw = await fs.promises.readFile('constants.json');
    const constants = JSON.parse(constantsRaw);

    const lastNumber = constants.lastInvoiceNumber[0];
    const lastYear = constants.lastInvoiceNumber[1];

    let newYear = lastYear;
    let newNumber = lastNumber + 1;

    // Check for year change
    if (date.getFullYear() > lastYear) {
        newYear = date.getFullYear();
        newNumber = 1;
    }

    // Convert 1 => 0001, convert 25 => 0025, convert 52687 => 52687
    const addZeros = 4 - newNumber.toString().length;
    let newNumberString = '';
    for (let i = 0; i < addZeros; i++) {
        newNumberString += '0';
    }
    newNumberString += `${newNumber}`;

    // Update constants
    constants.lastInvoiceNumber = [newNumber, newYear];
    await fs.promises.writeFile('constants.json', JSON.stringify(constants, null, 2));

    return `${newNumberString}${newYear}`;
}