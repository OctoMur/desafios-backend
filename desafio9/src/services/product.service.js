const {ProductModel, ProductModelMock} = require("../models/product.model");
const logger = require("../utils/logger");

class ProductService{
    async addProduct(newProduct){
        let {title, description, code, price, stock, category, isMock = false} = newProduct;

        if(isMock){
            const product= new ProductModelMock({
                title: title,
                description: description,
                code: code,
                price: price,
                status: true,
                stock: stock,
                category: category,
                thumbnails: []
            })
            await product.save();
        } else {
            const product = new ProductModel({
                title: title,
                description: description,
                code: code,
                price: price,
                status: true,
                stock: stock,
                category: category,
                thumbnails: []
            })
            await product.save();
        }
        return true;
    }

    async getProducts({limit, page , sort, query} = {}){
        try {

            const skip = (page - 1) * limit;
            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const productos = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: productos,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };

        } catch (error) {
            logger.error("Error al obtener los productos. (product.service L77)", error);
        }
    }

    async getProductById(id){
        try {
            const productFinded = await ProductModel.findById(id);

            if(!productFinded){
                logger.error("Producto no encontrado. (product.service L87)");
            }else{
                logger.info("Producto encotrado", productFinded);
                return productFinded;
            }
        } 
        catch (error) {
            logger.error("Error al buscar el producto por id");
        }
    }

    async updateProduct(id, dataUpdate){
        try {
            const productUpdated = await ProductModel.findByIdAndUpdate(id, dataUpdate);

            if(!productUpdated){
                logger.error("Producto no encontrado. (product.service L102)");
                return null;
            }

            logger.info("Producto actualizado.")
            return productUpdated;

        } catch (error) {
            logger.error("Error al actualizar el archivo. (product.service L111)", error)
        }
    }

    async deleteProduct(id){
        try {
            
            const productDelete = await ProductModel.findByIdAndDelete(id);

            if(!productDelete){
                logger.error("Producto no encontrado. (product.service L121)");
                return false;
            }

            logger.info("Producto eliminado.");
            return true;
        } catch (error) {
            console.log("Error al acceder a la base de datos.")
        }
    }

}

module.exports = ProductService;