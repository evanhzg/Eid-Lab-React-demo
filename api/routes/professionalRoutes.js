const express = require('express');
const router = express.Router();
const professionalController = require('../controllers/professionalsController');

// Routes for professionals
router.post('/', professionalController.createProfessional);
router.get('/', professionalController.getAllProfessionals);
router.get('/:id', professionalController.getProfessional);
router.put('/:id', professionalController.updateProfessional);
router.delete('/:id', professionalController.deleteProfessional);

module.exports = router;
