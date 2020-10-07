// Library imports
const router = require('express').Router();
const ash = require('express-async-handler');

// Custom imports
const eshopController = require('../controllers/eshop');

router.get('/shop', ash(eshopController.getShop));
router.get('/shop/:category/:subcategory', ash(eshopController.getSubcategory)); // Development note: category name has to be unique
router.get('/shop/:category', ash(eshopController.getCategory)); // Development note: subcategory name has to be unique

router.get('/kosik', eshopController.getCart);

// Update cart route, application/json
router.post('/kosik', ash(eshopController.postCart)); // Expecting { productId: String, amount: Number || false, action: 'ADD' || 'REMOVE' }

// Place an order, text/html
router.post('/objednavka', ash(eshopController.postOrder)); /* Expecting {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    street: String, // ulice, čp
    city: String, // city, zipcode
    delivery: String, // 'ZAS' = zásikovna, 'POS' = pošta, 'OOD' = osobní odběr,
    payment: String, // 'DOB' = dobírka, 'BTR' = bankovní převod, 'CRD' = kartou
} */

module.exports = router;