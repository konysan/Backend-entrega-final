class ProductService {
    constructor(dao) {
        this.productsDAO=dao
    }

    async getAllProducts() {
        return await this.productsDAO.getAllProducts()
    }
}