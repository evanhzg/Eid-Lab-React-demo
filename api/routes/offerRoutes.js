const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');

// Routes for offers
router.post('/', offerController.createOffer);
router.get('/', offerController.getAllOffers);
router.get('/:id', offerController.getOffer);
router.put('/:id', offerController.updateOffer);
router.delete('/:id', offerController.deleteOffer);

module.exports = router;
