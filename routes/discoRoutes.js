const express = require('express');
const router = express.Router();
const discoController = require('../controllers/discoController');
const upload = require('../middlewares/upload');

router.get('/', discoController.getAllDiscos);

router.get('/add', discoController.renderAddDiscoForm);

router.post('/add', upload.single('capa'), discoController.addDisco);

router.get('/:id', discoController.getDiscoById);

router.get('/:id/edit', discoController.renderEditDiscoForm);

router.post('/:id/edit/dados', discoController.updateNomeAnoDisco)

router.post('/:id/edit/capa', upload.single('capa'), discoController.updateCapa);

router.post('/:id', discoController.deleteDisco);

module.exports = router;