const UserModel = require("../models/user.model");
const CartModel = require("../models/carts.model");
const {createHash , isValidPassword} = require("../utils/hashBcrypt");
const jwt = require("jsonwebtoken");
const UserDTO = require("../dto/user.dto");
const response = require("../utils/reusable")

//Importacion desafio 8
const CustomError = require("../services/errors/customErrors");
const {generateInfoErrorRegister, generateInfoErrorLogin} = require("../services/errors/info");
const { EErrors } = require("../services/errors/enums");

class UserController{

    async register(req, res, next) {
        const { firstName, lastName, email, password, age, admin = false } = req.body;
        try {
            if(!firstName || !lastName || !email || !password || !age){
                CustomError.createError(
                {
                    name: "User creation error",
                    cause: generateInfoErrorRegister({firstName, lastName, email, password, age}),
                    message: "Error al intentar crear un usuario",
                    code: EErrors.TIPO_INVALIDO
                })
                
            }
            const registeredUser = await UserModel.findOne({ email });
            if (registeredUser) {
                return response(res, 400, {message: `Este correo ya ha sido registrado`});
            }

            const newCart = new CartModel();
            await newCart.save();

            const newUser = new UserModel({
                firstName,
                lastName,
                email,
                cart: newCart._id, 
                password: createHash(password),
                age,
                admin: admin === 'on'
            });
            await newUser.save();

            const token = jwt.sign({ user: newUser }, "m1$up3rKlaB$ekReT4");

            res.cookie("CookieComponent", token, {
                httpOnly: true
            });

            res.redirect("/api/users/profile");
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        const { email, password } = req.body;
        try {
            if(!email || !password){
                CustomError.createError(
                {
                    name: "Login error",
                    cause: generateInfoErrorLogin({email, password}),
                    message: "Error al enviar credenciales",
                    code: EErrors.TIPO_INVALIDO
                })
            }
            const userFound = await UserModel.findOne({ email });
            if (!userFound) {
                return res.status(401).send("Usuario no válido");
            }

            const isValid = isValidPassword(password, userFound);
            if (!isValid) {
                return res.status(401).send("Contraseña incorrecta");
            }

            const token = jwt.sign({ user: userFound }, "m1$up3rKlaB$ekReT4");

            res.cookie("CookieComponent", token, {httpOnly: true});

            res.redirect("/api/users/profile");
        } catch (error) {
            next(error);
        }
    }

    async profile(req, res) {
        //Con DTO: 
        const userDto = new UserDTO(req.user.firstName, req.user.lastName, req.user.admin);
        const isAdmin = req.user.admin === 'admin';

        res.render("profile", { user: userDto, isAdmin });
    }

    async logout(req, res) {
        res.clearCookie("CookieComponent").redirect("/login");
    }

    async admin(req, res) {
        if (req.user.user.admin !== "admin") {
            return res.status(403).send("Acceso denegado");
        }
        res.render("admin");
        }
    }

module.exports = UserController;
