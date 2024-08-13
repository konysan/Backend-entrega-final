const Cart = require('./models/cartModels.js');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
class CartMongoDAO {
    constructor() {
        
    }

      async create(){
      return await Cart.create({products:[]})
      }

      async findCart(filtro = {}, populateOptions = null) {
        let query = Cart.findOne(filtro);
        if (populateOptions) {
            query = query.populate(populateOptions);
        }
        return await query.lean();
      }
    
      async getCart() {
        try {
          return await Cart.find();
        } catch (error) {
          throw new Error("Error al obtener los carritos: " + error.message);
        }
      }
    
      async createCart(initialProducts = []) {
        try {
          console.log("Creando un nuevo carrito con productos:", initialProducts);
          const newCart = await Cart.create({ products: initialProducts });
          console.log("Nuevo carrito creado:", newCart);
          return newCart;
        } catch (error) {
          console.error("Error al crear el carrito:", error);
          throw new Error("Error interno del servidor al crear el carrito");
        }
      }
     
      async removeProductsCart(cartId, productId) {
        try {
          const cart = await Cart.findById(cartId);
    
          if (!cart) {
            throw new Error(`Carrito no encontrado para el ID ${cartId}`);
          }
    
          cart.products = cart.products.filter(
            (product) => !product.productId.equals(productId)
          );
          await cart.save();
    
          return cart;
        } catch (error) {
          throw new Error(
            "Error al eliminar el producto del carrito: " + error.message
          );
        }
      }
    
      async removeAllProducts(cartId) {
        try {
          const cart = await Cart.findById(cartId);
    
          if (!cart) {
            throw new Error(`Carrito no encontrado para el ID ${cartId}`);
          }
    
          cart.products = [];
    
          await cart.save();
    
          return cart;
        } catch (error) {
          throw new Error(
            "Error al eliminar todos los productos del carrito: " + error.message
          );
        }
      }
    
      async updateCart(cartId, update) {
        try {
            return await Cart.findByIdAndUpdate(cartId, update, { new: true }).lean();
        } catch (error) {
            throw new Error("Error al actualizar el carrito: " + error.message);
        }
      }

    }

module.exports = CartMongoDAO;
