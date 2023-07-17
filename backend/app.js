const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const User = require('./models/user');
const Expense = require('./models/expenses');

const app = express();
app.use(cors());

app.use(bodyParser.json({extened : false}));

app.use('/expenses',expenseRoutes)
app.use('/user',userRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize.sync()
.then((result)=>{
    console.log('database synced');

    app.listen(5000);
})
.catch(err => console.log(err));
