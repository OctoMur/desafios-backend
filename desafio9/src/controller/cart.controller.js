const CartService = require("../services/cart.service");
const cartService = new CartService();
const ProductService = require("../services/product.service");
const productService = new ProductService();
const UserModel = require("../models/user.model.js");

const TicketModel = require("../models/ticket.model");

const response = require("../utils/reusable");
const logger = require("../utils/logger.js");

const { generateUniqueCode, calculateTotal } = require("../utils/cartutils.js");
class CartController {

    async postCart(req, res) {
        try {
            await cartService.createCart();

            logger.info("carrito creado con exito. (cart.controller. L19)");
            response(res, 200, { message: "Carrito creado exitosamente." });
        } catch (error) {
            logger.error("Error al crear un nuevo carrito. (cart.controller L22)" + error);
            response(res, 500, { error: "Error interno del servidor" });
        }
    }

    async getCart(req, res){
        const {cid} = req.params;

        try {
            const cart = await cartService.getCart(cid);
            logger.info(cart);
            if (!cart) {
                logger.warning("Carrito no encontrado. (cart.controller L34) ");
                response(res, 404, { message: "Carrito no encotrado" });
                return null;
            }
            
            res.render("carts");
        } catch (error) {
            logger.error("Error en el servidor. (cart.controller L41)");
            response(res, 500, { error: "Error interno del servidor." });
        }
    }

    async addProductToCart(req, res){
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            await cartService.addProductToCart(cartId, productId, quantity);
            const myCart = (req.user.cart).toString();
            logger.info("Producto agregado correctamente")
            res.redirect(`/carts/${myCart}`)
        } catch (error) {
            logger.error("Error al agregar el producto. (cart.controller L56)", error);
            response(res, 500, {message: "Error interno del servidor"});
        }
    }

    async removeProductInCart(req, res){
        try {
            const {cid, pid} = req.params;
            const userCart = req.user.cart;
            console.log(userCart);
            const updatedCart = await cartService.deleteProduct(userCart, pid);
            
            logger.info("Producto eliminado del carrito")
            res.render("carts");
        } catch (error) {
            logger.error('Error al eliminar el producto del carrito. (cart.controller L71)', error);
            res.status(404).json({
                status: 'error',
                error: 'Error interno del servidor',
            });
        }
    }

    async updateCart(req, res){
        const {cid} = req.params;
        const updatedProducts = req.body;
    
        try {
            const updatedCart = await cartService.updateCart(cid, updatedProducts);
            logger.info("Carrito actualizado");
            response(res, 200, updatedCart);
        } catch (error) {
            logger.error("Error en el servidor (cart.controller L88) " + error);
            response(res, 500, {message: "Error interno del servidor"});
        }
    }

    async updateProductInCart(req, res){
        try {
            const {cid, pid} = req.params;
            const {quantity} = req.body;
    
            const updtProduct = await cartService.updateProductQuantity(cid, pid, quantity);
            logger.info("Producto actualizado en carrito correctamente.")
            response(res, 200, updtProduct);
        } catch (error) {
            logger.info("Error en el servidor. (cart.controller L102)");
            response(res, 500, {message: "Error interno del servidor"});
        }
    }

    async emptyCart(req, res){
        try {
            const {cid} = req.params;
            
            const updatedCart = await cartService.emptyCart(cid);
            logger.info("Carrito vaciado correctamente");
            res.render("carts", {updatedCart, cid});
        } catch (error) {
            logger.error("Error en el servidor. cart.controller L115 " + error);
            response(res, 500, {message: "Error interno del servidor"});
        }
    }

    async finalizePurchase(req, res) {
        const cartId = req.params.cid;
        console.log(cartId)
        try {
            const cart = await cartService.getCart(cartId);
            const products = cart.products;

            const notInStock = [];

            for (const item of products) {
                const productId = item.product;
                const product = await productService.getProductById(productId);
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    notInStock.push(productId);
                }
            }

            const userWithCart = await UserModel.findOne({ cart: cartId });

            // Crear un ticket con los datos de la compra
            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calculateTotal(cart.products),
                purchaser: userWithCart._id
            });
            await ticket.save();

            // Eliminar del carrito los productos que sí se compraron
            cart.products = cart.products.filter(item => notInStock.some(productId => productId.equals(item.product)));

            // Guardar el carrito actualizado en la base de datos
            await cart.save();
            logger.info("Compra finalizada.")
            res.status(200).json({ notInStock });
        } catch (error) {
            logger.error('Error al procesar la compra. (cart.controller L159)', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

module.exports = CartController;