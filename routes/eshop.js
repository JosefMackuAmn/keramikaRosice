// Library imports
const router = require('express').Router();

// Custom imports
const eshopController = require('../controllers/eshop');

router.get('/shop', eshopController.getShop);
router.get('/kosik', eshopController.getCart);

module.exports = router;