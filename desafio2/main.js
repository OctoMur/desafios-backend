const fs = require("fs").promises;
const productsDbPath = "./db.json";

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

/*-----TESTING-----*/
//1)Crear instancia de product manager

const manager = new ProductManager(productsDbPath);

//2)Leer la instancia recien creada de la lista de productos (DB)

manager.getProducts();

//3)Creacion de un producto y añadirlo a la lista de productos

    //creacion del producto
const productPrueba1 = {
    id: "000" + ProductManager.idProduct++,
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    img: "Sin imagen",
    code: "abc123",
    stock: 25
}
const productPrueba2 ={
    id: "000" + ProductManager.idProduct++,
    title: "producto prueba 2",
    description: "Este es el segundo producto de prueba",
    price: 400,
    img: "Sin imagen",
    code: "abc124",
    stock: 30
}

    //agregado del producto al archivo
manager.addProduct(productPrueba1)
manager.addProduct(productPrueba2)

//4)Leer db.json para ver el producto recien agregado

manager.getProducts()

//5)Buscar un producto especifico en base a su ID o devolver un mensaje de error en caso de no encontrarlo

manager.getProductById("0002")

//6)Actualizar la lista de productos

const productoActualizado = {
    id: "0001",
    title: "producto actualizado",
    description: "Este es un producto prueba actualizado",
    price: 500,
    img: "Sin imagen",
    code: "abc123",
    stock: 10
}
//manager.updateProduct("0001", productoActualizado) /*descomentar esta linea de codigo para que actualice el producto */

//7)Eliminar un producto
//manager.deleteProduct("0001") /*descomentar esta linea de codigo para que actualice el producto */

