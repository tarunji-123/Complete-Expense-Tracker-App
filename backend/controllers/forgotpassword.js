const SibApiV3Sdk = require('sib-api-v3-sdk');

const dotenv = require('dotenv').config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
// Set your SendinBlue API key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

exports.sendEmailss = async(req,res)=>{
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

  try{
    const sendEmail = await apiInstance.sendTransacEmail({
      sender,
      to : receivers,
      subject : "hello boy",
      textContent : "text Email",
      
    });
    return res.send(sendEmail);
  }catch(err){
    console.log(err);
  }
}
