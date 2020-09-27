exports.getCategories = (req, res, next) => {
    res.render('admin/categories', {
        title: 'Categories'
    })
}

exports.getProducts = (req, res, next) => {
    res.render('admin/products', {
        title: 'Products'
    });
}

exports.getEditProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        title: 'Edit product'
    })
}