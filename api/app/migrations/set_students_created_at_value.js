const mongoose = require('mongoose');
const Student = require('../models/studentModel');
const { faker } = require('@faker-js/faker');

mongoose
	.connect(
		'mongodb+srv://admin:admin@cluster0.e94qo0s.mongodb.net/react-saas?retryWrites=true&w=majority'
	)
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => {
		console.error('Error connecting to MongoDB:', err);
		process.exit(1);
	});

const grades = [
	'Bachelor',
	'Licence',
	'Master',
	'DUT',
	'BAC',
	'BTS',
	'Ingénieur',
];

const updateStudents = async () => {
	try {
		const students = await Student.find({});

		for (const student of students) {
			const startDate = new Date('2024-08-01');
			const endDate = new Date('2024-09-13');
			const randomDate = new Date(
				startDate.getTime() +
					Math.random() * (endDate.getTime() - startDate.getTime())
			);

			// Update existing fields if they're missing
			student.first_name = student.first_name || faker.person.firstName();
			student.last_name = student.last_name || faker.person.lastName();
			student.email = student.email || faker.internet.email();
			student.phone = student.phone || faker.phone.number();
			student.country = student.country || faker.location.country();
			student.region = student.region || faker.location.state();
			student.city = student.city || faker.location.city();
			student.school = student.school || faker.company.name() + ' University';
			student.grade = student.grade || faker.helpers.arrayElement(grades);
			student.available =
				student.available !== undefined
					? student.available
					: faker.datatype.boolean();
			student.created_at = student.created_at || randomDate;
			student.updated_at = randomDate;
			student.status = student.status !== undefined ? student.status : true;

			// Remove createdAt if it exists
			if (student.createdAt) {
				student.createdAt = undefined;
			}

			await student.save();
		}

		console.log('Students updated successfully');
	} catch (error) {
		console.error('Error updating students:', error);
	} finally {
		await mongoose.connection.close();
		console.log('MongoDB connection closed');
	}
};

updateStudents();
