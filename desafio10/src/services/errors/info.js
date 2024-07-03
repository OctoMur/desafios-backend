const generateInfoErrorRegister = (user) =>{
    return `Los datos estan incompletos o no son validos.
    Se necesitan los siguientes datos:
    -Nombre: String, Se recibio: ${user.firstName}
    -Apellido: String, Se recibio: ${user.lastName}
    -Email: String, Se recibio: ${user.email}
    -Contraseña: String, Se recibio: ${user.password}
    -Edad: Number, Se recibio: ${user.age}
    `
}

const generateInfoErrorLogin = (data) =>{
    return `Los datos estan incompletos o no son validos.
    Se necesitan los siguientes datos:
    -Email: String, Se recibio: ${data.email}
    -Contraseña: String, Se recibio: ${data.password}
    `
}

module.exports = {generateInfoErrorRegister, generateInfoErrorLogin}