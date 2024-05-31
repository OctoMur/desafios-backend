const express = require("express");
const router = express.Router();

const CartManager = require("../dao/db/cartManagerDb");
const cartManager = new CartManager();

const ProductModel = require("../dao/models/product.model");
const CartModel = require("../dao/models/carts.model");

router.post("/", async (req, res) =>{
    try {
        await cartManager.createCart();
        res.json({message: "Carrito creado exitosamente."});
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
})

router.get("/:cid", async (req, res)=>{
    const {cid} = req.params;

    try {

        const cart = await cartManager.getCartById(cid);

        if(!cart){
            res.status(404).json({message: "Carrito no encotrado"});
            return null;
        }
        res.json(cart.products);
    } catch (error) {
        console.error("Error al buscar carrito", error);
        res.status(500).json({error: "Error interno del servidor."});
    }
})


router.post("/:cid/products/:pid", async (req, res) => {
    const {cid} = req.params;
    const {pid} = req.params;
    const quantity = req.body.quantity || 1;

    try {
        const cart = await CartModel.findOne({ _id: cid });
        const product = await ProductModel.findOne({ _id: pid });

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const cartUpdate = await cartManager.addProductToCart(cid, pid, quantity);
        res.json(cartUpdate.products);

    } catch (error) {
        console.error("Error al agregar el producto.", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
})


router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const {cid, pid} = req.params;

        const updatedCart = await cartManager.deleteProduct(cid, pid);

        res.json({
            status: 'success',
            message: 'Producto eliminado del carrito correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito', error);
        res.status(404).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
})

router.put("/:cid", async (req, res) => {
    const {cid} = req.params;
    const updatedProducts = req.body;
    
    try {

        const updatedCart = await cartManager.updateCart(cid, updatedProducts);
        res.json(updatedCart);

    } catch (error) {
        console.error('Error al actualizar el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const {cid, pid} = req.params;
        const {quantity} = req.body;

        const updtProduct = await cartManager.updtProductQ(cid, pid, quantity);

        res.json({
            status: 'success',
            message: 'Cantidad del producto actualizada correctamente',
            updtProduct,
        });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor'
        })
    }
})

router.delete("/:cid", async (req, res) => {
    try {
        const {cid} = req.params;
        
        const updatedCart = await cartManager.emptyCart(cid);

        res.json({
            status: 'success',
            message: 'Todos los productos del carrito fueron eliminados correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al vaciar el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
})
module.exports = router;