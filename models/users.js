module.exports = (sequelize, type) => {
    return sequelize.define('user', {
        id:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        document: {
            type: type.INTEGER,
            required: true
        },
        name:{
            type: type.STRING,
            required: true
        },
        email: {
            type: type.STRING,
            required: true
        },
        cellphone: {
            type: type.INTEGER,
            required: true
        },
        password: {
            type: type.STRING,
            required: true
        },
        money: {
            type: type.INTEGER,
            null: true,
            default: 0,
        }
    })
}
