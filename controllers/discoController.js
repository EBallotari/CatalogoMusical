const { Disco, Faixa, Artista, Genero, FaixaGenero, sequelize } = require('../models');
const path = require('path');

const getAllDiscos = async (req, res) => {
  try {
      const discos = await Disco.findAll({
          include: [
              {
                  model: Artista,
                  as: 'artista', 
                  attributes: ['id', 'nome'] 
              }
          ],

          order: [['titulo', 'ASC']] 
      });

      res.render('discos', { discos });
  } catch (error) {
      console.error(error);  
      res.status(500).send('Erro ao listar discos');
  }
};

const getDiscoById = async (req, res) => {
    const { id } = req.params; 
    try {
      const disco = await Disco.findByPk(id, {
        include: [
          {
            model: Faixa, 
            as: 'faixas',  
            attributes: ['titulo'], 
          },
        ],
      });
  
      if (!disco) {
        return res.status(404).send('Disco não encontrado');
      }
  
      res.render('disco', { disco });
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao buscar o disco');
    }
  };

const renderAddDiscoForm = async (req, res) => {
  try {
      const generos = await Genero.findAll({
        order: [['nome', 'ASC']] 
      }); 
      res.render('addDiscos', { generos }); 
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao carregar o formulário de adição');
    }
};

const addDisco = async (req, res) => {
  const { titulo, ano_lancamento } = req.body;
  const faixas = req.body.faixas || [];
  const faixaGeneros = req.body.faixaGeneros || []; 

  const capa = req.file ? req.file.path.replace(/\\/g, '/').replace('public/', '') : null;

  try {
    const disco = await Disco.create({ 
      titulo, 
      ano_lancamento,
      capa 
    });

    const faixasToCreate = faixas.map(faixaTitulo => ({
      titulo: faixaTitulo,
      discoId: disco.id,
    }));

    const faixasCriadas = await Faixa.bulkCreate(faixasToCreate);

    for (let i = 0; i < faixasCriadas.length; i++) {
      const faixa = faixasCriadas[i];
      const generoId = faixaGeneros[i];

      if (generoId) {
        await FaixaGenero.create({
          faixaId: faixa.id,
          generoId: generoId,
        });
      }
    }

    res.redirect('/discos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao adicionar disco e faixas');
  }
};

const renderEditDiscoForm = async (req, res) => {
    try {
        const disco = await Disco.findByPk(req.params.id);
        const faixas = await Faixa.findAll();
        if (disco) {
            res.render('discosEdit', { disco, faixas });
        } else {
            res.status(404).send('Disco não encontrado');
        }
    } catch (error) {
        res.status(500).send('Erro ao carregar formulário de edição');
    }
};

const updateNomeAnoDisco = async (req, res) => {
  const method = req.body._method;

  if (method === 'PUT') {
      try {
          const discoId = req.params.id;

          const disco = await Disco.findByPk(discoId);

          if (!disco) {
              return res.status(404).send('Disco não encontrado');
          }

          const { titulo, ano_lancamento } = req.body;

          await disco.update({
              titulo: titulo || disco.titulo,
              ano_lancamento: ano_lancamento || disco.ano_lancamento
          });

          return res.redirect(`/discos/${discoId}/edit`);
      } catch (error) {
          console.error('Erro ao atualizar disco:', error);
          return res.status(500).send('Erro ao atualizar o disco');
      }
  }

  return res.status(405).send('Método não permitido');
};

const updateCapa = async (req, res) => {
  const method = req.body._method;

  if (method === 'PUT') {
      try {
          const discoId = req.params.id;

          const disco = await Disco.findByPk(discoId);

          if (!disco) {
              return res.status(404).send('Disco não encontrado');
          }

          if (req.file) {
              const caminhoAntigo = disco.capa;
              if (caminhoAntigo) {
                  const caminhoArquivoAntigo = path.join(__dirname, '..', 'public', caminhoAntigo);
                  if (fs.existsSync(caminhoArquivoAntigo)) {
                      fs.unlinkSync(caminhoArquivoAntigo); 
                  }
              }

              const capa = req.file ? req.file.path.replace(/\\/g, '/').replace('public/', '') : null;

              await disco.update({ capa });
          }

          return res.redirect(`/discos/${discoId}/edit`);

      } catch (error) {
          console.error('Erro ao atualizar a capa do disco:', error);
          return res.status(500).send('Erro ao atualizar a capa');
      }
  }

  return res.status(405).send('Método não permitido');
};

const fs = require('fs'); 

const deleteDisco = async (req, res) => {
    const method = req.body._method;

    if (method === 'DELETE') {
        try {
            const discoId = req.params.id;

            const disco = await Disco.findByPk(discoId);

            if (!disco) {
                return res.status(404).send('Disco não encontrado');
            }

            await Faixa.destroy({
                where: { discoId }
            });

            if (disco.capa) {
                fs.unlink(`public/${disco.capa}`, (err) => {
                    if (err) {
                        console.error(`Erro ao excluir a capa do disco: ${err}`);
                    }
                });
            }

            await disco.destroy();

            return res.redirect('/discos');
        } catch (error) {
            console.error('Erro ao excluir disco:', error);
            return res.status(500).send('Erro ao excluir o disco');
        }
    }

    return res.status(405).send('Método não permitido');
};

module.exports = {
    getAllDiscos,
    getDiscoById,
    renderAddDiscoForm,
    addDisco,
    renderEditDiscoForm,
    updateNomeAnoDisco,
    updateCapa,
    deleteDisco
};