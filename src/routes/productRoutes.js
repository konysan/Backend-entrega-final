const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ProductController = require('../controllers/productControllers');

router.get('/', auth(['premium', 'admin']), ProductController.getProducts);

router.get('/products', auth(['premium', 'admin']), ProductController.getProductsAvailable);

router.get('/:id', auth(['premium', 'admin']), ProductController.getProductById);

router.post('/', auth(['premium', 'admin']), ProductController.createProduct);

router.put('/:id', auth(['premium', 'admin']), ProductController.updateProduct);

router.delete('/:id', auth(['premium', 'admin']), ProductController.deleteProduct);

module.exports = router;
