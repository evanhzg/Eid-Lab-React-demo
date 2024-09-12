const Offer = require('../models/offerModel');

// Create a new offer
exports.createOffer = async (req, res) => {
	try {
		const newOffer = new Offer(req.body);
		const savedOffer = await newOffer.save();
		res.status(201).json(savedOffer);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Get all offers
exports.getAllOffers = async (req, res) => {
	try {
		const offers = await Offer.find({ available: true }).populate(
			'company',
			'name'
		);
		res.json(offers);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get a specific offer
exports.getOffer = async (req, res) => {
	try {
		const offer = await Offer.findById(req.params.id).populate('company');
		if (offer == null) {
			return res.status(404).json({ message: 'Offre non trouvée' });
		}
		res.json(offer);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Update an offer
exports.updateOffer = async (req, res) => {
	try {
		const offer = await Offer.findById(req.params.id);
		if (offer == null) {
			return res.status(404).json({ message: 'Offre non trouvée' });
		}
		Object.assign(offer, req.body);
		offer.updated_at = new Date();
		const updatedOffer = await offer.save();
		res.json(updatedOffer);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Delete an offer (soft delete)
exports.deleteOffer = async (req, res) => {
	try {
		const offer = await Offer.findById(req.params.id);
		if (offer == null) {
			return res.status(404).json({ message: 'Offre non trouvée' });
		}
		offer.available = false;
		offer.updated_at = new Date();
		await offer.save();
		res.json({ message: 'Offre supprimée avec succès' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
