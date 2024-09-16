const mongoose = require('mongoose');
const Student = require('../models/studentModel');

mongoose
	.connect(
		'mongodb+srv://admin:admin@cluster0.e94qo0s.mongodb.net/react-saas?retryWrites=true&w=majority',
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => {
		console.error('Error connecting to MongoDB:', err);
		process.exit(1);
	});

const removeAllStudents = async () => {
	try {
		const result = await Student.deleteMany({});
		console.log(`Deleted ${result.deletedCount} students`);
	} catch (error) {
		console.error('Error removing students:', error);
	} finally {
		await mongoose.connection.close();
		console.log('MongoDB connection closed');
	}
};

removeAllStudents();
