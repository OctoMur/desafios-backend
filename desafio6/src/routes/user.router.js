const express = require ("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model");
const { createHash } = require("../utils/hashBcrypt");
const passport = require("passport");

//post para generar un usuario y almacenarlo en MongoDB (usando passport)

router.post("/", passport.authenticate("register", {failureRedirect: "registerfail"}), async (req, res) =>{
    if(!req.user) return res.status(400).send({status: "error", message: "Credenciales invalidas"});

    req.session.user = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        age: req.user.age,
        email: req.user.email
    }

    req.session.login = true;

    res.redirect("/profile");
})

router.get("/registerfail", (req, res) =>{
    res.send({error: "Registro fallido."});
})

module.exports = router;