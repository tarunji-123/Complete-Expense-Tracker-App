const bcrypt = require('bcrypt');
const user = require('../models/user');
const jwt = require('jsonwebtoken');

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
        const saltrounds = 10;
        bcrypt.hash(password,saltrounds, async(err,hash)=>{
            console.log(err);
            await user.create({name,email,password: hash })
            res.status(201).json({message : 'Successfully create new user'});
        })
        
    }catch(err){
        res.status(500).json(err);
    }
} 


// function generateAccessToken(id, name, isPremiumUser){
//   return jwt.sign({userId : id , name : name, isPremiumUser},'mynameistarun')
// }
function generateAccessToken  (id, name, isPremiumUser){
  return jwt.sign({userId: id, name: name, isPremiumUser}, 'mynameistarun');
}

exports.login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (isstringInvalid(email) || isstringInvalid(password)) {
        return res.status(400).json({
          message : "email or password is missing",success: false
        });
      }
      console.log(password);
  
      const foundUser = await user.findOne({
        where: { email: email }
      });
  
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, (err, result) => {
          if (result) {
            console.log('hello from login backend');
            res.status(201).json({ message: 'Successfully Login' , token : generateAccessToken(foundUser.id, foundUser.name, foundUser.isPremiumUser)});
          } else {
            res.status(500).json({ message: 'Email or password may be wrong' });
          }
        });
      } else {
        res.status(500).json({ message: 'Email or password may be wrong' });
      }
    } catch (err) {
      console.log('500 error from backend');
      res.status(500).json(err);
    }
};

exports.generateAccessToken = generateAccessToken;