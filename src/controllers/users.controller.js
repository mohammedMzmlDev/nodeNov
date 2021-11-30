const USER = require('../modeles/user.model');
exports.getAllUsers = (req,res) => {
    USER.all((err,user) => {
        if (err)
        res.send(err);
        res.send(user);
    })
}
exports.create = (req,res) => {
    USER.addUser(req.body,(err,user) => {
        if (err)
        res.send(err);
        res.json({error:false,message:"Employee added successfully!",user});
    })
}