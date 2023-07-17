const express = require('express');
const purchaseController = require('../controllers/purchase');

const authenticationMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/premiummembership',authenticationMiddleware.authenticate,purchaseController.purchasepremium);

router.post('/updatetransactionstatus', authenticationMiddleware.authenticate, purchaseController.updatetransactionstatus);

module.exports = router;