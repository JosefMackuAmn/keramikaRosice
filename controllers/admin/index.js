const fs = require('fs');

const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const categoriesAdminController = require('./categories');
const productsAdminController = require('./products');

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
        return res.status(401).json({
            msg: "Wrong password"
        })
    } else if (password === process.env.ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        return req.session.save(err => {
            console.log(err);
            return res.redirect('/admin');
        })
    }
    res.redirect('/');
}

const getLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}

const getOrders = async (req, res, next) => {
    const allOrders = await Order.find({});

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

    order.status = status;
    order.isPayed = isPayed;

    await order.save();

    res.json({
        msg: "Order successfully updated"
    })
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
    putOrder
}