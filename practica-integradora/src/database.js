//Importacion de mongoose
const mongoose = require("mongoose");

//Estableciendo la conexion a la base de datos
mongoose.connect("mongodb+srv://OctavioMRU:KCf5CDDJXf8UNCcu@cluster0.mnkh0d2.mongodb.net/7_Components?retryWrites=true&w=majority")
    .then(()=> console.log("Conexion establecida"))
    .catch(()=> console.log("Conexion no establecida"))