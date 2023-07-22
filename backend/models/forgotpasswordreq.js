const Sequelize = require('sequelize');
const sequeilize = require('../util/database');

const forgotpasswordrequest = sequeilize.define('forgotpasswordrequest',{
    id:{
        type : Sequelize.UUID,
        // defaultValue : Sequelize.UUIDV4,
        allowNull : false,
        primaryKey : true
    },
    
    isactive: {
        type : Sequelize.BOOLEAN,
        defaultValue : false
    },
    expiresby : Sequelize.DATE
})

module.exports = forgotpasswordrequest;

