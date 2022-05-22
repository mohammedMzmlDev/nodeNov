const USER = require('../modeles/user.model');
const emailvalidator = require("email-validator");
exports.getAllUsers = (req,res) => {
    USER.all((err,user) => {
        if (err)
        res.send(err);
        res.send(user);
    })
}
exports.create = (req,res) => {
    if(emailvalidator.validate(req.body.email)){
        USER.addUser(req.body,(err,user) => {
            if (err)
            res.send(err);
            res.json(user);
        })
    }else{
        res.status(400).send('Invalid Email');
    }
}

exports.login = (req,res) => {
    USER.userLogin(req.body,(err,data) => {
        console.log('data----------',data);
        if (err){
            res.send({
                status : 401,
                error : err
            });
        }
        res.status(200).send(data);
    })
}
