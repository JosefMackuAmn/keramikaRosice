const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Product = require("../models/product");
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const Cart = require('../models/cart');
const Order = require('../models/order');

const transporter = require('../util/mailing');
const generateInvoice = require('../util/generateInvoice');

exports.getShop = async (req, res, next) => {
    const products = await Product.find({});

    res.render('eshop/shop', {
        title: 'E-shop',
        products: products
    })
}

exports.getCategory = async (req, res, next) => {
    const categoryName = req.params.category.toLowerCase();
    const category = await Category.findOne({ name: 'amnion category' });
    if (!category) {
        return res.status(400).render('eshop/shop', {
            title: 'Kategorie nenalezena',
            products: []
        })
    }
    const categoryId = category._id;


    const categoryProducts = await Product.find({ categoryId: categoryId }) || [];

    res.render('eshop/shop', {
        title: categoryName,
        products: categoryProducts
    });
}

exports.getSubcategory = async (req, res, next) => {
    const categoryName = req.params.category.toLowerCase();
    const subcategoryName = req.params.subcategory.toLowerCase();
    
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
        return res.status(400).render('eshop/shop', {
            title: 'Kategorie nenalezena',
            products: []
        })
    }
    const categoryId = category._id;


    const subcategory = await Subcategory.findOne({ name: subcategoryName, categoryId: categoryId });
    if (!subcategory) {
        return res.status(400).render('eshop/shop', {
            title: 'Podkategorie nenalezena',
            products: []
        })
    }
    const subcategoryId = subcategory._id;

    const subcategoryProducts = await Product.find({ subcategoryId: subcategoryId });

    res.render('eshop/shop', {
        title: subcategoryName,
        products: subcategoryProducts
    });
}

exports.getCart = async (req, res, next) => {
    const cart = req.session.cart;
    const constantsRaw = await fs.promises.readFile('constants.json');
    const constants = JSON.parse(constantsRaw);

    res.set({
        'Content-Security-Policy': "script-src 'self' https://js.stripe.com/v3/ https://polyfill.io/v3/"
    });

    res.render('eshop/cart', {
        title: 'Košík',
        cart: cart,
        constants: constants,
        stripePublicKey: process.env.STRIPE_PUBLIC_KEY
    })
}

exports.postCart = async (req, res, next) => {
    const cart = req.session.cart;
    const productId = req.body.productId;
    const amount = req.body.amount;
    const action = req.body.action;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new Error(errors.errors[0].msg);
    }
    
    const isValidId = mongoose.Types.ObjectId.isValid(productId);
    if (!isValidId) {
        return res.status(422).json({
            msg: "productId is not a valid ID string"
        });
    }

    const product = await Product.findById(productId);
    if (!product) {
        return res.status(422).json({
            msg: "productId does not reffer to any existing product"
        })
    }

    let updatedCart;
    if (!cart) {
        updatedCart = new Cart();
    } else {
        updatedCart = new Cart(cart.items, cart.total, cart.shippingCostId);
    }

    if (action === 'ADD') {
        if (!amount || typeof +amount !== 'number') { // TRY TO DEBUG --------------------------------------------------
            return res.status(422).json({
                msg: "amount property has to be passed along with 'ADD' action"
            })
        }
        updatedCart.add(product, amount);
    } else if (action === 'REMOVE') {
        updatedCart.remove(product, amount);
    } else {
        return res.status(422).json({
            msg: "action should be a string of value 'ADD' or 'REMOVE'"
        })
    }   

    req.session.cart = updatedCart;
    return req.session.save(err => {
        if (err) return next(err);
        return res.status(200).json({
            msg: "Product added",
            cart: updatedCart
        })
    })
}

exports.postOrder = async (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const phone = req.body.phone;
    const street = req.body.street;
    const city = req.body.city;
    const delivery = req.body.delivery;
    const payment = req.body.payment;
    const zipCode = req.body.zipCode;

    const constants = await fs.promises.readFile('constants.json');
    const consts = JSON.parse(constants);

    const variableSymbol = Math.floor(Math.random() * 10000000000);

    const cart = req.session.cart;

    if (!cart || cart.items.length < 1) {
        return res.redirect('/kosik?success=false&mailSent=false');
    }

    const order = new Order({
        total: cart.total,
        items: cart.items.map(item => {
            return {
                product: {
                    _id: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    images: item.product.images
                },
                amount: item.amount
            }
        }),
        variableSymbol,
        firstName,
        lastName,
        email,
        phone,
        street,
        city,
        zipCode,
        delivery,
        deliveryCost: consts.deliveryCosts[delivery][cart.shippingCostId],
        payment,
        paymentCost: consts.paymentCosts[payment],
        date: new Date().toISOString(),
        status: consts.orderStatuses[0],
        isPayed: false,
        invoiceUrl: 'url',
        isCanceled: false,
        cancelInvoiceUrl: null
    });
    
    const invoiceName = 'invoice-' + order._id + '.pdf';
    const invoicePath = path.join('pdf', 'invoices', invoiceName);
    order.invoiceUrl = invoicePath;

    await generateInvoice(order, invoicePath);

    await order.save();

    req.session.cart = null;

    transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        cc: process.env.MAIL_USER,
        subject: 'Keramika Rosice: Objednávka přijata',
        html: '<h1>This is working!</h1>',
        attachments: [{
            filename: invoiceName,
            path: invoicePath,
            contentType: 'application/pdf'
        }],
    }, async (err, info) => {
        if (order.payment !== 'CRD') {
            if (err) {
                console.log(err);
                return res.redirect('/kosik?success=true&mailSent=false');
            }
            return res.redirect('/kosik?success=true&mailSent=true');
        }

        // Whether the e-mail is sent or not,
        // if payment is of type 'CRD'
        // stripe session id should be sent as JSON data

        // Create stripe-compatible item list with delivery and payment cost
        const stripeItems = order.items.map(item => {
            return {
                price_data: {
                    currency: 'czk',
                    product_data: {
                        name: item.product.name,
                        images: item.product.images.map(image => `https://testapp-4400.rostiapp.cz/${image}`)
                    },
                    unit_amount: (item.product.price * 100)
                },
                quantity: item.amount
            }
        });
        stripeItems.push({
            price_data: {
                currency: 'czk',
                product_data: {
                    name: `Platba kartou`,
                    images: ['https://testapp-4400.rostiapp.cz/success.jpg']
                },
                unit_amount: (order.paymentCost * 100)
            },
            quantity: 1
        });
        stripeItems.push({
            price_data: {
                currency: 'czk',
                product_data: {
                    name: `Poštovné`,
                    images: ['https://testapp-4400.rostiapp.cz/success.jpg']
                },
                unit_amount: (order.deliveryCost * 100)
            },
            quantity: 1
        });

        // Create stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: stripeItems,
            mode: 'payment',
            success_url: `https://testapp-4400.rostiapp.cz/success.html`,
            cancel_url: `https://testapp-4400.rostiapp.cz/cancel.html`
        });
    
        return res.json({ id: session.id })
    });
}