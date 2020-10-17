const path = require('path');

const generateInvoice = require('./generateInvoice');
const transporter = require('./mailing');

const Order = require('../models/order');

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
    transporter.sendMail({
        from: process.env.MAIL_USER,
        to: order.email,
        cc: process.env.MAIL_USER,
        subject: 'Keramika Rosice: Objednávka zrušena',
        html: '<h1>This is working!</h1>',
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
    transporter.sendMail({
        from: process.env.MAIL_USER,
        to: order.email,
        cc: process.env.MAIL_USER,
        subject: 'Keramika Rosice: Úspěšná platba',
        html: '<h1>Úspěšná platba!</h1>'
    }, (err, info) => {
        if (err) {
            console.log(err);
            return { success: false };
        }
        return { success: true };
    })

}