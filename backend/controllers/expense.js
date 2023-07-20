const expenses = require('../models/expenses');
const userTable = require('../models/user')

exports.addExpense = async(req,res,next)=>{
    const {amount , desc, category} = req.body;
    const userId = req.user.id;
    const data = await expenses.create({
        amount : amount,
        desc : desc,
        category : category,
        userId : userId,
    })
    // Fetch the current user from the database
    const user = await userTable.findByPk(userId);

    // Convert totalExpense to a number using parseFloat
    const currentTotalExpense = parseFloat(user.totalExpense || 0);

    // Update the totalExpense field with the new amount
    const newTotalExpense = currentTotalExpense + parseFloat(amount);
    await user.update({ totalExpense: newTotalExpense });
    console.log(userTable);
    console.log ("expense add");
    res.status(201).json({newExpenseDetail : data});
}

exports.getExpenses = async(req,res,next)=>{
    try{
        const expense = await expenses.findAll({where : {userId : req.user.id}});
        console.log('userId ',req.user.id);
        res.status(200).json({allExpenses: expense});
    }
    catch(err){
        return res.status(401).json({success: false});
    }
}

exports.getExpense = async(req,res,next)=>{
    const expId = req.params.id;
    const expense = await expenses.findByPk(expId);
    res.status(200).json({allExp: expense});
}


exports.deleteExpenses = async(req,res,next)=>{
    const userId = req.user.id;
    const expId = req.params.id;
    const amount = req.params.amount;
    const user = await userTable.findByPk(userId);
    const currentTotalExpense = parseFloat(user.totalExpense || 0);
    const newTotalExpense = currentTotalExpense - parseFloat(amount);
    await user.update({ totalExpense: newTotalExpense });
    console.log(userTable);
    await expenses.destroy({where : {id : expId}});
    res.sendStatus(200);
}

