var dbConn = require('./../../config/db.config');

exports.all = (result) => {
    dbConn.query(`SELECT * FROM users`, (err,res) => {
        if(err){
            result(null, err);
        }
        result(null, res);
    })
}

exports.addUser = (user, result) => {
    // console.log('user data =>',user);
    result(null, user);
}