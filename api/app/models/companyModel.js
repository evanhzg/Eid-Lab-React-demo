const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
	name: { type: String, required: true },
	size: {
		type: String,
		enum: ['1-10', '11-50', '51-100', '101-500', '501+'],
		required: true,
	},
	type: {
		type: String,
		enum: [
			'Startup',
			'Agence',
			'Grand Groupe',
			'PME',
			'ESN',
			'Fonction publique',
			'Autre',
		],
		required: true,
	},
	acceptsUnsolicited: { type: Boolean, default: false },
	domains: [{ type: String }],
	countries: [{ type: String, required: true }],
	cities: [{ type: String, required: true }],
	description: { type: String, required: true },
	shortDescription: { type: String, required: true },
	logo: { type: String },
	available: { type: Boolean, default: true },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Company', companySchema);
