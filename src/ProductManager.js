import Product from "./models/product.model.js";

class ProductManager {

    // LA FUNCIÓN de obtener productos
    async getProducts({ filter, options }) {
        try {
            const products = await Product.paginate(filter, options);
            return products;
        } catch (error) {
            throw new Error("Error al obtener los producto"+error.message);
        }
    }

    // LA FUNCIÓN de añadir un nuevo producto
    async addProduct(productData) {
        try {
            const newProduct = new Product(productData);
            await newProduct.save();
            return newProduct;
        } catch (error) {
           throw new Error("Error al añadir un nuevo producto"+error.message);
        }
    }

    // LA FUNCIÓN de obtener producto por ID
    async getProductById(id) {
        try {
            // Usé lean() para obtener un objeto JS simple y mejorar el rendimiento.
            const product = await Product.findById(id).lean();
            return product;
        } catch (error) {
            throw new Error("Error al obtener el producto por ID"+error.message);
        }
    }

    // LA FUNCIÓN de actualizar producto
    async updateProduct(id, updates) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true }).lean();
            return updatedProduct;
        } catch (error) {
            throw new Error("Error al actualizar el producto"+error.message);
        }
    }

    // LA FUNCIÓN de eliminar producto
    async deleteProduct(id) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            return deletedProduct;
        } catch (error) {
            throw new Error("Error al eliminar el producto"+error.message);
        }
    }

    // LA FUNCIÓN de obtener categorías distintas
    async getDistinctCategories() {
        try {
            const categories = await Product.distinct('category');
            return categories;
        } catch (error) {
            throw new Error("Error al obtener las cartegoías"+error.message);
        }
    }
}
export default new ProductManager();