const express = require('express');
const router = express.Router();
const { Disco, Artista } = require('../models');

router.get('/:discoId', async (req, res) => {
  try {
    const disco = await Disco.findByPk(req.params.discoId);
    if (!disco) {
      return res.status(404).send('Disco não encontrado');
    }

    const artistas = await Artista.findAll();  
    res.render('vincularArtista', { disco, artistas });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao carregar o formulário');
  }
});

router.post('/:discoId', async (req, res) => {
  try {
    const { artistaId } = req.body; 

    if (!artistaId) {
      return res.status(400).send('Artista não selecionado');
    }

    const artista = await Artista.findByPk(artistaId); 
    if (!artista) {
      return res.status(404).send('Artista não encontrado');
    }

    const disco = await Disco.findByPk(req.params.discoId);
    if (!disco) {
      return res.status(404).send('Disco não encontrado');
    }

    const updatedDisco = await Disco.update({ artistaId }, { where: { id: req.params.discoId } });

    if (updatedDisco[0] === 0) {
      return res.status(500).send('Falha ao atualizar disco');
    }

    res.redirect('/discos');
  } catch (error) {
    console.error('Erro ao vincular artista:', error);
    res.status(500).send('Erro ao vincular artista');
  }
});


module.exports = router;