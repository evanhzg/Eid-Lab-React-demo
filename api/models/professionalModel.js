const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
	last_name: { type: String, required: true },
	first_name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	phone: { type: String },
	position: { type: String, required: true },
	company: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Company',
		required: true,
	},
	can_create_offers: { type: Boolean, default: false },
	available: { type: Boolean, default: true },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Professional', professionalSchema);
