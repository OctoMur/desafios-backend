const express = require ("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model");

//post para generar un usuario y almacenarlo en MongoDB
router.post("/", async (req, res) =>{
    const {firstName, lastName, email, password, age, admin} = req.body;

    try {
        await UserModel.create({
            firstName,
            lastName,
            email,
            password,
            age,
            admin: admin === 'on'});

        res.status(200).send({message: "Usuario creado existosamente"});
    } catch (error) {
        res.status(400).send({message: "Error al crear el usuario"});
    }
})




module.exports = router;