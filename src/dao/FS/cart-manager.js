const fs = require('fs');

class CartManager {
    constructor(path) {
        this.path = path;
        this.cartIdCounter = 1;
        this.carts = []; 
        this.loadFromFile();
    }

    generateUniqueId() {
        let highestId = 0;
        this.carts.forEach(cart => {
            if (cart.id > highestId) {
                highestId = cart.id;
            }
        });
        return highestId + 1;
    }

    createCart(newCart) {
        this.carts.push(newCart);
        this.saveToFile();
    }


    getAllCarts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.log('Error al cargar productos desde archivo:', error.message);
            return [];
        }
    }

    getCartById(id) {
        const carts = this.getAllCarts();
        const cart = carts.find(cart => cart.id === id);
        if (cart) {
            if (!cart.products) { 
                cart.products = []; 
            }
            return cart;
        } else {
            console.log("Carrito no encontrado.");
            return null;
        }
    }

    saveToFile(productId, cartId) {
        try {
            const carts = this.getAllCarts();
            const cartIndex = carts.findIndex(cart => cart.id === cartId);
            if (cartIndex !== -1) {
                const cart = carts[cartIndex];
    
                const existingProduct = cart.products.find(item => item.product === productId);
                if (existingProduct) {
                    existingProduct.quantity++;
                } else {

                    cart.products.push({
                        product: productId,
                        quantity: 1
                    });
                }
    
                fs.writeFileSync(this.path, JSON.stringify(carts, null, 2));
                console.log('Carritos guardados en archivo.');
            } else {
                console.log('Carrito no encontrado.');
            }
        } catch (error) {
            console.log('Error al guardar carritos en archivo:', error.message);
        }
    }
    
    
      

    loadFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.carts = JSON.parse(data);
            console.log('Carritos cargados desde archivo.');
        } catch (error) {
            console.log('Error al cargar carritos desde archivo:', error.message);
            this.carts = []; 
        }
    }
}

module.exports = CartManager;
