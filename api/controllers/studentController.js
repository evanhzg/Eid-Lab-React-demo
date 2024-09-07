const Student = require('../models/studentModel');

// Get all students
const getAllStudents = async (req, res) => {
	try {
		const students = await Student.find();
		const studentsWithNumericId = students.map((student, index) => ({
			...student.toObject(),
			numericId: parseInt(student._id.toString().slice(-8), 16),
		}));
		res.json(studentsWithNumericId);
	} catch (error) {
		console.error('Error fetching students:', error);
		res.status(500).json({ message: 'Server Error' });
	}
};

// Create a new student
const createStudent = async (req, res) => {
	try {
		const student = new Student(req.body);
		const newStudent = await student.save();

		// Add numericId to the created student
		const studentWithNumericId = {
			...newStudent._doc,
			numericId: parseInt(newStudent._id.toString().slice(-8), 16),
		};

		res.status(201).json(studentWithNumericId);
	} catch (err) {
		res
			.status(400)
			.json({ message: 'Error creating student', error: err.message });
	}
};

// Update a student
const updateStudent = async (req, res) => {
	try {
		const updatedStudent = await Student.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		res.json(updatedStudent);
	} catch (error) {
		console.error('Error updating student:', error);
		res.status(500).json({ message: 'Server Error' });
	}
};

// Delete a student
const deleteStudent = async (req, res) => {
	try {
		await Student.findByIdAndDelete(req.params.id);
		res.status(204).send();
	} catch (error) {
		console.error('Error deleting student:', error);
		res.status(500).json({ message: 'Server Error' });
	}
};

module.exports = {
	getAllStudents,
	createStudent,
	updateStudent,
	deleteStudent,
};
