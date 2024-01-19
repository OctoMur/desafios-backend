const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/productManager");
const productManager = new ProductManager("./src/models/products.json");


router.get("/home", async (req, res) =>{
    try {
        const products = await productManager.readFile();
        
        res.render("index", {products})
    } catch (error) {
        console.error("Error al leer el archivo: ", error)
    }
})

module.exports = router;