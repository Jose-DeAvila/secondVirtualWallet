const router = require('express').Router();
const bcrypt = require('bcrypt');

const { User } = require('../db');
var BCRYPT_SALT_ROUND = 12;

router.get("/", async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

router.post("/", async (req, res) => {

});

router.put("/:document", async (req, res) => {
    const user = await User.update(req.body, {
        where: { document: req.params.document }
    });
    if (user) {
        res.json({ success: "Actualizado correctamente" });
    }
    res.json("Error al actualizar");
});

router.delete('/:document', async (req, res) => {
    await User.destroy({
        where: { document: req.params.document }
    });
    res.json({ success: "Usuario borrado" });
});

router.post("/login", async (req, res) => {
    try {
        const signinUser = await User.findOne({
            where: {email: req.body.email}
        });
        bcrypt.compare(req.body.password, signinUser.password)
            .then(samePassword => {
                if (!samePassword) {
                    res.status(201).send({ error: "La contraseña no coincide" });
                }
                res.status(200).send({ success: "Logeado correctamente", code: 200, data: signinUser });
            });
    }
    catch (error) {
        res.status(500).send({ error: error });
    }
});

router.post("/register", async (req, res) => {
    
    const userSignin = await User.findOne({
        where: {email: req.body.email}
    });
    if(!userSignin){
        const {document, name, email, cellphone, password} = req.body;
        bcrypt.hash(password, BCRYPT_SALT_ROUND)
        .then(function(hashedPassword){
            var userData = {
                document: escape(document),
                name: escape(name),
                email: escape(email), 
                cellphone: escape(cellphone), 
                password: hashedPassword
            }
            User.create(userData);
            res.send({msg: "Usuario registrado correctamente", code: 200});
        });
    }
    else{
        res.send({msg: "El usuario ya se encuentra registrado", code: 201});
    }
});

module.exports = router;