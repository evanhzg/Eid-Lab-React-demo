const mongoose = require('mongoose');
const Professional = require('../models/professionalModel');
const Company = require('../models/companyModel'); // Assuming you have a Company model
const { faker } = require('@faker-js/faker');

mongoose.connect(
	'mongodb+srv://admin:admin@cluster0.e94qo0s.mongodb.net/react-saas?retryWrites=true&w=majority',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

const createProfessionals = async () => {
	try {
		// Get all company IDs
		const companies = await Company.find({}, '_id');
		const companyIds = companies.map((company) => company._id);

		const professionals = [];

		for (let i = 0; i < 100; i++) {
			const startDate = new Date('2024-08-01');
			const endDate = new Date('2024-09-13');
			const randomDate = new Date(
				startDate.getTime() +
					Math.random() * (endDate.getTime() - startDate.getTime())
			);

			professionals.push({
				last_name: faker.person.lastName(),
				first_name: faker.person.firstName(),
				email: faker.internet.email(),
				phone: faker.phone.number(),
				position: faker.person.jobTitle(),
				company: faker.helpers.arrayElement(companyIds),
				can_create_offers: faker.datatype.boolean(),
				available: faker.datatype.boolean(),
				created_at: randomDate,
				updated_at: randomDate,
			});
		}

		await Professional.insertMany(professionals);
		console.log('100 professionals created successfully');
	} catch (error) {
		console.error('Error creating professionals:', error);
	} finally {
		mongoose.connection.close();
	}
};

createProfessionals();
