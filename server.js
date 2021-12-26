const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

app.post('/protectedRoute', verifyToken,(req,res) => {
    jwt.verify(req.token,'someSecretKey', (err,auth) => {
        if(err){
            console.log('err',err);
            res.sendStatus(403);
        }else{
            res.json({
                message: 'Post created...',
                auth
            });
        }
    })
})

app.get('/createJWT',  (req, res) => {
    const user = {
        id: 1, 
        username: 'brad',
        email: 'brad@gmail.com'
    }
    jwt.sign({user},'someSecretKey',(err,token) => {
        res.status(200).send(token)
    })
});

function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    if(bearerHeader){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }
    
}

// listen for requests
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// Require employee routes
const employeeRoutes = require('./src/routes/employee.routes')
const users = require('./src/routes/user.routes')
// using as middleware
app.use('/api/v1/employees', employeeRoutes)
app.use('/api/v1/users', users)

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
app.get('/getAllEmployees', (req,res) => {
    dbConn.query(`Select * from employees`,(error,response) => {
        if(error)
            res.send(error);
        res.send({
            status : 200,
            data : response
        })
    });
})
app.post('/addEmployee',(request, response) => {
    let query = `INSERT INTO employees 
            (first_name,last_name,email,phone,organization,designation,salary,status,is_deleted,created_at,updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    if(request){
        dbConn.query(query,[request.body.firstName,request.body.lastName,request.body.email,request.body.phone,request.body.organization,request.body.designation,request.body.salary,1,0,new Date(),new Date()],(err,res) => {
            if(err){
                response.send({
                    status : 500,
                    error : err
                })    
            }
            response.send({
                status : 200,
                data : res
            });
        })
    }else{
        res.send({
            status : 400,
            status_message : 'Invalid Response'
        })
    }
})
app.get('/test',(req,res) => {
    bcrypt.hash('mypassword', 10, function(err, hash) {
        res.send(hash);
    });
})

app.post('/addUser',(request, response) => {
    // console.log('request',request);
    let query = `INSERT INTO users
                (FirstName,LastName,Email,ProfilePic,Password)
                VALUES (?, ?, ?, ?, ?);`;
    if(request.body){
        // console.log('bfr hash',request.body.password);
        // response.send(request.body.password);
        let password = request.body.password;
        console.log('password',password);
        bcrypt.hash('mypassword', 10, function(err, hash) {
            console.log('hash err',err);
            console.log('passafterhash',hash);
            dbConn.query(query,[request.body.firstName,request.body.lastName,request.body.email,'',hash], (err,res) => {
                console.log('res',res);
                console.log('err',err);
                if(err){
                    response.send({
                        status : 500,
                        error : err
                    })    
                }
                if(res.insertId){
                    response.send({
                        status : 200,
                        data : res
                    });
                }
            })
        },(error) =>{
            res.status(500).send(error);
        })
    }else{
        response.send({
            status : 400,
            status_message : 'Invalid Request'
        })
    }
})

