const router = require('express').Router();
const ash = require('express-async-handler');

const adminController = require('../controllers/admin/index');
const isAuth = require('../middleware/is-auth');

router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin); // Expecting { password: String }
router.get('/logout', adminController.getLogout);

router.get('/', isAuth, adminController.getIndex);

router.get('/categories', isAuth, ash(adminController.getCategories));
router.post('/categories', isAuth, ash(adminController.postCategories));  // Expecting { categoryId: String || null, categoryName: String }
router.delete('/categories/:categoryId', isAuth, ash(adminController.deleteCategory));
router.put('/categories/', isAuth, ash(adminController.putCategory)); // Expecting { categoryId: String, newCategoryName: String }
router.delete('/categories/sub/:subcategoryId', isAuth, ash(adminController.deleteSubcategory));
router.put('/categories/sub/', isAuth, ash(adminController.putSubcategory)); // Expecting { subcategoryId: String, newCategoryName: String }

router.get('/products', isAuth, ash(adminController.getProducts));
router.delete('/products/:productId', isAuth, ash(adminController.deleteProduct));

router.get('/products/add', isAuth, ash(adminController.getAddProduct));
router.post('/products/add', isAuth, ash(adminController.postAddProduct)); /* Expecting {
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
router.put('/products/edit', isAuth, ash(adminController.putEditProduct));  /* Expecting {
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

// Handling error cases in admin section
router.use(isAuth, (error, req, res, next) => {
    console.log(error);
    res.status(500).render('admin/error', {
        title: 'Error 500',
        message: 'An error occured on the server side. Please try again or contact AmnioN Web.'
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