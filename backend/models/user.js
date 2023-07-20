const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const expenses = sequelize.define('user',{
    id:{
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    name:{
        type : Sequelize.STRING,
        allowNull : false
    },
    email : {
        type : Sequelize.STRING,
        allowNull : false,
        unique : true,
    },
    password :{
        type : Sequelize.STRING,
        allowNull : false
    },
    isPremiumUser : Sequelize.BOOLEAN,
    totalExpense : {
        type : Sequelize.DOUBLE,
        defaultValue : 0,
    }
})

module.exports  = expenses;
