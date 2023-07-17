const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = (req, res, next)=>{
    try{
        const token = req.header('Authorization');
        console.log('token =',token);
        const user = jwt.verify(token,'mynameistarun');
        console.log('user.userId',user.userId);
        User.findByPk(user.userId).then(user =>{
            // console.log(req);
            // console.log(user);
            console.log('req.user = ',req.user);
            req.user = user;
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
