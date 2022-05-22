var dbConn = require('./../../config/db.config');
const bcrypt = require('bcryptjs');
var crypto = require('crypto');
const jwt = require('jsonwebtoken');
const res = require('express/lib/response');

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
            result({status:400,message:'Email already exist'});
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
    if(data && data.email && data.password){
        let query = `SELECT * FROM users WHERE Email = '${data.email}'`;
        console.log('query',query);
        dbConn.query(query, async (err,res) => {
            console.log('res',res[0].FirstName);
            if(err){
                result(null, err);
            }
            if(res.length){
                try {
                    bcrypt.compare(data.password, res[0].Password, async function(err, comResult) {
                        if(err){
                            result(null, err);
                        }
                        if(comResult){
                            let jToken = await createJwt({
                                username: res[0].FirstName,
                                userID: res[0].UserID,
                                email : res[0].Email
                            });
                            result(null, {
                                status : 200,
                                auth_token : jToken,
                                message : 'Login Success'
                            });
                        }else{
                            result(null, 'Invalid Password');
                        }
                    });
                } catch (error) {
                    result({
                        status : 401,
                        message : error
                    },null);
                }
            }else{
                result({
                    status : 204,
                    message : 'No record exist for given email'
                },null);
            }
        })
    }else{
        result({
            status : 401,
            message : 'Invalid Input'
        },null);
    }
}
// Function to create JWT
function createJwt(request) {
    console.log('request in create jwt',request);
    try {
        return new Promise((resolve, reject) => {
            jwt.sign( request , 'authKey', (err, token) => {
                if (err) {
                    return reject(err)
                } 
                console.log('token in create jwt',token);
                resolve(token);
            })
        })
    } catch (error) {
        return error
    }
}
