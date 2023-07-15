const expenses = require('../models/expenses');

exports.addExpense = async(req,res,next)=>{
    const {amount , desc, category} = req.body;
    const data = await expenses.create({
        amount : amount,
        desc : desc,
        category : category
    })
    console.log ("expense add");
    res.status(201).json({newExpenseDetail : data});
}

exports.getExpenses = async(req,res,next)=>{
    const expense = await expenses.findAll();
    res.status(200).json({allExpenses: expense});
}

exports.getExpense = async(req,res,next)=>{
    const expId = req.params.id;
    const expense = await expenses.findByPk(expId);
    res.status(200).json({allExp: expense});
}


exports.deleteExpenses = async(req,res,next)=>{
    const expId = req.params.id;

    await expenses.destroy({where : {id : expId}});
    res.sendStatus(200);
}

