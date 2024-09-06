const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
	name: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	phone: { type: String, required: true },
});

module.exports = mongoose.model('Student', studentSchema);
