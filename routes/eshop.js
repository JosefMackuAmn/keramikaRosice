// Library imports
const router = require('express').Router();

// Custom imports
const eshopController = require('../controllers/eshop');

router.get('/shop', eshopController.getShop);
router.get('/shop/:category', eshopController.getCategory);

router.get('/kosik', eshopController.getCart);
// Add to cart route
router.post('/kosik', eshopController.postCart);
// Delete from cart route
router.delete('/kosik/:productId', eshopController.deleteCart);

router.get('/objednavka', eshopController.getOrder);
// Place an order
router.post('/objednavka', eshopController.postOrder);

module.exports = router;