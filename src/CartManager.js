import Cart from './models/cart.model.js';

class CartManager {

    // LA FUNCIÓN de crear un carrito nuevo
    async createCart() {
        try {
            const newCart = new Cart();
            await newCart.save();
            return newCart;
        } catch (error) {
            throw new Error("Error al crear el carrito"+error.message );
        }
    }

    // LA FUNCIÓN de obtener carrito por ID
    async getCartById(id) {
        try {
            const cart = await Cart.findById(id).populate("products.product").lean();
            if (cart) {
                cart.total = cart.products.reduce((acc, item) => acc + (item.product.price * item.quantity),0);
            }
            return cart;
        } catch (error) {
            throw new Error("Error al obtener el carrito por ID" +error.message );
        }
    }

    // LA FUNCIÓN de agregar producto al carrito
    async addProductToCart(cid, pid) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) throw new Error("Carrito no encontrado.");

            const productInCart = cart.products.find(p => p.product.equals(pid));

            if (productInCart) {
                productInCart.quantity++;
            } else {
                cart.products.push({ product: pid, quantity: 1 });
            }

            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error al agregar producto al carrito" +error.message );
        }
    }

    // LA FUNCIÓN de eliminar producto del carrito
    async removeProductFromCart(cid, pid) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) throw new Error("Carrito no encontrado.");

            cart.products = cart.products.filter(p => !p.product.equals(pid));

            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error al eliminar producto del carrito" +error.message );
        }
    }

    // LA FUNCIÓN de actualizar carrito
    async updateCart(cid, products) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) throw new Error("Carrito no encontrado.");

            cart.products = products;
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error al actualizar el carrito" +error.message );
        }
    }

    // LA FUNCIÓN de actualizar cantidad de un producto en el carrito
    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) throw new Error("Carrito no encontrado.");

            const productInCart = cart.products.find(p => p.product.equals(pid));

            if (productInCart) {
                productInCart.quantity = quantity;
            } else {
                cart.products.push({ product: pid, quantity });
            }

            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error al actualizar la cantidad del producto"+error.message );
        }
    }

    // LA FUNCIÓN de vaciar el carrito
    async clearCart(cid) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) throw new Error("Carrito no encontrado.");

            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error al vaciar el carrito" +error.message );
        }
    }
}

export default new CartManager();