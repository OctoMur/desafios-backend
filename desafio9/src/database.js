const mongoose = require("mongoose");
const configObject = require("./config/config");
const {mongo_url} = configObject;
const logger = require("./utils/logger");
//PATRON SINGLETON
class DataBase{

    static #instance;

    constructor(){
        mongoose.connect(mongo_url);
    }

    static getInstance(){
        if(this.#instance){
            logger.warning("Conexion ya existente. (database: L16)");
            return this.#instance;
        }
        
        this.#instance = new DataBase();
        logger.info("Conexion creada exitosamente. (database: L21)");
        return this.#instance;
    }
}

module.exports = DataBase.getInstance();