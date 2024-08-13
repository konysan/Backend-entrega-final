const productModels = require('./models/productModels.js');
const mongoose = require("mongoose");

class ProductMongoDAO {
    constructor() {
        
    }

    async addProduct(product) {
        return await productModels.create(product);
    }

    async getAllProducts({ filter = {}, options = {} } = {}) {
        return await productModels.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: "$category",
                    products: { $push: "$$ROOT" }
                }
            }
        ])
        .skip((options.page - 1) * options.limit)
        .limit(options.limit);
    }

    async getProductById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(`Invalid ID format: ${id}`);
        }
        return await productModels.findById(id).lean();
    }
    
    async updateProduct(id, modificacion) {
        try {
            return await productModels.findByIdAndUpdate(id, modificacion, { new: true }).lean();
        } catch (error) {
            throw new Error("Error al actualizar el producto: " + error.message);
        }
    }
    
    
    async deleteProductById(id) {
       return await productModels.findByIdAndDelete(id);
    }


    
}


module.exports = ProductMongoDAO;
