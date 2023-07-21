const express = require('express');

const forgotpasswordController = require('../controllers/forgotpassword');

const router = express.Router();

router.post('/forgotpassword',
forgotpasswordController.sendEmailss);

module.exports = router;
