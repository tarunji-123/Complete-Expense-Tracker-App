const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const User = require('./models/user');
const Expense = require('./models/expenses');
const Order = require('./models/order');

const app = express();
app.use(cors());

app.use(bodyParser.json({extened : false}));

app.use('/expenses',expenseRoutes)
app.use('/user',userRoutes);
app.use('/purchase',purchaseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize.sync()
.then((result)=>{
    console.log('database synced');

    app.listen(5000);
})
.catch(err => console.log(err));
