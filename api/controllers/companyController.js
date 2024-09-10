const Company = require('../models/companyModel');

// Create a new company
exports.createCompany = async (req, res) => {
	try {
		const newCompany = new Company(req.body);
		const savedCompany = await newCompany.save();
		res.status(201).json(savedCompany);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Get all companies
exports.getAllCompanies = async (req, res) => {
	try {
		const companies = await Company.find({ available: true });
		const companiesWithNumericId = companies.map((company, index) => ({
			...company.toObject(),
			numericId: parseInt(company._id.toString().slice(-8), 16),
		}));
		res.json(companiesWithNumericId);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get a specific company
exports.getCompany = async (req, res) => {
	try {
		const company = await Company.findById(req.params.id);
		if (company == null) {
			return res.status(404).json({ message: 'Entreprise introuvable' });
		}
		company.numericId = parseInt(company._id.toString().slice(-8), 16);
		res.json(company);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Update a company
exports.updateCompany = async (req, res) => {
	try {
		const company = await Company.findById(req.params.id);
		if (company == null) {
			return res.status(404).json({ message: 'Entreprise introuvable' });
		}
		Object.assign(company, req.body);
		company.updatedAt = new Date();
		company.numericId = parseInt(company._id.toString().slice(-8), 16);
		const updatedCompany = await company.save();
		res.json(updatedCompany);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Delete a company (soft delete)
exports.deleteCompany = async (req, res) => {
	try {
		const company = await Company.findById(req.params.id);
		if (company == null) {
			return res.status(404).json({ message: 'Entreprise introuvable' });
		}
		company.available = false;
		company.updatedAt = new Date();
		await company.save();
		res.json({ message: 'Entreprise supprimée avec succès' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
