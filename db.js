const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const userModel = require('./models/users');

const sequelize = new Sequelize('virtualwallet', 'root', '26930470', {
    host: 'localhost',
    dialect: 'mysql'
});

const User = userModel(sequelize, Sequelize);

sequelize.sync({force: false}).then(() => {
    console.log("Tablas sincronizadas");
});

module.exports = {User};