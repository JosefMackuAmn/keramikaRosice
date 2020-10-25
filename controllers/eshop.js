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
const asyncHelpers = require('../util/asyncHelpers');

exports.getShop = async (req, res, next) => {
    const allCategories = await Category.find({});
    const allSubcategories = await Subcategory.find({});
    const products = await Product.find({});

    res.render('eshop/shop', {
        title: 'E-shop',
        categoryName: undefined,
        subcategoryName: undefined,
        products: products,
        categories: allCategories,
        subcategories: allSubcategories
    })
}

exports.getCategory = async (req, res, next) => {
    const categoryName = req.params.category.toLowerCase();
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
        return res.status(400).render('eshop/shop', {
            title: 'Kategorie nenalezena',
            products: []
        })
    }
    const categoryId = category._id;

    const categoryProducts = await Product.find({ categoryId: categoryId });
    
    const allCategories = await Category.find({});
    const allSubcategories = await Subcategory.find({});

    res.render('eshop/shop', {
        title: categoryName,
        categoryName: categoryName,
        subcategoryName: undefined,
        products: categoryProducts,
        categories: allCategories,
        subcategories: allSubcategories
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
    
    const allCategories = await Category.find({});
    const allSubcategories = await Subcategory.find({});

    res.render('eshop/shop', {
        title: subcategoryName,
        categoryName: categoryName,
        subcategoryName: subcategoryName,
        products: subcategoryProducts,
        categories: allCategories,
        subcategories: allSubcategories
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

    const date = new Date();
    console.log('nodemon 1')
    const variableSymbol = await asyncHelpers.getVariableSymbol(date);
    console.log('nodemon 2')

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
        date: date.toISOString(),
        status: consts.orderStatuses[0],
        isPayed: false,
        invoiceUrl: 'url',
        isCanceled: false,
        cancelInvoiceUrl: null
    });
    
    const invoiceName = 'invoice-' + order._id + '.pdf';
    const invoicePath = path.join('pdf', 'invoices', invoiceName);
    order.invoiceUrl = invoicePath;

    generateInvoice(order, invoicePath);
    console.log('after invoice generated');

    await order.save();
    console.log('order saved');

    req.session.cart = null;
    console.log('cart cleared');

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
    }, (err, info) => {
        console.log('after mail sent');
        if (order.payment !== 'CRD') {
            if (err) {
                console.log(err);
                return res.redirect(`/?success=true&mailSent=false&payment=${order.payment}`);
            }
            return res.redirect(`/?success=true&mailSent=true&payment=${order.payment}`);
        }

        // Whether the e-mail is sent or not,
        // if payment is of type 'CRD'
        // stripe session id should be sent as JSON data
        const returnStripeSessionId = async () => {

            // Create stripe-compatible item list with delivery and payment costs
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
                        images: ['https://www.keramika-rosice.cz/img/white.png']
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
                        images: ['https://www.keramika-rosice.cz/img/white.png']
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
                success_url: `https://www.keramika-rosice.cz/?payment=success`,
                cancel_url: `https://www.keramika-rosice.cz/?payment=canceled`
            });
            
            order.stripePaymentIntent = session.payment_intent;
            await order.save();
        
            return res.json({ id: session.id });
        }

        return returnStripeSessionId();

    });
}

exports.postCheckoutWebhook = async (req, res, next) => {
    const payload = req.body;
    const stripeSignature = req.headers['stripe-signature'];
    
    let event;
    try {
        event = stripe.webhooks.constructEvent(payload, stripeSignature, process.env.STRIPE_ENDPOINT_SECRET);
    } catch (err) {
        console.log(err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Retrieve stripe session
    const session = event.data.object;

    switch (event.type) {
        case 'checkout.session.completed': {

            // Find corresponding order
            const order = await Order.findOne({ stripePaymentIntent: session.payment_intent });
            if (!order) {
                res.status(500);
            }

            if (session.payment_status === 'paid') {

                // Mark order as payed and send email
                try {
                    const result = await asyncHelpers.paidOrderHandler(order);
                } catch (err) {
                    console.log(err);
                    res.status(500);
                }

            }

            break;
        }
        case 'checkout.session.async_payment_succeeded': {

            // Find corresponding order
            const order = await Order.findOne({ stripePaymentIntent: session.payment_intent });
            if (!order) {
                res.status(500);
            }

            // Mark order as payed and send email
            try {
                const result = await asyncHelpers.paidOrderHandler(order);
            } catch (err) {
                console.log(err);
                res.status(500);
            }

            break;
        }
        case 'checkout.session.async_payment_failed': {

            // Find corresponding order
            const order = await Order.findOne({ stripePaymentIntent: session.payment_intent });
            if (!order) {
                res.status(500);
            }

            // Send email with notification about unprocessed payment
            transporter.sendMail({
                from: process.env.MAIL_USER,
                to: order.email,
                cc: process.env.MAIL_USER,
                subject: 'Keramika Rosice: Nepovedená platba',
                html: '<h1>Platba se nepovedla!</h1>'
            }, (err, info) => {
                if (err) {
                    console.log(err);
                }
            });

            break;
        }
        default: null;
    }

    return res.status(200);
}