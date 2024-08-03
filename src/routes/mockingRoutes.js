const express = require('express');
const { generateMockProducts } = require('../mocking/mockProducts.js');
const ProductMongoDAO = require('../dao/productMongoDAO');

const router = express.Router();

router.get('/mockingproducts', async (req, res) => {
  const mockProducts = generateMockProducts();
  res.json(mockProducts);
});

router.post('/addproduct', async (req, res, next) => {
  const productDao = new ProductMongoDAO();
  const { title, description, code, price, status, stock, category, thumbnails, createdAt } = req.body;

  try {
    const newProduct = await productDao.addProduct({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
      createdAt
    });
    res.json({ message: 'Producto creado satisfactoriamente', product: newProduct });
  } catch (error) {
    next({ type: 'invalidProductData', error: error.message });
  }
});

module.exports = router;
