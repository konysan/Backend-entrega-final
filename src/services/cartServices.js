const CartMongoDAO = require ("../dao/cartMongoDAO")

class CartService {
    constructor(dao) {
        this.cartDAO=dao
    }

    async createCartClean() {
        return await this.cartDAO.create()
    }
    async getCartWithProducts(filtro = {}) {
        try {
            return await this.cartDAO.findCart(filtro, "products.productId");
        } catch (error) {
            throw new Error("Error al obtener el carrito con productos: " + error.message);
        }
    }
}

const cartServices =  new CartService(new CartMongoDAO())

module.exports = cartServices