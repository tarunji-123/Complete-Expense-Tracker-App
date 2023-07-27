const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv').config();

const authenticate = (req, res, next)=>{
    try{
        const token = req.header('Authorization');
        console.log('token =',token);
        if (!token) {
            return res.status(401).json({ success: false, message: 'Authentication failed: Token missing.' });
        }
        const user = jwt.verify(token,process.env.SECRET_KEY);
        console.log('user.userId',user.userId);
        User.findByPk(user.userId).then(user =>{
            
            req.user = user;
            // console.log('req.user2 = ',req.user);
           
            next();
        })
    }catch(err){
        return res.status(401).json({success : false});
    }
}

module.exports = {
    authenticate
}
