const router = require('express').Router();
const ash = require('express-async-handler');

const adminController = require('../controllers/admin');

router.get('/', adminController.getIndex);

router.get('/categories', adminController.getCategories);
router.post('/categories', ash(adminController.postCategories));  // Expecting { categoryId: String || false, categoryName: String }
router.delete('/categories/:categoryId', ash(adminController.deleteCategory));
router.put('/categories/', ash(adminController.putCategory)); // Expecting { categoryId: String, newCategoryName: String }
router.delete('/categories/sub/:subcategoryId', ash(adminController.deleteSubcategory));
router.put('/categories/sub/', ash(adminController.putSubcategory)); // Expecting { subcategoryId: String, newCategoryName: String }

router.get('/products', adminController.getProducts);
router.delete('/products/:productId', adminController.deleteProduct);

router.get('/products/edit', adminController.getEditProduct);
router.put('/products/edit', adminController.putEditProduct);
router.post('/products/edit', adminController.postEditProduct);

// Handling 404 case in admin section
router.use((req, res, next) => {
    res.status(404).render('admin/404', {
        title: 'Admin 404'
    })
})

module.exports = router;