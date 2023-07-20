const User = require('../models/user');
const Expense = require('../models/expenses');
const sequelize = require('../util/database');
const Model = require('sequelize');

exports.getUserLeaderBoard = async(req,res)=>{
    try{
        const leaderBoardofUsers = await User.findAll({
            
            order:[['totalExpense','DESC']]
        });
        
        res.status(200).json(leaderBoardofUsers);


    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}