const expenses = require('../models/expenses');
// const expenses = require('../models/user');
const userTable = require('../models/user')
const sequeilize = require('../util/database');
// const S3Services = require('../services/S3Services');
const FilesDownload = require("../models/filesdownloaded");

exports.addExpense = async(req,res,next)=>{
    try{
        const t = await sequeilize.transaction();
        const {amount , desc, category} = req.body;
        const userId = req.user.id;

        if(amount == undefined || amount.length ===0){
            return res.status(400).json({success: false, message: 'Parameter missing'});
        }
        const data = await expenses.create({
            amount : amount,
            desc : desc,
            category : category,
            userId : userId,
        },
        {transaction: t})
        const user = await userTable.findByPk(userId , { transaction: t});

        const currentTotalExpense = parseFloat(user.totalExpense || 0);

        const newTotalExpense = currentTotalExpense + parseFloat(amount);
        await user.update({ totalExpense: newTotalExpense }, {transaction : t});
        
        await t.commit();
        console.log ("expense add");
        res.status(201).json({newExpenseDetail : data});
        }catch(err){
            await t.rollback();
            console.log(err);
            res.status(500).json({success: false, message: "Error adding expense"})
        }
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
    try{
        
        const userId = req.user.id;
        console.log("userId ;", userId);
        const expId = req.params.id;
        console.log("expId ; ",expId)
        const amount = req.query.amount;
        console.log ("amount ; ", amount);

        if(!amount || isNaN(amount)){
            return res.status(400).json({success: false, message: 'Invalid amount'})
        }
        const user = await userTable.findByPk(userId);

        if(!user){
            return res.status(404).json({success: false, message: 'User Not Found'})
        }
        const currentTotalExpense = parseFloat(user.totalExpense ||0);

        const newTotalExpense = currentTotalExpense - parseFloat(amount);

        await user.update({ totalExpense: newTotalExpense });
        console.log(userTable);
        await expenses.destroy({where : {id : expId}});
        res.json({success:true, message:'Successfully expense deleted'});
    
    }catch(err){
        console.log(err);
        res.status(500).json({success:false, message: 'Error delete Expense'})
    }
}


exports.download = async (req, res) => {
    try {
      const expenses = await expenses.findAll({ where: { userId: req.user.id } });
      // console.log(expenses);
      const strinfiyExpenses = JSON.stringify(expenses);
      const userId = req.user.id;
      const filename = `expenses${userId}/${new Date()}.txt`;
      const fileUrl = await S3Services.uploadToS3(strinfiyExpenses, filename);
      // await FilesDownload.create({
      //   filelink: fileUrl,
      //   userId,
      // });
      res.status(200).json({ fileUrl });
    } catch (err) {
      res.status(500).json({ fileUrl: "" });
    }
  };
  

exports.downloadLinks=async (req,res)=>{
    const t = await sequeilize.transaction();
  try{
    const url=await FilesDownload.findAll({where:{userId:req.user.id}})
    res.status(200).json({sucess:'true',url})
  }
  catch(err){
    console.log(err);
    res.status(500).json({success:'false',error:err});
  }
  }