var dbConn = require('./../../config/db.config');
const bcrypt = require('bcryptjs');
var crypto = require('crypto');

// Fetch all users
exports.all = (result) => {
    dbConn.query(`SELECT * FROM users`, (err,res) => {
        if(err){
            result(null, err);
        }
        result(null, res);
    })
}

// Create new user
exports.addUser = async (user, result) => {
    // let q = `SELECT COUNT(email) from users WHERE email = '${user.email}'`;
    let q = `SELECT COUNT(*) AS email FROM users WHERE email = '${user.email}'`;
    dbConn.query(q, async (err,res) => {
        console.log('email count',res[0].email);
        if(err){
            result(null, err);
        }
        if(res && res[0].email > 0){
            result(null,'Email already exist');
        }else{
            let query = `INSERT INTO users
            (FirstName,LastName,Email,ProfilePic,Password)
            VALUES (?, ?, ?, ?, ?);`;
            console.log('bfr pass');
            const salt = await bcrypt.genSalt(10);
            let password = await bcrypt.hash(user.password, salt);
            dbConn.query(query,[user.firstName,user.lastName,user.email,"",password], (err,res) => {
                if(err){
                    result(null, err);
                }
                result(null, res);
            })
        }
    })
}

// User Login
exports.userLogin = async (data, result) => {
    let query = `SELECT * FROM users WHERE Email = '${data.email}'`;
    // console.log('query',query);
    dbConn.query(query, async (err,res) => {
        if(err){
            result(null, err);
        }
        bcrypt.compare(data.password, res[0].Password, function(err, res) {
            if(err){
                result(null, err);
            }
            if(res){
                result(null, 'Login Success');
            }else{
                result(null, 'Invalid Password');
            }
        });
    })
}