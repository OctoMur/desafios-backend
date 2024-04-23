// const ProductManager = require("./dao/fs/productManager")
// const productManager = new ProductManager("./src/models/products.json")

const express = require("express");
const app = express();
const PORT = 8080;
const expressHbs = require("express-handlebars");
require("./database");

//Routers
const productsRouter = require("./routes/products.router");
const cartRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/",viewsRouter)

//Handlebars
app.engine("handlebars", expressHbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.listen(PORT);