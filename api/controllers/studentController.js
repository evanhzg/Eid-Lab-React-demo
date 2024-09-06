const Student = require('../models/studentModel');

// Get all students
const getAllStudents = async (req, res) => {
	try {
		console.log('TEST');

		const students = await Student.find();
		console.log('here IT IS');

		// Add a numericId to each student
		const studentsWithNumericIds = students.map((student) => ({
			...student._doc,
			numericId: parseInt(student._id.toString().slice(-8), 16),
		}));

		res.status(200).json(studentsWithNumericIds);
	} catch (err) {
		res
			.status(500)
			.json({ message: 'Error fetching students', error: err.message });
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

		if (!updatedStudent) {
			return res.status(404).json({ message: 'Student not found' });
		}

		res.status(200).json(updatedStudent);
	} catch (err) {
		res
			.status(400)
			.json({ message: 'Error updating student', error: err.message });
	}
};

// Delete a student
const deleteStudent = async (req, res) => {
	try {
		const deletedStudent = await Student.findByIdAndDelete(req.params.id);

		if (!deletedStudent) {
			return res.status(404).json({ message: 'Student not found' });
		}

		res.status(200).json({
			message: 'Student deleted successfully',
			student: deletedStudent,
		});
	} catch (err) {
		res
			.status(500)
			.json({ message: 'Error deleting student', error: err.message });
	}
};

module.exports = {
	getAllStudents,
	createStudent,
	updateStudent,
	deleteStudent,
};
