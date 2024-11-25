const express = require('express');
const router = express.Router();
const faixaController = require('../controllers/faixaController');

router.get('/', faixaController.getAllFaixas);

router.post('/', faixaController.addFaixa);

router.get('/:id', faixaController.getFaixaById);

router.get('/:id/edit', faixaController.renderEditFaixaForm);

router.post('/:id/edit', faixaController.updateFaixa);

router.post('/:id', faixaController.deleteFaixa);

module.exports = router;