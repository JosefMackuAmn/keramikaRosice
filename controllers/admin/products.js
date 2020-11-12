const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const Product = require("../../models/product");
const Category = require('../../models/category');
const Subcategory = require('../../models/subcategory');

///////////////////////
///// Products
exports.getProducts = async (req, res, next) => {
    const page = req.query.page || 1;
    const search = req.query.search || '';

    const allProducts = await Product
        .find({
            $or: [
                {
                    name: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ]
        })
        .sort('-date')
        .limit(+process.env.ADMIN_PRODUCTS_PER_PAGE)
        .skip((page - 1) * +process.env.ADMIN_PRODUCTS_PER_PAGE)
        .populate({ path: 'categoryId' })
        .populate({ path: 'subcategoryId' })
    
    const numberOfProducts = await Product
        .find({
            $or: [
                {
                    name: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ]
        })
        .countDocuments({});

    const isNextPage = page * process.env.ADMIN_PRODUCTS_PER_PAGE < numberOfProducts;

    res.render('admin/products', {
        title: 'Products',
        products: allProducts,
        isNextPage,
        page,
        searchString: search
    });
}

exports.deleteProduct = async (req, res, next) => {
    const productId = req.params.productId;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(422).json({
            msg: "productId is not a valid ID string"
        })
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (deletedProduct) {
        await Promise.all(deletedProduct.images.map(image => {
            const imagePath = path.join('public', image);
            return fs.promises.unlink(imagePath);
        }));

        return res.status(200).json({
            msg: "Product deleted successfully",
            product: deletedProduct
        })
    }
    return res.status(202).json({
        msg: "Product not found"
    })
}

// Add product
exports.getAddProduct = async (req, res, next) => {
    const allCategories = await Category.find({}).sort('-date');
    const allSubcategories = await Subcategory.find({}).sort('-date');
    
    res.render('admin/edit-product', {
        title: 'Add product',
        categories: allCategories,
        subcategories: allSubcategories,
        product: null,
        editMode: false,
    })
}
exports.postAddProduct = async (req, res, next) => {
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const categoryId = req.body.categoryId;
    const subcategoryId = req.body.subcategoryId;
    const amountInStock = req.body.amountInStock;
    const shippingCostId = req.body.shippingCostId;
    const image = req.file;

    if (!image) {
        return res.status(422).json({
            msg: "image hasn't been received (expecting png, jpg, jpeg)"
        })
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new Error(errors.errors[0].msg);
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(422).json({
            msg: "categoryId is not a valid ID string"
        })
    }
    if (subcategoryId) {
        if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
            return res.status(422).json({
                msg: "subcategoryId is not a valid ID string"
            })
        }
    }

    const category = await Category.findById(categoryId);
    let subcategory = null;
    if (subcategoryId) {
        subcategory = await Subcategory.findById(subcategoryId);
    }

    if ((subcategoryId && !subcategory) || !category) {
        return res.status(422).json({
            msg: "Chosen category or subcategory does not exist"
        })
    }

    if (subcategoryId && (subcategory.categoryId.toString() !== category._id.toString())) {
        return res.status(422).json({
            msg: "Category and subcategory ID does not match"
        })
    }


    const product = new Product({
        name,
        description,
        price,
        categoryId,
        subcategoryId: subcategory ? subcategoryId : null,
        amountInStock,
        shippingCostId,
        images: ['img/' + image.filename]
    })
    await product.save();

    res.redirect('/admin/products');
}

// Edit product
exports.getEditProduct = async (req, res, next) => {
    const productId = req.params.productId;
    const allCategories = await Category.find({}).sort('-date');
    const allSubcategories = await Subcategory.find({}).sort('-date');

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        const error = new Error('ProductId is not a valid ID string');
        error.status = 422;
        return next(error);
    }

    const product = await Product.findById(productId);

    if (product) {
        return res.render('admin/edit-product', {
            title: 'Edit product',
            editMode: true,
            product: product,
            categories: allCategories,
            subcategories: allSubcategories
        });
    }

    const error = new Error('Product not found');
    error.status = 422;
    return next(error);
}

exports.postEditProduct = async (req, res, next) => {
    const productId = req.body.productId;

    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const categoryId = req.body.categoryId;
    const subcategoryId = req.body.subcategoryId;
    const amountInStock = req.body.amountInStock;
    const shippingCostId = req.body.shippingCostId;
    const image = req.file;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new Error(errors.errors[0].msg);
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(422).json({
            msg: "productId is not a valid ID string"
        })
    }
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(422).json({
            msg: "categoryId is not a valid ID string"
        })
    }
    if (subcategoryId) {
        if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
            return res.status(422).json({
                msg: "subcategoryId is not a valid ID string"
            })
        }
    }

    const category = await Category.findById(categoryId);
    let subcategory = null;
    if (subcategoryId) {
        subcategory = await Subcategory.findById(subcategoryId);
    }

    if ((subcategoryId && !subcategory) || !category) {
        return res.status(422).json({
            msg: "Chosen category or subcategory does not exist"
        })
    }

    if (image) {
        const oldProduct = await Product.findByIdAndUpdate(productId, {
            name,
            description,
            price,
            categoryId,
            subcategoryId: subcategory ? subcategoryId : null,
            amountInStock,
            shippingCostId,
            images: ['img/' + image.filename]
        })
    
        await Promise.all(oldProduct.images.map(image => {
            const imagePath = path.join('public', image);
            return fs.promises.unlink(imagePath);
        }));
    } else {
        await Product.updateOne({ _id: productId }, {
            name,
            description,
            price,
            categoryId,
            subcategoryId: subcategory ? subcategoryId : null,
            amountInStock,
            shippingCostId
        })
    }

    res.redirect('/admin/products');
}