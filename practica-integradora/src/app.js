// const ProductManager = require("./dao/fs/productManager")
// const productManager = new ProductManager("./src/models/products.json")

const express = require("express");
const app = express();
const PORT = 8080;
const expressHbs = require("express-handlebars");
const socket = require("socket.io");
require("./database");
const MessageModel = require("./dao/models/message.model");
//Routers
const productsRouter = require("./routes/products.router");
const cartRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//Routes
app.use("/api", productsRouter);
app.use("/api", cartRouter);
app.use(viewsRouter)

//Handlebars
app.engine("handlebars", expressHbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


//socket
const httpServer = app.listen(PORT);
const io = socket(httpServer);

io.on("connection", async (socket) => {
    console.log("Se ha conectado un nuevo usuario");

    socket.on("message", async data => {

        //Guardo el mensaje en MongoDB: 
        await MessageModel.create(data);

        //Obtengo los mensajes de MongoDB y se los paso al cliente: 
        const messages = await MessageModel.find();
        console.log(messages);
        io.sockets.emit("message", messages);
    })
})

/*app.listen(PORT);*/