const express = require('express');
const router = express.Router();
const generoController = require('../controllers/generoController');

router.get('/', generoController.getAllGeneros);

router.get('/add', generoController.renderAddGeneroForm);

router.post('/add', generoController.addGenero);

router.get('/:id', generoController.getGeneroById);

router.get('/:id/edit', generoController.renderEditGeneroForm);

router.post('/:id/edit', generoController.updateGenero);

router.post('/:id', generoController.deleteGenero);

module.exports = router;