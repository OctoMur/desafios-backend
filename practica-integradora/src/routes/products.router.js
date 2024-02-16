const express = require("express");
const router = express.Router();

const ProductManager = require("../dao/db/productManagerDb")
const productManager = new ProductManager()

// const productsModel = require("../models/products.model");

router.get("/products", async (req, res) => {
    try {
    const limit = parseInt(req.query.limit);

    const products = await productManager.getProducts();
    
        if (!isNaN(limit) && limit > 0) {
            const productsListLimited = products.slice(0, limit);
            res.send(productsListLimited);
        } else {
            res.send(products);
        }
    } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.send("Error interno del servidor");
    }
});

router.get("/products/:pid", async (req, res) => {
    try {
        const id = req.params.pid;

        // Busca el producto por ID
        const foundProduct = await productManager.getProductById(id);
    
        if (foundProduct) {
            res.json(foundProduct);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }

        } catch (error) {
        // console.error("Error al procesar la solicitud:", error);
        res.status(500).json({ error: "Error interno del servidor" });
        }
});

router.post("/products", (req, res) =>{
    const newProduct = req.body;

    productManager.addProduct(newProduct);

    res.send({status:"sucess", message: "producto creado"})
})

router.put("/products/:pid", (req, res) =>{
    const {pid} = req.params;
    const productUpdated = req.body;
    console.log(pid)
    productManager.updateProduct(pid, productUpdated)
    res.send({status:"sucess", message: "producto actualizado"})
})

router.delete("/products/:pid", (req, res) =>{
    const {pid} = req.params;

    productManager.deleteProduct(pid);
    res.send({status: "success", message: "Producto eliminado"});
})

module.exports = router;