const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ProductController = require('../controllers/productControllers');


router.get('/', auth(['usuario', 'admin', 'premium']), ProductController.getProductsAvailable);

router.get('/:id', auth(['usuario', 'admin', 'premium']), ProductController.getProductById);

router.post('/', auth(['usuario', 'admin', 'premium']), ProductController.createProduct);

router.put('/:id', auth(['usuario', 'admin', 'premium']), ProductController.updateProduct);

router.delete('/:id', auth(['usuario', 'admin', 'premium']), ProductController.deleteProduct);

module.exports = router;
