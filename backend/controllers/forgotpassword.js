const SibApiV3Sdk = require('sib-api-v3-sdk');
const { TransactionalEmailsApi, SendSmtpEmail } = SibApiV3Sdk;

require('dotenv').config();

// Set your SendinBlue API key
const apiKey = process.env.API_KEY;

// Initialize the TransactionalEmailsApi with your API key
const apiInstance = new TransactionalEmailsApi();
apiInstance.setApiKey(apiKey);

// Sender and recipient information
const sender = { email: 'tarunbhadoriya141@gmail.com' };
const receivers = [{ email: 'tarunbhadoriya151@gmail.com' }];

// Create the email object
const email = new SendSmtpEmail({
  sender,
  to: receivers,
  subject: 'Hello Hello',
  textContent: 'how are you?',
});

// Send the email 
apiInstance.sendTransacEmail(email)
  .then((response) => {
    console.log('Email sent successfully!', response);
  })
  .catch((error) => {
    console.error('Error sending email:', error);
  });