const fs = require("fs").promises;

class CartManager{
    static idCart = 0;


    constructor(cartsDbPath){
        this.carts = [];
        this.path = cartsDbPath;
    }

    async loadCarts(){
        try {
            const data = await fs.readFile(this.path, "utf-8");

            if(data.length > 0){
                this.carts = JSON.parse(data);
                CartManager.idCart = Math.max(...this.carts.map(cart=> cart.id))
            }else{
                console.log("No hay carritos registrados.");
            }
        } catch (error) {
            console.error("Error al cargar el archivo:", error);
            await this.saveCarts();
        }
    }

    async saveCarts(){
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async createNewCart(){
        const cart = {
            id: ++CartManager.idCart,
            products : []
        }

        this.carts.push(cart);

        await this.saveCarts();
    }

    async searchCart(id){
        try {
            await this.loadCarts();
            const cartFinded = this.carts.find(cart => cart.id == id);

            if(!cartFinded){
                throw new Error(`Carrito ${id}, no registrado.`);
            }

            return cartFinded;
        } catch (error) {
            console.error("Error al buscar carrito: ", error);
        }
    }

    async addProductToCart(cId, pId, quantity){
        const cart = await this.searchCart(cId);
        const productFinded = cart.products.find(prod => prod.product == pId )

        if(productFinded){
            productFinded.quantity += quantity;
        } else {
            cart.products.push({product: pId, quantity});
        }

        await this.saveCarts();
        return cart;
    }
}

module.exports = CartManager;