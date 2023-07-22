const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const forgotPassRoutes = require('./routes/forgotpassword');
const User = require('./models/user');
const Expense = require('./models/expenses');
const Order = require('./models/order');
const forgotPassword = require('./models/forgotpasswordreq');

const app = express();
app.use(cors());

app.use(bodyParser.json({extened : false}));

app.use('/expenses',expenseRoutes)
app.use('/user',userRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/premium',premiumRoutes);
app.use('/password',forgotPassRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(forgotPassword);
forgotPassword.belongsTo(User);

sequelize.sync()
.then((result)=>{
    console.log('database synced');

    app.listen(5000);
})
.catch(err => console.log(err));
