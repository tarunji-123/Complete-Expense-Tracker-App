const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database')
const expense = require('./models/expense');

const app = express();
app.use(cors());

app.use(bodyParser.json({extened : false}));

app.post('/user/signup',(req,res,next)=>{
    const {name, email, password} = req.body;
    
    const data = expense.create(
        {
            name: name,
            email : email,
            password : password
        }
    )
    res.status(201).json({newuserDetail : data});
})

sequelize.sync()
.then((result)=>{
    console.log('database synced');

})
.catch(err => console.log(err));

app.listen(5000);