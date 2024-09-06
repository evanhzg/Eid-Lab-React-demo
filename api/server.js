const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbURI =
	'mongodb+srv://admin:admin@cluster0.e94qo0s.mongodb.net/react-saas?retryWrites=true&w=majority';
mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.log('Failed to connect to MongoDB', err));

// Define a simple route
app.get('/', (req, res) => {
	res.send('API is working');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

const studentSchema = new mongoose.Schema({
	name: String,
	username: String,
	email: String,
	phone: String,
});

const Student = mongoose.model('Student', studentSchema);

// Route to get all students
app.get('/students', async (req, res) => {
	try {
		const students = await Student.find();

		const studentsWithNumericIds = students.map((student) => ({
			...student._doc, // Spread existing student data
			numericId: parseInt(student._id.toString().slice(-8), 16),
		}));

		res.json(studentsWithNumericIds);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Route to create a new student
app.post('/students/create', async (req, res) => {
	const student = new Student(req.body);

	try {
		// Save the new student to the database
		const newStudent = await student.save();
		console.log(student._id);

		// Calculate the numericId
		const studentWithNumericId = {
			...newStudent._doc,
			numericId: parseInt(newStudent._id.toString().slice(-8), 16),
		};

		console.log('New Student with numericId:', studentWithNumericId);

		// Respond with the full student object, including the numericId
		res.status(201).json(studentWithNumericId);
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ message: err.message });
	}
});

// Route to update a student
app.put('/students/:id', async (req, res) => {
	try {
		const updatedStudent = await Student.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
			}
		);
		res.json({ student: updatedStudent });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Route to delete a student
app.delete('/students/:id', async (req, res) => {
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
		res.status(500).json({ message: err.message });
	}
});
