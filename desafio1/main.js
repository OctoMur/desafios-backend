class ProductManager{
    static idProduct = 1

    constructor(){
        this.products = []
    }

    addProduct(title, description, price, img, code, stock){

        if(!title || !description || !price || !img || !code || !stock){
            console.log("Hay uno o mas campos vacios")
            return;
        }

        if(this.products.some(item => item.code === code)){
            console.log("Codigo ya registrado, ingrese otro")
            return;
        }

        const newProduct = {
            id: "000" + ProductManager.idProduct,
            title,
            description,
            price,
            img,
            code,
            stock
        }

        this.products.push(newProduct)
        ProductManager.idProduct++
    }

    getProducts(){
        return console.log(this.products)
    }

    getProductById(id){
        const productFinded = this.products.find(item => item.id === id)

        if(!productFinded){
            console.log("Producto no encontrado ¯\_(ツ)_/¯")
        }else{
            console.log("Producto encotrado!! (☞ﾟヮﾟ)☞: ", productFinded)
        }
        return
    }
}


//TESTEO
const manager = new ProductManager()

manager.getProducts()

manager.addProduct("producto de prueba", "osea digamos, es un producto de prueba", 935, "sinImagen", 159753, 7)
manager.addProduct("producto de prueba", "osea digamos, es un producto de prueba", 935, "sinImagen", 159753, 7) ///esto es para que retorne el mensaje de que ya se ingreso un producto con ese codigo
console.log("/////////////////////////////////////////////////////////////")
manager.getProducts()
console.log("/////////////////////////////////////////////////////////////")
manager.getProductById("0001")