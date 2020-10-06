const mongoose = require('mongoose');

const Product = require("../../models/product");
const Category = require('../../models/category');
const Subcategory = require('../../models/subcategory');

///////////////////////
///// Products
exports.getProducts = async (req, res, next) => {
    const allProducts = await Product.find({});

    res.render('admin/products', {
        title: 'Products',
        products: allProducts
    });
}

exports.deleteProduct = async (req, res, next) => {
    const productId = body.params.productId;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(422).json({
            msg: "productId is not a valid ID string"
        })
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (deletedProduct) {
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
    const allCategories = await Category.find({});
    const allSubcategories = await Subcategory.find({});
    
    res.render('admin/edit-product', {
        title: 'Add product',
        categories: allCategories,
        subcategories: allSubcategories
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
    //const image = req.file;

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

    const product = new Product({
        name,
        description,
        price,
        categoryId,
        subcategoryId: subcategory ? subcategoryId : null,
        amountInStock,
        shippingCostId,
        images: ['']
    })
    await product.save();

    res.redirect('/admin/products');
}

// Edit product
exports.getEditProduct = async (req, res, next) => {
    const productId = req.params.productId;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(422).json({
            msg: "productId is not a valid ID string"
        })
    }

    const product = await Product.findById(productId);

    if (product) {
        return res.render('admin/edit-product', {
            title: 'Edit product',
            product: product
        });
    }

    return res.render('admin/edit-product', {
        title: 'Edit product',
        product: null
    })
}

exports.putEditProduct = async (req, res, next) => {
    const productId = req.body.productId;

    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const categoryId = req.body.categoryId;
    const subcategoryId = req.body.subcategoryId;
    const amountInStock = req.body.amountInStock;
    const shippingCostId = req.body.shippingCostId;

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

    await Product.updateOne({ _id: productId }, {
        name,
        description,
        price,
        categoryId,
        subcategoryId: subcategory ? subcategoryId : null,
        amountInStock,
        shippingCostId,
        images: ['']
    })

    res.redirect('/admin/products');
}