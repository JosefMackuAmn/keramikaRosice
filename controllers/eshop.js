exports.getShop = (req, res, next) => {
    res.render('eshop/shop', {
        title: 'E-shop'
    })
}

exports.getCart = (req, res, next) => {
    res.render('eshop/cart', {
        title: 'Košík'
    })
}