const Razorpay = require('razorpay');
const order = require('../models/order');
const Order = require('../models/order');

exports.purchasepremium = async(req,res)=>{
    var rzp = new Razorpay({
        // key_id : process.env.RAZORPAY_KEY_ID,
        // key_secret : process.env.RAZORPAY_KEY_SECRET
        key_id : 'rzp_test_kL1qrGVRGjqWvz',
        key_secret : '2R2GW92uHCYT8opBy39GL2JB'
    })
    const amount = 2500;
    rzp.orders.create({amount, currency : "INR"},(err,order)=>{
        if(err){
            throw new Error (JSON.stringify(err));
        }
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
        const{ payment_id , order_id} = req.body;
        const order = await Order.findOne({where :{orderid : order_id}})

        const promise1 = order.update({paymentid:payment_id,status:'SUCCESSFULL'})

        const promise2 = req.user.update({isPremiumUser : true})
        Promise.all([promise1,promise2]).then(()=>{
            return res.status(202).json({success : true,message :"Transaction Successfull"})
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

