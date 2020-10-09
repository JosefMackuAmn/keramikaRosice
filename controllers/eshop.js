const fs = require('fs');

const mongoose = require('mongoose');

const Product = require("../models/product");
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const Cart = require('../models/cart');
const Order = require('../models/order');

exports.getShop = async (req, res, next) => {
    const products = await Product.find({});

    res.render('eshop/shop', {
        title: 'E-shop',
        products: products
    })
}

exports.getCategory = async (req, res, next) => {
    const categoryName = req.params.category.toLowerCase();
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
        return res.status(400).render('eshop/shop', {
            title: 'Kategorie nenalezena',
            categoryProducts: []
        })
    }
    const categoryId = category._id;


    const categoryProducts = await Product.find({ categoryId: categoryId });

    res.render('eshop/shop', {
        title: categoryName,
        categoryProducts: categoryProducts
    });
}

exports.getSubcategory = async (req, res, next) => {
    const categoryName = req.params.category.toLowerCase();
    const subcategoryName = req.params.subcategory.toLowerCase();
    
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
        return res.status(400).render('eshop/shop', {
            title: 'Kategorie nenalezena',
            categoryProducts: []
        })
    }
    const categoryId = category._id;


    const subcategory = await Subcategory.findOne({ name: subcategoryName, categoryId: categoryId });
    if (!subcategory) {
        return res.status(400).render('eshop/shop', {
            title: 'Podkategorie nenalezena',
            categoryProducts: []
        })
    }
    const subcategoryId = subcategory._id;


    const subcategoryProducts = await Product.find({ subcategoryId: subcategoryId });

    res.render('eshop/shop', {
        title: subcategoryName
    });
}

exports.getCart = (req, res, next) => {
    res.render('eshop/cart', {
        title: 'Košík'
    })
}

exports.postCart = async (req, res, next) => {
    const cart = req.session.cart;
    const productId = req.body.productId;
    const amount = req.body.amount;
    const action = req.body.action;
    
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
                msg: "amount property has to be passed along with an 'ADD' action"
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

    const cart = req.session.cart;

    const order = new Order({
        total: cart.total,
        items: cart.items.map(item => {
            return {
                product: {
                    _id: item.product._id,
                    name: item.product.name,
                    price: item.product.price
                },
                amount: item.amount
            }
        }),
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
        invoiceUrl: 'url'
    });

    await order.save();

    req.session.cart = null;

    res.status(201).render('eshop/cart', {
        title: "Objednávka úspěšná"
    })

}