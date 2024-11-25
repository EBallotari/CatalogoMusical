const { Artista, Disco, Genero, ArtistaGenero, sequelize } = require('../models');
const path = require('path');

const getAllArtistas = async (req, res) => {
    try {
        const artistas = await Artista.findAll({
            order: [['nome', 'ASC']] 
        });
        res.render('artistas', { artistas });
    } catch (error) {
        res.status(500).send('Erro ao listar artistas');
    }
};

const getArtistaById = async (req, res) => {
    try {
        const { id } = req.params;
        const artista = await Artista.findByPk(id, {
            include: [
                {
                    model: Disco,
                    as: 'discos',
                    attributes: ['id', 'titulo']
                },
                {
                    model: Genero,
                    as: 'generos',  
                    attributes: ['id', 'nome']
                }
            ]
        });

        if (!artista) {
            return res.status(404).send('Artista não encontrado');
        }

        res.render('artista', { artista });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar artista');
    }
};

const renderAddArtistaForm = async (req, res) => {
    try {
      const generos = await Genero.findAll(); 
      res.render('artistasAdd', { generos }); 
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao carregar o formulário de adição');
    }
  };

const addArtista = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { nome, nacionalidade, generos } = req.body;
  
      const foto = req.file
        ? req.file.path.replace(/\\/g, '/').replace('public/', '')
        : null;
  
      const novoArtista = await Artista.create(
        { nome, nacionalidade, foto },
        { transaction }
      );
  
      if (generos && generos.length > 0) {
        const generosArray = Array.isArray(generos) ? generos : [generos];
        const artistaGeneros = generosArray.map((generoId) => ({
          artistaId: novoArtista.id,
          generoId,
        }));
        await ArtistaGenero.bulkCreate(artistaGeneros, { transaction });
      }
  
      await transaction.commit();
      res.redirect('/artistas');
    } catch (error) {
      await transaction.rollback(); 
      console.error(error); 
      res.status(500).send('Erro ao adicionar artista');
    }
  };
  

const renderEditArtistaForm = async (req, res) => {
    try {
        const artista = await Artista.findByPk(req.params.id);
        if (artista) {
            res.render('artistasEdit', { artista });
        } else {
            res.status(404).send('Artista não encontrado');
        }
    } catch (error) {
        res.status(500).send('Erro ao carregar formulário de edição');
    }
};

const updateDadosArtista = async (req, res) => {
    const method = req.body._method;

    if (method === 'PUT') {
        try {
            const artistaId = req.params.id;

            const artista = await Artista.findByPk(artistaId);

            if (!artista) {
                return res.status(404).send('Artista não encontrado');
            }

            const { nome, nacionalidade } = req.body;

            await artista.update({
                nome: nome || artista.nome,
                nacionalidade: nacionalidade || artista.nacionalidade
            });

            return res.redirect(`/artistas/${artistaId}/edit`);
        } catch (error) {
            console.error('Erro ao atualizar artista:', error);
            return res.status(500).send('Erro ao atualizar o artista');
        }
    }

    return res.status(405).send('Método não permitido');
};

const updateFotoArtista = async (req, res) => {
    const method = req.body._method;

    if (method === 'PUT') {
        try {
            const artistaId = req.params.id;

            const artista = await Artista.findByPk(artistaId);

            if (!artista) {
                return res.status(404).send('Artista não encontrado');
            }

            if (req.file) {
                const caminhoAntigo = artista.foto;
                if (caminhoAntigo) {
                    const caminhoArquivoAntigo = path.join(__dirname, '..', 'public', caminhoAntigo);
                    if (fs.existsSync(caminhoArquivoAntigo)) {
                        fs.unlinkSync(caminhoArquivoAntigo);
                    }
                }

                const foto = req.file ? req.file.path.replace(/\\/g, '/').replace('public/', '') : null;

                await artista.update({ foto });
            }

            return res.redirect(`/artistas/${artistaId}/edit`);

        } catch (error) {
            console.error('Erro ao atualizar a foto do artista:', error);
            return res.status(500).send('Erro ao atualizar a foto');
        }
    }

    return res.status(405).send('Método não permitido');
};

const fs = require('fs'); 

const deleteArtista = async (req, res) => {
    try {
        const artistaId = req.params.id;

        const artista = await Artista.findByPk(artistaId);

        if (!artista) {
            return res.status(404).send('Artista não encontrado');
        }

        if (artista.capa) {
            fs.unlink(`public/${artista.capa}`, (err) => {
                if (err) {
                    console.error(`Erro ao excluir a capa do artista: ${err}`);
                }
            });
        }

        await artista.destroy();

        return res.redirect('/artistas');
    } catch (error) {
        console.error('Erro ao excluir artista:', error);
        return res.status(500).send('Erro ao excluir o artista');
    }
};

module.exports = {
    getAllArtistas,
    getArtistaById,
    renderAddArtistaForm,
    addArtista,
    renderEditArtistaForm,
    updateDadosArtista,
    updateFotoArtista,
    deleteArtista
};