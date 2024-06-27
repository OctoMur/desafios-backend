const winston = require("winston");
const configObject = require("../config/config.js");

const {node_env} = configObject;

const levels = {
    nivel: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "red",
        error: "yellow",
        warning: "blue",
        info: "green",
        http: "magenta",
        debug: "white"
    }
}

const loggerDev = winston.createLogger({
    levels: levels.level,
    transports: [
        new winston.transports.Console({
            level: "debug"
        })
    ]
})

const loggerProd = winston.createLogger({
    levels: levels.level,
    transports: [
        new winston.transports.File({
            filename: "./errors.log",
            level: "error"
        })
    ]
})

const logger = node_env === "production" ? loggerProd : loggerDev;

module.exports = logger;