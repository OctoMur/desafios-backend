const { EErrors } = require("../services/errors/enums");

const errorHandler = (error, req, res, next) => {
    switch(error.code){
        case EErrors.TIPO_INVALIDO:
            console.log(error.cause);
            res.send({status:"error", error: error.name});
            break;
        default:
            res.send({status: "error", error: "Error desconocido"});
    }
}

module.exports = errorHandler;