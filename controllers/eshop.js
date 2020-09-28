const mongoose = require('mongoose');

const Product = require("../models/product");
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const Cart = require('../models/cart');

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


    const categoryProducts = await Product.find({ categoryId: categoryId })

    console.log(categoryProducts);

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


    const subcategoryProducts = await Product.find({ subcategoryId: subcategoryId })

    console.log(subcategoryProducts);

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
        updatedCart = new Cart(cart.items, cart.amount, cart.shippingCostId);
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
        err && console.log(err);
        return res.status(200).json({
            msg: "Product added",
            cart: updatedCart
        })
    })
}

exports.getOrder = (req, res, next) => {
    res.render('eshop/order', {
        title: 'Objednávka'
    })
}

exports.postOrder = (req, res, next) => {
    
}