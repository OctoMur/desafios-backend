const ProductManager = require("./productManager")
const fs = require('fs').promises

const productsDbPath = "./src/products.json";
const manager = new ProductManager(productsDbPath)

const express = require("express")
const app = express();
const PORT = 8080;

//muestra todos los productos del archivo en base a un query
app.get("/products", async (req, res) => {
    try {
    const content = await fs.readFile(productsDbPath, 'utf-8');
    
    // Parsea el contenido del archivo a un array
    const products = JSON.parse(content);

    const limit = parseInt(req.query.limit);

        if (!isNaN(limit) && limit > 0) {
            // evalua que el valor de query no sea nulo y que si no lo es sea mayor de 0
            const productos = products.slice(0, limit);
            res.send(productos);
        } else {
            // Si no se proporciona un límite válido, devuelve todos los productos
            res.send(products);
        }
    } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.send("Error interno del servidor");
    }
});

app.get("/products/:id", async (req, res) => {
    try {
    const id = req.params.id;
        
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: "ID de producto no válido" });
        }
    
        // Lee el contenido del archivo de productos
        const content = await fs.readFile(productsDbPath, 'utf-8');
    
        // Parseo el archivo a un array de productos
        const products = JSON.parse(content);
    
        // Busca el producto por ID
        const foundProduct = products.find(product => product.id == id);
    
        if (foundProduct) {
            res.json(foundProduct);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
        } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        res.status(500).json({ error: "Error interno del servidor" });
        }
    });


app.listen(PORT, ()=>{
    console.log(`Server activo: http://localhost:8080/products`);
    console.log(`Server activo: http://localhost:8080/products?limit=5`);
    console.log(`Server activo: http://localhost:8080/products/2`);
})
//con los links de la consola podras hacer los testeos.