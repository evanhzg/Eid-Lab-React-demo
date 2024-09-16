const mongoose = require('mongoose');
const Student = require('../models/studentModel');

mongoose
	.connect(
		'mongodb+srv://admin:admin@cluster0.e94qo0s.mongodb.net/react-saas?retryWrites=true&w=majority'
	)
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => {
		console.error('Error connecting to MongoDB:', err);
		process.exit(1);
	});

const removeDateFields = async () => {
	try {
		const result = await Student.updateMany(
			{},
			{ $unset: { createdAt: '', updatedAt: '' } }
		);

		console.log(`Updated ${result.modifiedCount} documents`);
		console.log('createdAt and updatedAt fields removed successfully');
	} catch (error) {
		console.error('Error removing date fields:', error);
	} finally {
		await mongoose.connection.close();
		console.log('MongoDB connection closed');
	}
};

removeDateFields();
