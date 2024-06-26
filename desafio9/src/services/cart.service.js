const CartModel = require("../models/carts.model");

const ProductService = require("./product.service");
const productService = new ProductService();

const logger = require("../utils/logger");

class CartService{

    async createCart(){
        try {
            const newCart = new CartModel({products: []});
            await newCart.save();
            logger.info("Carrito creado con exito. (cart.service L14)")
            return newCart;
        } catch (error) {
            logger.error("Error al crear el nuevo carrito desde service");
        }
    }

    async getCart(cid){
        logger.info(cid);
        try {
            const cart = await CartModel.findById(cid);

            if(!cart){
                logger.log("El carrito no existe.");
                return null;
            }
            return cart;
        } catch (error) {
            //logger.error("Error al solicitar el carrito. ", error); //<=esto me tira un error raro
            logger.error({message: "Error al solicitar el carrito. ", error: error.message}); //esto y la linea de abajo fue recomendacion de GPT
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity){
        try {
            const cart = await this.getCart(cartId);
            const existProduct = cart.products.find(item => item.product._id.toString() === productId);

            if (existProduct) {
                existProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            //Vamos a marcar la propiedad "products" como modificada antes de guardar: 
            cart.markModified("products");

            await cart.save();
            return cart;
        } catch (error) {
            logger.error("Error al agregar el product al carrito.", error);
        }
    }

    async deleteProduct(cid, pid){
        try {
            const cart = await CartModel.findById(cid);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const exist = cart.products.some(item => item.product.id === pid);

            if(!exist){
                throw new Error("Producto no encontrado en el carrito.");;
            }

            cart.products = cart.products.filter(item => item.product._id.toString() !== pid);
            await cart.save();
            return cart;

        } catch (error) {
            throw error;
        }
    }

    async updateCart(cid, updatedProducts) {
        try {
            const cart = await CartModel.findById(cid);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = updatedProducts;

            cart.markModified('products');

            await cart.save();

            return cart;
        } catch (error) {
            logger.error('Error al actualizar el carrito en el gestor', error);
            throw error;
        }
    }

    async updateProductQuantity(cid, pid, q){
        try {
            const cart = await CartModel.findById(cid);

            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            const foundedIndx = cart.products.findIndex(item => item.product._id == pid);

            if(foundedIndx !== -1){
                cart.products[foundedIndx].quantity = q;

                cart.markModified('products');

                await cart.save();
                return cart;
            } else{
                throw new Error("Producto no encontrado en el carrito.");
            }

        } catch (error) {
            throw error;
        }
    }

    async emptyCart(cid){
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cid,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return cart;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CartService;