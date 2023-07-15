
const user = require('../models/user');

function isstringInvalid(string){
    if(string == undefined || string.length ===0){
        return true;
    }else{
        return false;
    }
}


exports.signup = async (req,res,next)=>{
    try{
        const{name, email, password} = req.body;
        if(isstringInvalid(name) || isstringInvalid(email) || isstringInvalid(password)){
            return res.staus(400).json({
                err :"Bad parameters, Something is missing"
            })
        }
        await user.create({name,email,password})
        res.status(201).json({message : 'Successfully create new user'});
        
    }catch(err){
        res.status(500).json(err);
    }
}

exports.login =async (req,res,next)=>{
    try{
        const {email,password} =req.body;
        if(isstringInvalid(email) || isstringInvalid(password)){
            return res.staus(400).json({
                err :"Bad parameters, Something is missing"
            })
        }
        const user = await user.findOne({ where : {email : req.body.email }})
        const user2 = await user.findOne({where: {password : req.body.password}});
        if(user && user2){
            console.log('hello from login backend')
            res.status(201).json({message: 'Successfully Login'})
        }
        else{
            res.staus(500).json({message: 'email or password may be wrong'});
        }


    }
    catch(err){
       res.status(500).json(err);
    }
}
