const mongoose = require('mongoose');
const Student = require('../models/studentModel');

// Get all students
const getAllStudents = async (req, res) => {
	try {
		const students = await Student.find();
		const studentsWithNumericId = students.map((student, index) => ({
			...student.toObject(),
			numericId: parseInt(student._id.toString().slice(-8), 16),
		}));
		res.status(200).json(studentsWithNumericId);
	} catch (error) {
		console.error('Error fetching students:', error);
		res.status(500).json({ message: 'Server Error', details: error.message });
	}
};

// Get one student
const getStudent = async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({ message: 'Invalid student ID' });
		}

		const student = await Student.findById(req.params.id);
		if (!student) {
			return res.status(404).json({ message: 'Student not found' });
		}

		student.numericId = parseInt(student._id.toString().slice(-8), 16);
		res.status(200).json(student);
	} catch (error) {
		console.error('Error fetching student:', error);
		res.status(500).json({ message: 'Server Error', details: error.message });
	}
};

// Create a new student
const createStudent = async (req, res) => {
	try {
		const student = new Student(req.body);
		const newStudent = await student.save();
		res.status(201).json({
			...newStudent.toObject(),
			created_at: newStudent.createdAt.toISOString(),
			updated_at: newStudent.updatedAt.toISOString(),
		});
	} catch (error) {
		console.error('Error creating student:', error);
		if (error.name === 'ValidationError') {
			return res
				.status(400)
				.json({ message: 'Validation Error', details: error.errors });
		}
		res.status(500).json({ message: 'Server Error', details: error.message });
	}
};

// Update a student
const updateStudent = async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({ message: 'Invalid student ID' });
		}

		const updatedStudent = await Student.findByIdAndUpdate(
			req.params.id,
			{ ...req.body, updatedAt: new Date() },
			{ new: true, runValidators: true }
		);

		if (!updatedStudent) {
			return res.status(404).json({ message: 'Student not found' });
		}

		res.status(200).json({
			...updatedStudent.toObject(),
			created_at: updatedStudent.createdAt.toISOString(),
			updated_at: updatedStudent.updatedAt.toISOString(),
		});
	} catch (error) {
		console.error('Error updating student:', error);
		if (error.name === 'ValidationError') {
			return res
				.status(400)
				.json({ message: 'Validation Error', details: error.errors });
		}
		res.status(500).json({ message: 'Server Error', details: error.message });
	}
};

// Delete a student
const deleteStudent = async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({ message: 'Invalid student ID' });
		}

		const deletedStudent = await Student.findByIdAndDelete(req.params.id);

		if (!deletedStudent) {
			return res.status(404).json({ message: 'Student not found' });
		}

		res.status(204).send();
	} catch (error) {
		console.error('Error deleting student:', error);
		res.status(500).json({ message: 'Server Error', details: error.message });
	}
};

// Soft delete (disable) a student
const disableStudent = async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({ message: 'Invalid student ID' });
		}

		const student = await Student.findById(req.params.id);
		if (!student) {
			return res.status(404).json({ message: 'Student not found' });
		}

		if (student.disabled) {
			return res.status(400).json({ message: 'Student is already disabled' });
		}

		const disabledStudent = await Student.findByIdAndUpdate(
			req.params.id,
			{ updatedAt: new Date(), disabledAt: new Date(), disabled: true },
			{ new: true }
		);

		res.status(200).json({
			...disabledStudent.toObject(),
			updated_at: disabledStudent.updatedAt.toISOString(),
			disabled: disabledStudent.disabled,
			disabled_at: disabledStudent.disabledAt.toISOString(),
		});
	} catch (error) {
		console.error('Error disabling student:', error);
		res.status(500).json({ message: 'Server Error', details: error.message });
	}
};

// Undo a Soft delete (enable) a student
const enableStudent = async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({ message: 'Invalid student ID' });
		}

		const student = await Student.findById(req.params.id);
		if (!student) {
			return res.status(404).json({ message: 'Student not found' });
		}

		if (!student.disabled) {
			return res.status(400).json({ message: 'Student is already enabled' });
		}

		const enabledStudent = await Student.findByIdAndUpdate(
			req.params.id,
			{ updatedAt: new Date(), disabledAt: null, disabled: false },
			{ new: true }
		);

		res.status(200).json({
			...enabledStudent.toObject(),
			updated_at: enabledStudent.updatedAt.toISOString(),
			disabled: enabledStudent.disabled,
			disabled_at: enabledStudent.disabledAt
				? enabledStudent.disabledAt.toISOString()
				: null,
		});
	} catch (error) {
		console.error('Error enabling student:', error);
		res.status(500).json({ message: 'Server Error', details: error.message });
	}
};

module.exports = {
	getAllStudents,
	getStudent,
	createStudent,
	updateStudent,
	deleteStudent,
	disableStudent,
	enableStudent,
};
