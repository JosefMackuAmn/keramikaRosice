const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const categoriesAdminController = require('./categories');
const productsAdminController = require('./products');
const asyncHelpers = require('../../util/asyncHelpers');

const Order = require('../../models/order');

const getIndex = (req, res, next) => {
    res.render('admin/index', {
        title: 'Administration'
    })
}

const getLogin = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        return res.redirect('/admin');
    }
    res.render('admin/login', {
        title: 'Login'
    })
}

const postLogin = (req, res, next) => {
    const password = req.body.password;
    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).redirect('/');
    } else if (password === process.env.ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        return req.session.save(err => {
            console.log(err);
            return res.redirect('/admin');
        })
    }
    res.status(401).redirect('/');
}

const getLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}

const getOrders = async (req, res, next) => {
    const allOrders = await Order.find({}).sort('-date');

    res.render('admin/orders', {
        title: 'Orders',
        orders: allOrders
    })
}

const getOrderDetail = async (req, res, next) => {
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId);

    const constantsRaw = await fs.promises.readFile('constants.json');
    const constants = JSON.parse(constantsRaw);

    res.render('admin/order-detail', {
        title: 'Orders',
        order: order,
        statuses: constants.orderStatuses
    })
}

const putOrder = async (req, res, next) => {
    const orderId = req.body.orderId;
    const status = req.body.status;
    const isPayed = req.body.isPayed;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new Error(errors.errors[0].msg);
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(422).json({
            msg: "orderId is not a valid ID string"
        })
    }

    const order = await Order.findById(orderId);

    if (!order) {
        res.status(404).json({
            msg: "Order does not exist"
        });
    }

    if (!order.isPayed && isPayed) {
        // Mark as payed and send notification
        await asyncHelpers.paidOrderHandler(order);
    }

    // Its possible to only change status if order is already paid
    order.status = status;

    await order.save();

    res.json({
        msg: "Order successfully updated"
    })
}

const postCancelOrder = async (req, res, next) => {
    const { orderId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(422).json({
            msg: "orderId is not a valid ID string"
        })
    }

    try {
        await asyncHelpers.cancelOrder(orderId);
    } catch (err) {
        const errorStatus = err.status || 500;
        return res.status(errorStatus).json({
            msg: err.message
        });
    }

    return res.redirect(`/admin/orders/${orderId}`);
}

const getInvoice = async (req, res, next) => {
    const orderId = req.params.orderId;

    const invoiceName = 'invoice-' + orderId + '.pdf';

    const invoicePath = path.join('pdf', 'invoices', invoiceName);

    const fileStream = fs.createReadStream(invoicePath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');

    fileStream.pipe(res);
}

module.exports = {
    ...categoriesAdminController,
    ...productsAdminController,
    getIndex,
    getLogin,
    postLogin,
    getLogout,
    getOrders,
    getOrderDetail,
    putOrder,
    getInvoice,
    postCancelOrder
}