const express = require('express');
const {
	getAllStudents,
	createStudent,
	updateStudent,
	deleteStudent,
} = require('../controllers/studentController');

const router = express.Router();

// Routes for CRUD operations
router.get('/students', getAllStudents);
router.post('/students/create', createStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

module.exports = router;
