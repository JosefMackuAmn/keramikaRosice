const fs = require('fs');

const router = require('express').Router();
const ash = require('express-async-handler');
const { body } = require('express-validator');

const adminController = require('../controllers/admin/index');
const isAuth = require('../middleware/is-auth');

router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin); // Expecting { password: String }
router.get('/logout', adminController.getLogout);

router.get('/', isAuth, adminController.getIndex);

router.get('/categories', isAuth, ash(adminController.getCategories));
router.post('/categories', isAuth,
    body('categoryId')
        .custom((categoryId) => {
            if (typeof categoryId !== 'string' && categoryId) {
                throw new Error('categoryId should be a string or falsy value');
            }
            return true;
        }),
    body('categoryName')
        .trim()
        .isString().withMessage('categoryName must be a string')
        .isLength({min: 3}).withMessage('categoryName must be at least 3 characters long'),
    ash(adminController.postCategories)
);  // Expecting { categoryId: String || null, categoryName: String, image: File }

router.delete('/categories/:categoryId', isAuth, ash(adminController.deleteCategory));
router.put('/categories/', isAuth,
    body('newCategoryName')
        .trim()
        .isString().withMessage('newCategoryName must be a string')
        .isLength({min: 3}).withMessage('newCategoryName must be at least 3 characters long'),
    ash(adminController.putCategory)
); // Expecting { categoryId: String, newCategoryName: String, image: File || null }

router.delete('/categories/sub/:subcategoryId', isAuth, ash(adminController.deleteSubcategory));
router.put('/categories/sub/', isAuth,
    body('newCategoryName')
        .trim()
        .isString().withMessage('newCategoryName must be a string')
        .isLength({min: 3}).withMessage('newCategoryName must be at least 3 characters long'),
    ash(adminController.putSubcategory)
); // Expecting { subcategoryId: String, newCategoryName: String }

router.get('/products', isAuth, ash(adminController.getProducts));
router.delete('/products/:productId', isAuth, ash(adminController.deleteProduct));

router.get('/products/add', isAuth, ash(adminController.getAddProduct));
router.post('/products/add', isAuth,
    body('name')
        .trim()
        .isString()
        .isLength({ min: 2 }).withMessage('name should be at least 2 characters long'),
    body('description')
        .trim()
        .isString()
        .isLength({ min: 5 }).withMessage('description should be at least 5 characters long'),
    body('price')
        .isNumeric().withMessage('price should be a number'),
    body('amountInStock')
        .isNumeric().withMessage('amountInStock should be a number'),
    body('shippingCostId')
        .custom(shippingCostId => {
            if (shippingCostId != 0 && shippingCostId != 1) {
                throw new Error('shippingCostId should be a number, either 0 or 1')
            }

            return true;
        }),
    ash(adminController.postAddProduct)
); /* Expecting {
    name: String,
    description: String,
    price: Number,
    categoryId: String,
    subcategoryId: String || null,
    amountInStock: Number,
    shippingCostId: Number,
    image: File
} */

router.get('/products/edit/:productId', isAuth, ash(adminController.getEditProduct));
router.post('/products/edit', isAuth,
    body('name')
        .trim()
        .isString()
        .isLength({ min: 2 }).withMessage('name should be at least 2 characters long'),
    body('description')
        .trim()
        .isString()
        .isLength({ min: 5 }).withMessage('description should be at least 5 characters long'),
    body('price')
        .isNumeric().withMessage('price should be a number'),
    body('amountInStock')
        .isNumeric().withMessage('amountInStock should be a number'),
    body('shippingCostId')
        .custom(shippingCostId => {
            console.log(shippingCostId);
            if (shippingCostId != 0 && shippingCostId != 1) {
                throw new Error('shippingCostId should be a number, either 0 or 1')
            }
            
            return true;
        }),
    ash(adminController.postEditProduct)
); /* Expecting {
    productId: String,
    name: String,
    description: String,
    price: Number,
    categoryId: String,
    subcategoryId: String || null,
    amountInStock: Number,
    shippingCostId: Number,
    image: File || null
} */

router.get('/orders', isAuth, ash(adminController.getOrders));
router.get('/orders/:orderId', isAuth, ash(adminController.getOrderDetail));

// Edit order status and isPayed
router.put('/orders', isAuth,
    body('status')
        .trim()
        .custom(async (status) => {
            const constantsRaw = await fs.promises.readFile('constants.json');
            const constants = JSON.parse(constantsRaw);

            if (!constants.orderStatuses.includes(status)) {
                throw new Error('status is not a valid status string');
            }

            return true;
        }),
    body('isPayed')
        .isBoolean().withMessage('isPayed should be a boolean'),
    ash(adminController.putOrder)
); // Expecting { orderId: String, status: String, isPayed: Boolean }

// Cancel order
router.post('/orders/cancel', isAuth, ash(adminController.postCancelOrder)); // Expecting { orderId: String }

router.get('/invoice/:orderId', isAuth, ash(adminController.getInvoice));

// Handling error cases in admin section
router.use(isAuth, (error, req, res, next) => {
    console.log(error);
    const errorMessage = error.message || error.msg;
    const errorStatus = error.status || 500;
    if (req.headers.accept === 'application/json') {
        return res.status(errorStatus).json({
            msg: errorMessage
        })
    }
    res.status(errorStatus).render('admin/error', {
        title: 'Error ' + errorStatus,
        message: errorMessage
    })
})

// Handling 404 case in admin section
router.use(isAuth, (req, res, next) => {
    res.status(404).render('admin/error', {
        title: 'Error 404',
        message: 'This site does not exist.'
    })
})

module.exports = router;