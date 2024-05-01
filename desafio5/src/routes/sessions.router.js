const express = require("express");
const router = express.Router();
const userModel = require("../dao/models/user.model");

//Login
router.post("/login", async (req, res) =>{
    const {email, password} = req.body;

    try {
        const user = await userModel.findOne({email: email});

        if(user){
            //login
            if(user.password === password){
                req.session.login = true;
                req.session.user = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    age: user.age,
                    admin: user.admin ? "Sí" : "No"
                };
                res.redirect("/profile");
            } else {
                res.status(401).send({error: "Password incorrecta"});
            }
        } else {
            res.status(400).send({error: "Usuario no encontrado"});
        }
    } catch (error) {
        res.status(400).send("Error en el login");
    }
})

//Logout
router.get("/logout", async (req, res) =>{
    if(req.session.login){
        req.session.destroy();
        res.status(200).send({message:"Desconexion exitosa"});
    }
})

module.exports = router;