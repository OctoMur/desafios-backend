const express = require("express");
const router = express.Router();

const ProductManager = require("../dao/db/productManagerDb");
const productManager = new ProductManager();
const CartManager = require("../dao/db/cartManagerDb");
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 2 } = req.query;
        const products = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit)
        });

        const newArray = products.docs.map(product => {
            const { _id, ...rest } = product.toObject();
            return rest;
        });

        res.render("products", {
            products: newArray,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages
        });

    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }
});

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartManager.getCartById(cartId);

        if (!cart) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const productCart = cart.products.map(item => ({
            product: item.product.toObject(),
            quantity: item.quantity
        }));


        res.render("carts", { products: productCart });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;