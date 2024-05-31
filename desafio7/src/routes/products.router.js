const express = require("express");
const router = express.Router();

const ProductManager = require("../dao/db/productManagerDb");
const productManager = new ProductManager();

const ProductModel = require("../dao/models/product.model");

router.get("/", async (req, res) => {
    try {
    const {limit, page , sort, query} = req.query;

    const products = await productManager.getProducts({
        limit: parseInt(limit),
        page: parseInt(page),
        sort,
        query,
    });

    res.json({
        status: 'success',
        payload: products,

        })
    } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.send("Error interno del servidor");
    }
});

router.get("/:pid", async (req, res) => {
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


router.post("/", async (req, res) =>{
    const newProduct = req.body;
    const { title, description, price, code, stock, category } = newProduct;

    try {
        if (!title || !description || !price || !code || !stock || !category) {

            res.status(404).send({
            message: "Todos los campos son obligatorios",
                });
            return
            }
    
        const product = await ProductModel.findOne({ code: code });
    
        if(product) {
            res.status(400).send({
            message: "El código ingresado ya existe, por favor ingrese otro",
            });
        } else {
            await productManager.addProduct(newProduct);
            res.status(201).json({
            message: "Producto agregado exitosamente",
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
})

router.put("/:pid", async (req, res) =>{
    const {pid} = req.params;
    const productUpdated = req.body;

    try {
        console.log(pid);

        const updated = await productManager.updateProduct(pid, productUpdated);
    
        if(updated){
            res.send({status:"sucess", message: "producto actualizado"});
        }else{
            res.status(404).send({message: "El producto que desea actualizar no existe"});
        }
        
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
})

router.delete("/:pid", async (req, res) =>{
    const {pid} = req.params;

    try {
        const deleted = await productManager.deleteProduct(pid);
    
        if(deleted){
            res.send({status: "success", message: "Producto eliminado"});
        }else{
            res.status(404).send({message: "el producto no se elimino, ID no encontrada"});
        }
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
    
})

module.exports = router;