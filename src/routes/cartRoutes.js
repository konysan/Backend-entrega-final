const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartControllers.js');
const auth = require('../middlewares/auth.js');

router.post('/', auth('usuario'),CartController.createCart)

router.get('/:cid',auth(['usuario', 'admin', 'premium']), CartController.getCartById);

router.delete('/:cartId/products/:productId',auth('usuario'), CartController.removeProductFromCart);
  
router.delete("/:cartId",auth('usuario'), CartController.removeAllProducts);
  
router.put('/:cid/products/:pid', auth(['usuario', 'admin', 'premium']), CartController.addOrUpdateProduct);

router.post("/:cid/purchase", auth(['usuario', 'admin', 'premium']), CartController.finalizePurchase);

module.exports = router;

