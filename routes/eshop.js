const fs = require('fs');

// Library imports
const router = require('express').Router();
const ash = require('express-async-handler');
const { body } = require('express-validator');

// Custom imports
const eshopController = require('../controllers/eshop');

router.get('/shop', ash(eshopController.getShop));
router.get('/shop/:category/:subcategory', ash(eshopController.getSubcategory));
router.get('/shop/:category', ash(eshopController.getCategory));

router.get('/kosik', ash(eshopController.getCart));

// Update cart route, application/json
router.post('/kosik',
    body('amount')
        .custom(amount => {
            if (isNaN(Number(amount)) && amount) {
                throw new Error('Množství (amount) musí být číslo nebo nepravdivá hodnota');
            }

            return true;
        }),
    body('action')
        .custom(action => {
            if (action !== 'ADD' && action !== 'REMOVE') {
                throw new Error('Akce (action) musí být string určené hodnoty');
            }

            return true;
        }),
    ash(eshopController.postCart)
); // Expecting { productId: String, amount: Number || false, action: 'ADD' || 'REMOVE' }

// Place an order, text/html
router.post('/objednavka',
    body('firstName')
        .not().isEmpty()
        .isString()
        .isLength({ min: 2 })
        .withMessage('Jméno musí mít alespoň 2 znaky'),
    body('lastName')
        .not().isEmpty()
        .isString()
        .isLength({ min: 2 })
        .withMessage('Příjmení musí mít alespoň 2 znaky'),
    body('email')
        .not().isEmpty()
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('E-mail nebyl správně zadán'),
    body('phone')
        .not().isEmpty()
        .trim()
        .isString()
        .isLength({ min: 9, max: 9 })
        .withMessage('Telefon musí mít 9 číslic'),
    body('street')
        .notEmpty()
        .trim()
        .isString()
        .isLength({ min: 4 })
        .withMessage('Ulice a č.p. musí mít dohromady alespoň 4 znaky'),
    body('city')
        .notEmpty()
        .trim()
        .isString()
        .isLength({ min: 2 })
        .withMessage('Město musí mít alespoň 2 znaky'),
    body('zipCode')
        .notEmpty()
        .trim()
        .isString()
        .isLength({ min: 5, max: 5 })
        .custom(zipCode => {
            if (isNaN(Number(zipCode))) {
                throw new Error('PSČ musí mít právě 5 číslic');
            }

            return true;
        })
        .withMessage('PSČ musí mít právě 5 číslic'),
    body('delivery')
        .notEmpty()
        .trim()
        .isString()
        .isLength({ min: 3, max: 3 })
        .custom(async (delivery) => {
            const constantsRaw = await fs.promises.readFile('constants.json');
            const constants = JSON.parse(constantsRaw);

            const deliveryMethods = Object.keys(constants.deliveryCosts);
            if (!deliveryMethods.includes(delivery)) {
                throw new Error('Doručení musí být jedna z nabízených možností');
            }

            return true;
        })
        .withMessage('Doručení musí být jedna z nabízených možností'),
    body('payment')
        .notEmpty()
        .trim()
        .isString()
        .isLength({ min: 3, max: 3 })
        .custom(async (payment) => {
            const constantsRaw = await fs.promises.readFile('constants.json');
            const constants = JSON.parse(constantsRaw);

            const paymentMethods = Object.keys(constants.paymentCosts);
            if (!paymentMethods.includes(payment)) {
                throw new Error('Platba musí být jedna z nabízených možností');
            }

            return true;
        })
        .withMessage('Platba musí být jedna z nabízených možností'),
    ash(eshopController.postOrder)
); /* Expecting {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    street: String, // ulice, čp
    city: String, // city
    zipCode: String,
    delivery: String, // 'ZAS' = zásikovna, 'POS' = pošta, 'OOD' = osobní odběr,
    payment: String, // 'DOB' = dobírka, 'BTR' = bankovní převod, 'CRD' = kartou
} */

module.exports = router;