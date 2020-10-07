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

module.exports = {
    ...categoriesAdminController,
    ...productsAdminController,
    getIndex,
    getLogin,
    postLogin,
    getLogout,
    getOrders
}