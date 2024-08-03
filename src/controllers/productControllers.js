const Product = require('../dao/models/productModels.js');
const mongoose = require('mongoose');
// const logger = require('../utils/logger.js');
const createLogger = require('../utils/logger.js')
const logger=createLogger("production")

class ProductController {
    static async getProductsAvailable(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const options = {
                page: parseInt(page),
                limit: parseInt(limit)
            };
            const products = await Product.aggregate([
                { $match: { status: "Disponible" } },
                {
                    $group: {
                        _id: "$category",
                        products: { $push: "$$ROOT" } 
                    }
                }
            ]);

            res.status(200).json({
                products
            });
        } catch (error) {
            res.status(500).json({
                error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
                detalle: error.message
            });
        }
    }

    static async getProducts(req, res) {
        try {
            const { page = 1, limit = 5, sort = "asc" } = req.query;
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: { price: sort === "asc" ? 1 : -1 },
            };
            const products = await Product.paginate({}, options);

            res.status(200).json({
                products
            });
        } catch (error) {
            res.status(500).json({
                error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
                detalle: error.message
            });
        }
    }

    static async getProductById(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: `Id inválido` });
            }
            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ error: `No existe un producto con id ${id}` });
            }
            res.status(200).json({ product });
        } catch (error) {
            res.status(500).json({
                error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
                detalle: error.message
            });
        }
    }

    static async createProduct(req, res) {
        try {
            const { title, description, code, price, status, stock, category, thumbnails } = req.body;
            if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
                logger.warn('Faltan datos obligatorios para crear un producto');
                return res.status(400).json({ error: `Faltan datos obligatorios` });
            }

            const owner = req.user.email; 

            const newProduct = await Product.create({
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails,
                owner 
            });

            logger.info('Producto agregado satisfactoriamente');
            return res.status(201).json({ payload: newProduct });
        } catch (error) {
            logger.error(`Error inesperado en el servidor: ${error.message}`);
            return res.status(500).json({
                error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
                detalle: error.message
            });
        }
    }

    static async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const { title, description, code, price, status, stock, category, thumbnails } = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: `ID inválido` });
            }

            if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
                return res.status(400).json({ error: `Faltan datos obligatorios` });
            }

            let existingProduct = await Product.findById(id);

            if (!existingProduct) {
                return res.status(404).json({ error: `No existe un producto con ID ${id}` });
            }

            if (req.user.role === 'premium' && existingProduct.owner !== req.user.email) {
                return res.status(403).json({ error: 'No tienes permiso para actualizar este producto' });
            }

            existingProduct.title = title;
            existingProduct.description = description;
            existingProduct.code = code;
            existingProduct.price = price;
            existingProduct.status = status;
            existingProduct.stock = stock;
            existingProduct.category = category;
            existingProduct.thumbnails = thumbnails;

            let updatedProduct = await existingProduct.save();

            res.status(200).json({ product: updatedProduct });
        } catch (error) {
            res.status(500).json({
                error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
                detalle: error.message
            });
        }
    }

    static async deleteProduct(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }

            const existingProduct = await Product.findById(id);

            if (!existingProduct) {
                return res.status(404).json({ error: `No existe un producto con el ID ${id}` });
            }

            if (req.user.role === 'premium' && existingProduct.owner !== req.user.email) {
                return res.status(403).json({ error: 'No tienes permiso para eliminar este producto' });
            }

            await Product.findByIdAndDelete(id);

            res.status(200).json({ message: `Producto eliminado con ID ${id}` });
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

module.exports = ProductController;
