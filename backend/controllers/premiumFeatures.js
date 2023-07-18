const User = require('../models/user');
const Expense = require('../models/expenses');

exports.getUserLeaderBoard = async(req,res)=>{
    try{
        const users = await User.find();
        const expenses = await Expense.find();
        const userAggregateExpenses = {};
        console.log(expenses);

        expenses.forEach((expense)=>{
            if(userAggregateExpenses[expense.userId]){
                userAggregateExpenses[expense.userId] = userAggregateExpenses[expense.userId] + expense.amount;
            }else{
                userAggregateExpenses[expense.userId] = expense.amount;
            }
        })
        var userLeaderBoardDetails = [];
        users.forEach((user)=>{
            userLeaderBoardDetails.push({name: user.name, total_cost : userAggregateExpenses[user.id]||0})
        })
        console.log(userLeaderBoardDetails);
        userLeaderBoardDetails.sort((a,b)=>b.total_cost - a.total_cost);
        res.status(200).json(userLeaderBoardDetails);


    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}