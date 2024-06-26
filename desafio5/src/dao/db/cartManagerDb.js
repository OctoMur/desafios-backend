const CartModel = require("../models/carts.model");

const ProductManagerDb = require("../db/productManagerDb");
const productManagerDb = new ProductManagerDb();

class CartManager{
    async createCart(){
        try {
            const newCart = new CartModel({products: []});
            await newCart.save();
            
            return newCart;
        } catch (error) {
            console.log("Error al crear el nuevo carrito.");
        }
    }

    async getCartById(cid){
        try {
            const cart = await CartModel.findById(cid);

            if(!cart){
                console.log("El carrito no existe.");
                return null;
            }
            return cart;
        } catch (error) {
            console.error("Error al solicitar el carrito.", error)
        }
    }

    async addProductToCart(cid, productId, quantity){
        try {
            const product = await productManagerDb.getProductById(productId);
            if(!product){
                console.log("Producto no existente.");
                return;
            }

            const cart = await this.getCartById(cid);

            const existProduct = cart.products.find(item => item.product.id == productId);

            if(existProduct){
                existProduct.quantity += quantity;
            }else{
                
                cart.products.push({product: productId, quantity});
            }

            //marca la ultima propiedad modificada que se genero antes de guardar.
            cart.markModified("products");

            await cart.save();
            return cart;

        } catch (error) {
            console.error("Error al agregar el product al carrito.", error);
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
            console.error('Error al actualizar el carrito en el gestor', error);
            throw error;
        }
    }

    async updtProductQ(cid, pid, q){
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

module.exports = CartManager;