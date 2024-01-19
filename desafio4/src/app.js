const express = require("express");
const app = express();
const PORT = 8080;
const expressHbs = require("express-handlebars"); 

//Routers
const productsRouter = require("./routes/products.router");
const cartRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api", productsRouter);
app.use("/api", cartRouter);
app.use(viewsRouter)

//Handlebars
app.engine("handlebars", expressHbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.get("/", (req, res) =>{
    
})

app.listen(PORT, ()=>{
    console.log(`Server activo: http://localhost:8080`);
})

