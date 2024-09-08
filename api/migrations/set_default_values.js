const mongoose = require('mongoose');
const Student = require('../models/studentModel'); // Adjust the path to your Student model

const uri =
	'mongodb+srv://admin:admin@cluster0.e94qo0s.mongodb.net/react-saas?retryWrites=true&w=majority'; // Replace with your MongoDB URI

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const setDefaultValues = async () => {
	try {
		const now = new Date();
		const result = await Student.updateMany(
			{
				$or: [
					{ createdAt: { $exists: false } },
					{ updatedAt: { $exists: false } },
					{ first_name: { $exists: false } },
					{ last_name: { $exists: false } },
					{ country: { $exists: false } },
					{ region: { $exists: false } },
					{ city: { $exists: false } },
					{ school: { $exists: false } },
				],
			},
			{
				$set: {
					createdAt: now,
					updatedAt: now,
					first_name: 'test',
					last_name: 'test',
					country: 'test',
					region: 'test',
					city: 'test',
					school: 'test',
				},
			}
		);
		console.log(`Updated ${result.nModified} students.`);
	} catch (error) {
		console.error('Error updating students:', error);
	} finally {
		mongoose.connection.close();
	}
};

setDefaultValues();
