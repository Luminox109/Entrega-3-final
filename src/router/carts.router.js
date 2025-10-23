import { Router } from "express";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

const router = Router();

// endpoint para crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const cart = new Cart();
        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// endpoint para obtener un carrito específico por su ID
router.get("/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// endpoint para agregar un producto a un carrito
router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        const product = await Product.findById(req.params.pid);
        if (!cart || !product) {
            return res.status(404).json({ error: "Carrito o producto no encontrado" });
        }
        const productInCart = cart.products.find(p => p.product.equals(product._id));
        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.products.push({ product: product._id, quantity: 1 });
        }

        // guardamos los cambios en el carrito.
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });     
    }
});

// endpoint para reemplazar todo los productos de un carrito con un nuevo listado
router.put("/:cid", async (req, res) => {
    const { products } = req.body;
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: "Cart Not Found" });
        }
        cart.products = products;
        await cart.save();
        res.json({ status: "success", payload:cart});
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// endpoint para actualizar la cantidad de un producto en un carrito
router.put("/:cid/products/:pid", async (req, res) => {
        const { quantity } = req.body;
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: "Cart Not Found" });
        }
        
        const productInCart =cart.products.find(p => p.product.equals(req.params.pid));
        if (productInCart) {
            productInCart.quantity = quantity;
        } else {
           const product = await Product.findById(req.params.pid);
           if (!product) {
            return res.status(404).json({ error: "Product Not Found" });
           }
           cart.products.push({ product: product._id, quantity });
        }
        await cart.save();
        res.json({ status: "success", payload:cart});
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// endpoint para eliminar todos los productos de un carrito
router.delete("/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: "Cart Not Found" });
        }
        cart.products = [];
        await cart.save();
        res.json({ status: "success", payload:cart});
    } catch (error) {
            res.status(500).json({ status: "error", message: error.message });        
    }
});

// endpoint para eliminar un producto de un carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: "Cart Not Found" });
        }
        cart.products = cart.products.filter(p => !p.product.equals(req.params.pid));
        await cart.save();
        res.json({ status: "success", payload:cart});
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
});


export default router;