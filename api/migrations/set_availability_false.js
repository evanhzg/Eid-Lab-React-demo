const mongoose = require('mongoose');
const Student = require('../models/studentModel'); // Adjust the path to your Student model

const uri =
	'mongodb+srv://admin:admin@cluster0.e94qo0s.mongodb.net/react-saas?retryWrites=true&w=majority'; // Replace with your MongoDB URI

mongoose.connect(uri);

const setAvailabilityFalse = async () => {
	try {
		const result = await Student.updateMany(
			{ available: { $exists: false } },
			{ $set: { available: false } }
		);
		console.log(`Updated ${result.nModified} students.`);
	} catch (error) {
		console.error('Error updating students:', error);
	} finally {
		mongoose.connection.close();
	}
};

setAvailabilityFalse();
