import { Router } from "express";
import ProductManager from "../ProductManager.js";
import CartManager from "../CartManager.js";

const router = Router();

// endpoint para la vista de inicio
router.get("/", async (req, res) => {
    res.render("home");
});
    
// endpoint para la vista de productos con paginación, filtrado y ordenamiento
router.get("/products", async (req, res) => {
    const { limit = 9, page = 1, sort, query } = req.query;
    try {
        const filter = {};
        if (query) {
            if (query.includes(":")) {
                const [key, value] = query.split(":");
                const isboolean = value.toLowerCase() === "true" || value.toLowerCase() === "false";
                filter[key] = isboolean ? value.toLowerCase() === "true" : value;
            } else {
                filter.category = query;
            }
        }
        // Configurar opciones de paginación
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === "asc" ? 1 : -1} : {},
            lean: true
        };
        // Obtener productos y categorías distintas
        const products = await ProductManager.getProducts({ filter, options });
        const Categories = await ProductManager.getDistinctCategories();

        // Renderizar la vista con los datos obtenidos
        res.render("index", {
            products: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` : null,
            nextLink: products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` : null,
            Categories: Categories,
            currentQuery: query
        });

    } catch (error) {
        res.status(500).render("error", { error: error.message });        
    }
});

// endpoint para la vista de detalle de producto
router.get("/products/:pid", async (req, res) => {
    try {
        const product = await ProductManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).render("error", { error: "Producto no encontrado" });
        }
        res.render("product", { product });
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});

// endpoint para la vista de carrito
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await CartManager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).render('error', { message: 'Carrito no encontrado' });
            }
        res.render("cart", { cart });
    } catch (error) {
        res.status(500).render('error', { message: `Error al cargar la vista del carrito: ${error.message}` });
    }
});


export default router;