const SibApiV3Sdk = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const forgotPassword = require('../models/forgotpasswordreq');
const User = require('../models/user');
// const forgotpasswordrequest = require('../models/forgotpasswordreq');

const dotenv = require('dotenv').config();

// const defaultClient = SibApiV3Sdk.ApiClient.instance;
// // Set your SendinBlue API key
// var apiKey = defaultClient.authentications['api-key'];
// apiKey.apiKey = process.env.API_KEY;

const forgotpassword = async(req,res)=>{
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  // Set your SendinBlue API key
  var apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.API_KEY;
  try{
    const {email} = req.body;
    const user = await User.findOne({where : {email}});
    if(user){
      const id = uuid.v4();
      // await user.createForgotPassword({id, active : true})
      await forgotPassword
      .create({ id, active: true, userId: user.id })
        .catch(err=>{
          throw new Error(err);
        });

      const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      const sender ={
        email : "tarunbhadoriya141@gmail.com",
        name : "Tarun Bhadoriya",
      };
      const receivers = [
        {
          email : req.body.email,
        }
      ];

      const msg = {
        sender,
        to : receivers,
        subject : "Reset Your Password",
        htmlContent: `<a href="http://localhost:5000/password/resetpassword/${id}">Reset password </a>`,
      };

      try{
        const sendEmail = await apiInstance.sendTransacEmail(msg);
        return res.status(200).json({message: 'Link to reset password sent to your mail', success: true});
      }catch(error){
        throw new Error(error);
      }
    }else{
      throw new Error('User does not Exist');
    }
  }catch(err){
    console.log(err);
    return res.status(500).json({message : err.message, success : false})
  }
  
}

const resetpassword = (req, res)=>{
  const id = req.params.id;
  forgotPassword.findOne({where : {id}}).then(forgotpasswordrequest =>{
    if(forgotpasswordrequest){
      forgotpasswordrequest.update({active: false});

      res.status(200).send(`<html>
                              <script>
                                function formsubmitted(e){
                                  e.preventDefault():
                                  console.log('called')
                                }
                              </script>
                              <form action="/password/updatepassword/${id}" method="get">
                                <label for="newpassword">Enter new password</label>
                                <input name="newpassword" type="password" required></input>
                                <button> resetpassword</button>
                              </form>
                            </html>` 
      )
      res.end();
    }
  } );
}

const updatepassword = (req, res)=>{
  try{
    const {newpassword} = req.query;
    const {resetpasswordid} = req.params;
    forgotPassword.findOne({where:{id:resetpasswordid}})
    .then(resetpasswordrequest =>{
      User.findOne({where : {id: resetpasswordrequest.userId}})
      .then(user =>{
        if(user){
          const saltRounds = 10;
          bcrypt.genSalt(saltRounds, function(err,salt){
            if(err){
              console.log(err);
              throw new Error (err);
            }
            bcrypt.hash(newpassword, salt, function (err, hash){
              if(err){
                console.log(err);
                throw new Error(err);
              }
              user.update({password : hash})
              .then(()=>{
                res.status(201).json({message: "Successfully update the new password", success: true})
              })
            })
          });
        }else{
          return res.status(404).status({error : 'No user exists', success: false});
        }
      })
    })
  }catch(error){
    return res.status(403).json({error: error.message,success: false});
  }
}

module.exports ={
  forgotpassword,
  updatepassword,
  resetpassword
}
