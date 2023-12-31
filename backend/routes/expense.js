const express = require('express');

const expenseController = require('../controllers/expense');

const userAuthenticate = require('../middleware/auth');

const router = express.Router();

router.post('/add-exp',userAuthenticate.authenticate,expenseController.addExpense);

router.get('/get-exp',userAuthenticate.authenticate ,expenseController.getExpenses);

router.get('/get-exp/:id',expenseController.getExpense);

router.delete('/delete-exp/:id',userAuthenticate.authenticate,expenseController.deleteExpenses);

router.get('/download',userAuthenticate.authenticate,expenseController.download);


module.exports = router;
