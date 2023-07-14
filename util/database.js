const Sequelize = require('sequelize');
const sequelize = new Sequelize ('expense-tracker','root','Tannu@141',{
    dialect : 'mysql',
    host : 'localhost'
})

module.exports = sequelize;

// what is dialect, and what is this? 