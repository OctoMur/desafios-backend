const express = require("express");
const router = express.Router();

const CartManager = require("../dao/db/cartManagerDb");
const cartManager = new CartManager();

router.post("/carts", async (req, res) =>{
    try {
        await cartManager.loadCarts();
        const newCart = await cartManager.createNewCart();
        res.json(newCart);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
})

router.get("/carts/:cid", async (req, res)=>{
    const {cid} = req.params;

    try {
        const cart = await cartManager.searchCart(cid);
        res.json(cart.products);
    } catch (error) {
        console.error("Error al buscar carrito", error);
        res.status(500).json({error: "Error interno del servidor."});
    }
})

router.post("/carts/:cid/product/:pid", async (req, res) => {
    const {cid} = req.params;
    const {pid} = req.params;
    const quantity = req.body.quantity || 1;
    try {
        const cartUpdate = await cartManager.addProductToCart(cid, pid, quantity);
        res.json(cartUpdate.products);
    } catch (error) {
        console.error("Error al agregar el producto.", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
})

module.exports = router;