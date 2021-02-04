const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../db');
var BCRYPT_SALT_ROUND = 12;

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
                var tokenData = {
                    document: signinUser.document
                }

                var token = jwt.sign(tokenData, 'something secret',{
                    expiresIn: 60 * 60 * 24
                });

                res.status(200).send({ success: "Logeado correctamente", code: 200, data: signinUser, token: token});
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

router.put("/addMoney/:id", async (req, res) => {
    const user = await User.update(req.body, {
        where: { id: req.params.id }
    });
    if (user) {
        res.send({msg: "Nuevo balance agregado correctamente", code: 200});
    }
    res.send({msg: "No se pudo agregar el nuevo balance, intente de nuevo", code: 201});
});

router.put("/lessMoney/:id", async (req, res) => {
    const user = await User.update(req.body, {
        where: {id: req.params.id}
    });
    if(user){
        res.send({msg: "Su compra ha sido pagada con éxito", code: 200});
    }
    res.send({msg: "No se pudo realizar el pago correspondiente", code: 201});
});

router.get("/consult/:id", async (req, res) => {
    const userSignin = await User.findOne({
        where: {id: req.params.id}
    });
    res.send({payload: userSignin});
});

module.exports = router;