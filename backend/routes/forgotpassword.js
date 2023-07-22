const express = require('express');

const userAuthentication = require('../middleware/auth');
const forgotpasswordController = require('../controllers/forgotpassword');

const router = express.Router();

router.get('/updatepassword/:resetpasswordid',forgotpasswordController.updatepassword);

router.get('/resetpassword/:id',forgotpasswordController.resetpassword);

router.post('/forgotpassword',
forgotpasswordController.forgotpassword);

module.exports = router;
