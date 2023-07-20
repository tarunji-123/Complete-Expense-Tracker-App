const User = require('../models/user');
const Expense = require('../models/expenses');
const sequelize = require('../util/database');
const Model = require('sequelize');

exports.getUserLeaderBoard = async(req,res)=>{
    try{
        const leaderBoardofUsers = await User.findAll({
            attributes : ['id', 'name',[sequelize.fn('sum',sequelize.col('expenses.amount')),'total_cost']],
            include :[
                {
                    model : Expense,
                    attributes : []
                }
            ],
            group:['user.id'],
            order:[['total_cost','DESC']]
        });
        
        res.status(200).json(leaderBoardofUsers);


    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}