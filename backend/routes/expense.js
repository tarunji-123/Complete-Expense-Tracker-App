const express = require('express');

const expenseController = require('../controllers/expense');

const router = express.Router();

router.post('/add-exp',expenseController.addExpense);

router.get('/get-exp',expenseController.getExpenses);

router.get('/get-exp/:id',expenseController.getExpense);

router.delete('/delete-exp/:id',expenseController.deleteExpenses);

module.exports = router;
