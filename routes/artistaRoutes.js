const express = require('express');
const router = express.Router();
const artistaController = require('../controllers/artistaController');
const upload = require('../middlewares/upload');

router.get('/', artistaController.getAllArtistas);

router.get('/add', artistaController.renderAddArtistaForm);

router.post('/add', upload.single('foto'), artistaController.addArtista);

router.get('/:id', artistaController.getArtistaById);

router.get('/:id/edit', artistaController.renderEditArtistaForm);

router.post('/:id/edit/dados', artistaController.updateDadosArtista);

router.post('/:id/edit/foto', upload.single('foto'), artistaController.updateFotoArtista);

router.post('/:id', artistaController.deleteArtista);

module.exports = router;