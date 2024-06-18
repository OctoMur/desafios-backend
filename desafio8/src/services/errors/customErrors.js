//Creo una clase para generar nuestros propios errores

class CustomError{
    static createError({name = "Error", cause = "Desconocido", message, code}){
        const error = new Error(message);
        error.name = name;
        error.cause = cause;
        error.code = code;
        throw error;
    }
}

module.exports = CustomError;