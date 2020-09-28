// Library imports
const router = require('express').Router();
const ash = require('express-async-handler');

// Custom imports
const eshopController = require('../controllers/eshop');

router.get('/shop', ash(eshopController.getShop));
router.get('/shop/:category/:subcategory', ash(eshopController.getSubcategory)); // Development note: category name has to be unique
router.get('/shop/:category', ash(eshopController.getCategory)); // Development note: subcategory name has to be unique

router.get('/kosik', eshopController.getCart);
// Update cart route
router.post('/kosik', ash(eshopController.postCart)); // Expecting { productId: String, amount: Number || false, action: 'ADD' || 'REMOVE' }

router.get('/objednavka', eshopController.getOrder);
// Place an order
router.post('/objednavka', eshopController.postOrder);

module.exports = router;