const productModels = require('./models/productModels.js');

class ProductMongoDAO {
    constructor() {
        
    }


    async addProduct(product) {
        return await productModels.create(product);
    }

    async getAllProducts() {
        return await productModels.aggregate(
            [
                {
                    $group:{
                        _id: "$category"
                    }
                }
            ]
        )
    }

    async getProductById(id) {
        return await productModels.findById(id).lean();
    }
    
    async updateProduct(id, modificacion) {
        try {
            return await productModels.findByIdAndUpdate(id, modificacion, { new: true });
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }
    

    async deleteProductById(id) {
       return await productModels.findByIdAndDelete(id);
    }


    
}


module.exports = ProductMongoDAO;
