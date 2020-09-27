const router = require('express').Router();

const adminController = require('../controllers/admin');

router.get('/categories', adminController.getCategories);
router.get('/products', adminController.getProducts);
router.get('/edit-product', adminController.getEditProduct);

module.exports = router;