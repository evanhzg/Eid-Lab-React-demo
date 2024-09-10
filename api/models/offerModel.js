const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	company: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Company',
		required: true,
	},
	contractType: {
		type: String,
		enum: ['Stage', 'Apprentissage', 'Professionnalisation', 'Freelance'],
		required: true,
	},
	location: { type: String, required: true },
	salary: { type: String },
	requiredSkills: [{ type: String }],
	startDate: { type: Date },
	endDate: { type: Date },
	available: { type: Boolean, default: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Offer', offerSchema);
