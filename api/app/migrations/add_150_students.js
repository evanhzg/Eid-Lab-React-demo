const mongoose = require('mongoose');
const Student = require('../models/studentModel');
const { faker } = require('@faker-js/faker');

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

const grades = [
	'Bachelor',
	'Licence',
	'Master',
	'DUT',
	'BAC',
	'BTS',
	'Ingénieur',
];

const generateRandomDate = (start, end) => {
	return new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime())
	);
};

const addStudents = async () => {
	try {
		const students = [];
		const startDate = new Date('2024-08-01');
		const endDate = new Date('2024-09-13');

		for (let i = 0; i < 150; i++) {
			const student = {
				first_name: faker.person.firstName(),
				last_name: faker.person.lastName(),
				email: faker.internet.email(),
				phone: faker.phone.number(),
				country: faker.location.country(),
				region: faker.location.state(),
				city: faker.location.city(),
				school: faker.company.name() + ' University',
				grade: faker.helpers.arrayElement(grades),
				available: faker.datatype.boolean(),
				created_at: generateRandomDate(startDate, endDate),
				updated_at: generateRandomDate(startDate, endDate),
				status: true,
			};
			students.push(student);
		}

		const result = await Student.insertMany(students);
		console.log(`Added ${result.length} students`);
	} catch (error) {
		console.error('Error adding students:', error);
	} finally {
		await mongoose.connection.close();
		console.log('MongoDB connection closed');
	}
};

addStudents();
