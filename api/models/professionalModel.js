const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
	lastName: { type: String, required: true },
	firstName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	phone: { type: String },
	position: { type: String, required: true },
	company: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Company',
		required: true,
	},
	canCreateOffers: { type: Boolean, default: false },
	available: { type: Boolean, default: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Professional', professionalSchema);
