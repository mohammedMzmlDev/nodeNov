const express = require('express')
const router = express.Router()
const employeeController =   require('../controllers/employee.controller');
// Retrieve all employees
router.get('/testing', employeeController.test);
router.get('/find', employeeController.findAll);
router.post('/', employeeController.create);
module.exports = router