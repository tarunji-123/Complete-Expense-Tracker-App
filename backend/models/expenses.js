const Sequelize = require('sequelize');
const sequeilize = require('../util/database');

const expenses = sequeilize.define('expenses',{
    id:{
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    amount :{
        type : Sequelize.DOUBLE,
        allowNull: false
    },
    desc : {
        type : Sequelize.STRING,
        allowNull: false
    },
    category:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = expenses;