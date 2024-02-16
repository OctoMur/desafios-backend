const ProductModel = require("../models/products.model");

class ProductManagerDb{

    async addProduct(newProduct){
        //destructuracion del objeto
        let {title, description, code, price, status, stock, category, thumbnails} = newProduct;

        //Validaciones
        if(!title || !description || !code || !price || !status || !stock || !category || !thumbnails){
            console.log("Hay uno o mas campos vacios")
            return;
        }

        const existingProduct = await ProductModel.findOne({code:code});

        if(existingProduct){
            console.log("Codigo ya registrado")
            return;
        }

        const product= new ProductModel({
            title: title,
            description: description,
            code: code,
            price: price,
            status: status,
            stock: stock,
            category: category,
            thumbnails: thumbnails
        })
        await product.save();
    }

    async getProducts(){
        try {
            const products =  await ProductModel.find();
            return products;
        } catch (error) {
            console.error("Error al obtener los productos", error);
        }
    }

    async getProductById(id){
        try {
            const productFinded = await ProductModel.findById(id);

            if(!productFinded){
                console.log("Producto no encontrado");
            }else{
                console.log("Producto encotrado", productFinded);
                return productFinded;
            }
        } 
        catch (error) {
            console.log("Error al buscar el producto por id");
        }
    }

    async updateProduct(id, dataUpdate){
        try {
            const productUpdated = await ProductModel.findByIdAndUpdate(id, dataUpdate);

            if(!productUpdated){
                console.log("Producto no encontrado");
                return null;
            }

            console.log("Producto actualizado.")
            return productUpdated;

        } catch (error) {
            console.log("Error al actualizar el archivo", error)
        }
    }

    async deleteProduct(id){
        try {
            
            const productDelete = await ProductModel.findByIdAndDelete(id);

            if(!productDelete){
                console.log("Producto para eliminar, no encontrado.");
                return null;
            }

            console.log("Producto eliminado.")
        } catch (error) {
            console.log("Error al acceder a la base de datos.")
        }
    }
}

module.exports = ProductManagerDb;