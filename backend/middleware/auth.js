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
        const user = jwt.verify(token,process.env.TOKEN_SECRET);
        console.log('user.userId',user.userId);
        User.findByPk(user.userId).then(user =>{
            // console.log(req);
            // console.log(user);
            console.log('req.user = ',req.user);
            req.user = user;
            console.log('req.user2 = ',req.user);
            // console.log('req.user after = ',req.user);
            next();
        })
    }catch(err){
        return res.status(401).json({success : false});
    }
}

module.exports = {
    authenticate
}
