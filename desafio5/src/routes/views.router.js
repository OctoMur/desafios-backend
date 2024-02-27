const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/productManager");
const productManager = new ProductManager("./src/models/products.json");


router.get("/", async (req, res) =>{
    try {
        const products = await productManager.readFile();
        
        res.render("index", {products});
    } catch (error) {
        console.error("Error al leer el archivo: ", error);
    }
})

router.get("/realtimeproducts", (req, res) => {
    try {
        res.render("realTimeProducts");
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        })
    }
})

module.exports = router;