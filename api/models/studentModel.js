const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	phone: { type: String, required: true },
	country: { type: String, required: true },
	region: { type: String, required: true },
	city: { type: String, required: true },
	school: { type: String, required: true },
	grade: { type: String, required: true },
	available: { type: Boolean, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Student', studentSchema);
