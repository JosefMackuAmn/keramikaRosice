exports.getShop = (req, res, next) => {
    res.render('eshop/shop', {
        title: 'E-shop'
    })
}

exports.getCategory = (req, res, next) => {
    const category = req.params.category;

    res.render('eshop/shop', {
        title: 'Category: ' + category
    });
}

exports.getCart = (req, res, next) => {
    res.render('eshop/cart', {
        title: 'Košík'
    })
}

exports.postCart = (req, res, next) => {
    
}

exports.deleteCart = (req, res, next) => {
    
}

exports.getOrder = (req, res, next) => {
    res.render('eshop/order', {
        title: 'Objednávka'
    })
}

exports.postOrder = (req, res, next) => {
    
}