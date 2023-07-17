const express = require('express');

const expenseController = require('../controllers/expense');

const userAuthenticate = require('../middleware/auth');

const router = express.Router();

router.post('/add-exp',userAuthenticate.authenticate,expenseController.addExpense);

router.get('/get-exp',userAuthenticate.authenticate ,expenseController.getExpenses);

router.get('/get-exp/:id',expenseController.getExpense);

router.delete('/delete-exp/:id',expenseController.deleteExpenses);

module.exports = router;
