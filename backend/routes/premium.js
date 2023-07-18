const express = require('express');

const premiumController = require('../controllers/premiumFeatures');

const userAuthenticate = require('../middleware/auth');

const router = express.Router();

router.get('/showLeaderBoard',userAuthenticate.authenticate,premiumController.getUserLeaderBoard);

module.exports = router;
