const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = process.env.port || 3000;

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// define a root route
app.get('/', (req, res) => {
    res.send("Hell Yeah!!");
});


// listen for requests
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// Require employee routes
const employeeRoutes = require('./src/routes/employee.routes')
// using as middleware
app.use('/api/v1/employees', employeeRoutes)

// 
const mysql = require('mysql');

const dbConn = mysql.createConnection({
    host     : 'localhost',
    user     : 'newuser',
    password : 'password',
    database : 'nodeone'
});
dbConn.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected! in index");
});
/* let email = 'janedoe@gmail.com'
var ex = dbConn.query(`Select * from employees where email = '${email}'`,(err,res) => {
    console.log('res',res);
    console.log('err',err);
}); */
app.get('/getAllEmployees', (req,res) => {
    dbConn.query(`Select * from employees`,(error,response) => {
        res.send(response)
    });
})
// console.log('ex',ex);
