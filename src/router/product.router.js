import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();

// endpoint para obtener productos con paginación, filtrado y ordenamiento
router.get("/", async (req, res) => {
    const { limit = 9, page = 1, sort, query } = req.query;
    try {
        const filter = {};
        if (query) { 
            if (query.includes(":")) {
                const [key,value] = query.split(":");
                const isboolean = value.toLowerCase() === "true" || value.toLowerCase() === "false";
                filter[key] = isboolean ? value.toLowerCase() === "true" : value;
            } else {
                filter.Categories = query;
            }
         }
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === "asc" ? 1 : -1} : {}
        };

        const products = await ProductManager.getProducts({ filter, options });
        const response = {
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` : null,
            nextLink: products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` : null,
        };
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: message });
    }
});

router.post("/", async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = await ProductManager.addProduct(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: message });
    }
});

export default router;