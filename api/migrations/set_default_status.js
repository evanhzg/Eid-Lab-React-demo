const mongoose = require('mongoose');
const Student = require('../models/studentModel');

const uri =
	'mongodb+srv://admin:admin@cluster0.e94qo0s.mongodb.net/react-saas?retryWrites=true&w=majority';
mongoose.connect(uri);

// Set default status for students
const setDefaultStatus = async () => {
	try {
		const result = await Student.updateMany(
			{ status: { $exists: false } },
			{ $set: { status: true } }
		);
		console.log(`Set default status for ${result.nModified} students.`);
	} catch (error) {
		console.error('Error setting default status for students:', error);
	} finally {
		mongoose.connection.close();
	}
};

setDefaultStatus();
