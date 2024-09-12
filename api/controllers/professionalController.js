const Professional = require('../models/professionalModel');

// Create a new professional
exports.createProfessional = async (req, res) => {
	try {
		const newProfessional = new Professional(req.body);
		const savedProfessional = await newProfessional.save();
		res.status(201).json(savedProfessional);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Get all professionals
exports.getAllProfessionals = async (req, res) => {
	try {
		const professionals = await Professional.find({ available: true }).populate(
			'company',
			'name'
		);
		res.json(professionals);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get a specific professional
exports.getProfessional = async (req, res) => {
	try {
		const professional = await Professional.findById(req.params.id).populate(
			'company'
		);
		if (professional == null) {
			return res.status(404).json({ message: 'Professionnel non trouvé' });
		}
		res.json(professional);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Update a professional
exports.updateProfessional = async (req, res) => {
	try {
		const professional = await Professional.findById(req.params.id);
		if (professional == null) {
			return res.status(404).json({ message: 'Professionnel non trouvé' });
		}
		Object.assign(professional, req.body);
		professional.updated_at = new Date();
		const updatedProfessional = await professional.save();
		res.json(updatedProfessional);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Delete a professional (soft delete)
exports.deleteProfessional = async (req, res) => {
	try {
		const professional = await Professional.findById(req.params.id);
		if (professional == null) {
			return res.status(404).json({ message: 'Professionnel non trouvé' });
		}
		professional.available = false;
		professional.updated_at = new Date();
		await professional.save();
		res.json({ message: 'Professionnel supprimé avec succès' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
