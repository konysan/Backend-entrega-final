const CartMongoDAO = require('../dao/cartMongoDAO.js');
const Cart = require('../dao/models/cartModels.js');
const { generateUniqueCode, calculateTotalAmount } = require('../utils/utils.js');
const Product = require("../dao/models/productModels.js");
const Ticket = require ("../dao/models/ticket.js")

const cartDAO = new CartMongoDAO();

class CartController {
    static async createCart(req, res) {
        const initialProducts = req.body.products || [];
        console.log("Productos iniciales recibidos:", initialProducts);

        try {
            const newCart = await cartDAO.createCart(initialProducts);
            console.log("Nuevo carrito creado:", newCart);
            res.status(201).json(newCart);
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    static async getCartById(req, res) {
        const cartId = req.params.cid;

        try {
            const cart = await Cart.findById(cartId).populate({
                path: "products.productId",
                select: "title price description code category stock status",
            });

            if (!cart) {
                return res.status(400).json({ error: "Carrito no encontrado" });
            }

            res.json(cart);
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            res.status(500).json({ error: "Error del servidor: " + error.message });
        }
    }

    static async removeProductFromCart(req, res) {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        
        try {
            await cartDAO.removeProductsCart(cartId, productId);

            res.json({ message: "Producto eliminado del carrito exitosamente" });
        } catch (error) {
            res.status(500).json({
                error: "Error al eliminar el producto del carrito: " + error.message,
            });
        }
    }

    static async removeAllProducts(req, res) {
        const cartId = req.params.cartId;
        try {
            await cartDAO.removeAllProducts(cartId);
            res.json({
                message: "Todos los productos han sido eliminados del carrito exitosamente",
            });
        } catch (error) {
            res.status(500).json({
                error: "Error al eliminar todos los productos del carrito: " + error.message,
            });
        }
    }

    static async addOrUpdateProduct(req, res) {
        try {
            const { cid, pid } = req.params;
    
            const cart = await Cart.findById(cid);
            const product = await Product.findById(pid);
    
            if (!cart || !product) {
                return res.status(404).json({ message: 'Carrito o producto no encontrado' });
            }
            const cartProduct = cart.products.find(p => p.productId.toString() === pid);
            if (cartProduct) {
                cartProduct.quantity += 1;
            } else {
                cart.products.push({ productId: pid, quantity: 1 });
            }
            await cart.save();
    
            product.stock -= 1;
            await product.save();
    
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } 
    
    static async finalizePurchase (req, res) {
        try {
            const { cid } = req.params; 
            const userId = req.session.usuario._doc._id; 
    
            if (!userId) {
                return res.status(400).json({ error: 'ID de usuario no disponible en la sesión' });
            }
    
            const cart = await Cart.findById(cid).populate('products.productId');
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
    
            if (!cart.products || cart.products.length === 0) {
                return res.status(400).json({ error: 'El carrito está vacío' });
            }
    
            const totalAmount = calculateTotalAmount(cart.products);
    
            const ticketCode = generateUniqueCode(); 
    
            console.log('ID de usuario:', userId);
    
            const ticket = new Ticket({
                code: ticketCode,
                amount: totalAmount,
                purchaser: userId 
            });
    
            await ticket.save();
    
            await Cart.findByIdAndUpdate(cid, { products: [] });
    
            res.status(200).json({ message: 'Compra finalizada con éxito', ticket });
        } catch (error) {
            console.error('Error al finalizar la compra:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

module.exports = CartController;
