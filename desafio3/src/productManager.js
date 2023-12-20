const fs = require("fs").promises;


class ProductManager{
    static idProduct = 1;

    constructor(productsDbPath){
        this.products = [];
        this.path = productsDbPath;
    }

    async addProduct(newProduct){
        //destructuracion del objeto
        let {title, description, price, img, code, stock} = newProduct;

        //Validaciones
        if(!title || !description || !price || !img || !code || !stock){
            console.log("Hay uno o mas campos vacios")
            return;
        }

        if(this.products.some(item => item.code === code)){
            console.log("Codigo ya registrado, ingrese otro")
            return;
        }

        //sumar el producto al array y pushear a la DB
        this.products.push(newProduct)
        await this.saveFile(this.products)
    }

    getProducts(){
        return console.log(this.products)
    }

    async getProductById(id){
        try {
            const productsImported = await this.readFile();
            const productFinded = productsImported.find(item => item.id === id);

            if(!productFinded){
                console.log("Producto no encontrado");
            }else{
                console.log("Producto encotrado!! (☞ﾟヮﾟ)☞ ", productFinded);
            }
        } 
        catch (error) {
            console.log("error al leer el archivo");
        }
    }

    async readFile(){
        try{
            const res = await fs.readFile(this.path, "utf-8");
            const newArrayObjetcs = JSON.parse(res);
            return newArrayObjetcs;
        }catch (error){
            console.log("error al leer el archivo", error);
        }
    }

    async saveFile(newArrayObjetcs){
        try{
            await fs.writeFile(this.path, JSON.stringify(newArrayObjetcs, null, 2))
        }
        catch (error){
            console.error("error al guardar el archivo", error);
        }
    }

    async updateProduct(id, productUpdated){
        try {
            const arrayProducts = await this.readFile();
            const index = arrayProducts.findIndex(item => item.id === id);

            if(index !== -1){
                arrayProducts.splice(index, 1, productUpdated)
                await this.saveFile(arrayProducts)
            }
            else{
                console.log("producto no encontrado")
            }
        } catch (error) {
            console.log("Error al actualizar el archivo")
        }
    }

    async deleteProduct(id){
        try {
            const arrayProducts = await this.readFile();
            const index = arrayProducts.findIndex(item => item.id === id);

            if(index !== -1){
                const newArrayProducts = arrayProducts.filter(product => product.id !== id)
                await this.saveFile(newArrayProducts)
            }
            else{
                console.log("producto no encontrado")
            }
        } catch (error) {
            console.log("Error al actualizar el archivo")
        }
    }
}

module.exports = ProductManager;

//el siguiente codigo fue el que hice para generar el archivo db.json

/*const manager = new ProductManager("./products.json")
for(i = 1 ; i<11; i++){
    const newProduct={
        id: ProductManager.idProduct++,
        title: `producto ${i}`,
        description: "Este es un producto prueba",
        price: i * 100,
        img: "Sin imagen",
        code: `abc10${i}`,
        stock: i*5
    }

    manager.addProduct(newProduct)
}*/
