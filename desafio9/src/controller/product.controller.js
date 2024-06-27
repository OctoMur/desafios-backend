const ProductService = require("../services/product.service");
const productService = new ProductService();

const {ProductModel} = require("../models/product.model");

const mockingGenerator = require("../utils/utilMock");

const response = require("../utils/reusable");
const logger = require("../utils/logger");

class ProductController{
    async getProducts(req, res){
        try {
            const {limit, page , sort, query} = req.query;
        
            const products = await productService.getProducts({
                limit: parseInt(limit),
                page: parseInt(page),
                sort,
                query,
            });
            
            response(res, 200, products);

            } catch (error) {
            logger.error("Error al procesar la solicitud. (product.controller L26 ", error);
            response(res, 500, {message: "Error al procesar la solicitud:"});
            }
    }

    async getProductData(req, res){
        try {
            const id = req.params.pid;
    
            // Busca el producto por ID
            const foundProduct = await productService.getProductById(id);
        
            if (foundProduct) {
                response(res, 200, foundProduct);
            } else {
                logger.warning("Producto no encontrado. (product.controller L41)");
                response(res, 404, { message: "Producto no encontrado" });
            }
    
            } catch (error) {
                logger.error("Error en la peticion de datos. (product.controller L45)");
                response(res, 500, { message: "Error en el servidor" });
            }
    }

    async postProduct(req, res){
        const newProduct = req.body;
        const { title, description, price, code, stock, category } = newProduct;
    
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                logger.error("campos de datos incompletos. (product.controller L57)")
                response(res, 404, { message: "Todos los campos son obligatorios" });
                return
            }
        
            const product = await ProductModel.findOne({ code: code });
        
            if(product) {
                logger.warning("Codigo de producto ya registrado. (product.controller L64");
                response(res, 400, {message: "El código ingresado ya existe, por favor ingrese otro"});
            } else {
                await productService.addProduct(newProduct);
                response(res, 200, {message: "Producto agregado exitosamente"});
            }
        } catch (error) {
            logger.error("Error al crear el producto en el servidor. (product.controller L72");
            response(res, 500, {message: "Error interno del servidor"});
        }
    }

    async updateProduct(req, res){
        const {pid} = req.params;
        const productUpdated = req.body;
    
        try {
            const updated = await productService.updateProduct(pid, productUpdated);
        
            if(updated){
                response(res, 200, {message: "producto actualizado"});
            }else{
                logger.warning("Producto no encontrado. (product.logger L87)");
                response(res, 404, {message: "El producto que desea actualizar no existe"});
            }
            
        } catch (error) {
            response(res, 500, {message: "Error interno del servidor"});
        }
    }

    async deleteProduct(req, res){
        const {pid} = req.params;

        try {
            const deleted = await productService.deleteProduct(pid);
        
            if(deleted){
                response(res, 200, {message: "Producto eliminado"});
            }else{
                logger.warning("el producto no se pudo eliminar, ID desconocido. (product.controller L105)");
                response(res, 404, {message: "el producto no se elimino, ID no encontrada"});
            }
        } catch (error) {
            logger.error("Error al eliminar el producto. (product.controller L109");
            response(res, 500, {message: "Error interno del servidor"});
        }
    }

    async postProductMock(req, res){
        for(let i = 0; i < 100; i++){
            const newProduct = mockingGenerator.productGenerate(i)
            await productService.addProduct(newProduct);
        }

        response(res, 200, {message: "Productos generados exitosamente"});
    }
}

module.exports = ProductController;