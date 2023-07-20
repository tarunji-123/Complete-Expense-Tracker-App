const Razorpay = require('razorpay');
// const order = require('../models/order');
const Order = require('../models/order');
const userController = require('./users');

exports.purchasepremium = async(req,res)=>{
    var rzp = new Razorpay({
        key_id : 'rzp_test_S0h8xBTpb8O7jL',
        key_secret : 'JVOCpQJlHKkbhxSn6PtU4Uj6'
    })
    const amount = 2500;
    rzp.orders.create({amount, currency : "INR"},(err,order)=>{
        if(err){
            throw new Error (JSON.stringify(err));
        }
        console.log('req',req);
        console.log('req.user', req.user);
        req.user.createOrder({orderid : order.id, status : 'PENDING'})
        .then(()=>{
            return res.status(201).json({order,key_id : rzp.key_id});

        })
        .catch(err =>{
            console.log(err);
            res.status(403).json({message:'Something went wrong', error : err});
        })
    })
}

exports.updatetransactionstatus = async(req,res)=>{
    try{
        console.log(req.body);
        const userId = req.user.id;
        const{ payment_id , order_id} = req.body;
        const order = await Order.findOne({where :{orderid : order_id}})

        const promise1 = order.update({paymentid:payment_id,status:'SUCCESSFULL'})

        const promise2 = req.user.update({isPremiumUser : true})
        Promise.all([promise1,promise2]).then(()=>{
            return res.status(202).json({success : true,message :"Transaction Successful", token : userController.generateAccessToken(userId, undefined, true)})
        })
        .catch((err)=>{
            throw new Error(err);
        })
    }
    catch(err){
        console.log(err);
        res.status(403).json({error:err, message: 'Something went wrong'});
    }
}

