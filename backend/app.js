const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const app = express();
app.use(cors());

app.use(bodyParser.json({extened : false}));

app.use('/expenses',expenseRoutes)

app.use('/user',userRoutes);

sequelize.sync()
.then((result)=>{
    console.log('database synced');

})
.catch(err => console.log(err));

app.listen(5000);