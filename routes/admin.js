const router = require('express').Router();
const ash = require('express-async-handler');

const adminController = require('../controllers/admin/index');

router.get('/', adminController.getIndex);

router.get('/categories', ash(adminController.getCategories));
router.post('/categories', ash(adminController.postCategories));  // Expecting { categoryId: String || null, categoryName: String }
router.delete('/categories/:categoryId', ash(adminController.deleteCategory));
router.put('/categories/', ash(adminController.putCategory)); // Expecting { categoryId: String, newCategoryName: String }
router.delete('/categories/sub/:subcategoryId', ash(adminController.deleteSubcategory));
router.put('/categories/sub/', ash(adminController.putSubcategory)); // Expecting { subcategoryId: String, newCategoryName: String }

router.get('/products', ash(adminController.getProducts));
router.delete('/products/:productId', ash(adminController.deleteProduct));

router.get('/products/add', ash(adminController.getAddProduct));
router.post('/products/add', ash(adminController.postAddProduct)); /* Expecting {
    name: String,
    description: String,
    price: Number,
    categoryId: String,
    subcategoryId: String || null,
    amountInStock: Number,
    shippingCostId: Number
} */

router.get('/products/edit/:productId', ash(adminController.getEditProduct));
router.put('/products/edit', ash(adminController.putEditProduct));  /* Expecting {
    productId: String,
    name: String,
    description: String,
    price: Number,
    categoryId: String,
    subcategoryId: String || null,
    amountInStock: Number,
    shippingCostId: Number
} */

// Handling 404 case in admin section
router.use((req, res, next) => {
    res.status(404).render('admin/404', {
        title: 'Admin 404'
    })
})

module.exports = router;