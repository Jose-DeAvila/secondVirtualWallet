const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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

router.put("/lessMoney/:id/:token/:idSession", async (req, res) => {
    const user = await User.update(req.body, {
        where: {id: req.params.id}
    });
    if(user){
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth:{
                user: 'lmillonsxukys@gmail.com',
                pass: '3005560374xd'
            }
        });
        let mailOptions = {
            from: "lmillonsxukys@gmail.com",
            to: req.body.email,
            replyTo: "lmillonsxukys@gmail.com",
            subject: 'Pago realizado correctamente - Información',
            text: `Su pago fue realizado correctamente. Token: ${req.params.token} - Id: ${req.params.idSession}`,
            html: `<h3>Token + id de pago realizado</h3>
            <ul>
                <li>Token: ${req.params.token}</li>
                <li>Id: ${req.params.idSession} </li>
            </ul><br/>
            <h5>Gracias por confiar en nosotros para sus pagos</h5>
            `
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if(err){
                console.log(err);
                return;
            }
            console.log("Mensaje enviado: %s", info.mensaje);
        });
        res.send({msg: "Pago realizado correctamente", code: 200});
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
