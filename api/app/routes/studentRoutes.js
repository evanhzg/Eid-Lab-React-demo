const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Define the /students route
router.get('/', studentController.getAllStudents);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
