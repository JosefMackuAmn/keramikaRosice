const categoriesAdminController = require('./categories');
const productsAdminController = require('./products');

const getIndex = (req, res, next) => {
    res.render('admin/index', {
        title: 'Admin index'
    })
}

module.exports = {
    ...categoriesAdminController,
    ...productsAdminController,
    getIndex
}