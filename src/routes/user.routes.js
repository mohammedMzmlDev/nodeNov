const express = require('express')
const router = express.Router()
const userController = require('../controllers/users.controller')

router.get('/',userController.getAllUsers)

router.post('/addUser',userController.create);

router.post('/login',userController.login);

module.exports = router

