const { Faixa, Disco, Genero } = require('../models');

const getAllFaixas = async (req, res) => {
    try {
     
      const faixas = await Faixa.findAll({
        include: [
          {
            model: Disco, 
            attributes: ['id', 'titulo'] 
          },
          {
            model: Genero, 
            attributes: ['id', 'nome'], 
            through: { attributes: [] } 
          }
        ]
      });
  
      if (faixas.length === 0) {
        console.log('Nenhuma faixa encontrada');
      }
  
      res.render('faixas', { faixas });
    } catch (error) {
      console.error(error);  
      res.status(500).send('Erro ao listar faixas');
    }
  };
  

const getFaixaById = async (req, res) => {
    try {
        const faixa = await Faixa.findByPk(req.params.id);
        if (faixa) {
            res.render('faixas/show', { faixa });
        } else {
            res.status(404).send('Faixa não encontrado');
        }
    } catch (error) {
        res.status(500).send('Erro ao exibir faixa');
    }
};

const renderAddFaixaForm = (req, res) => {
    res.render('faixas/new');
};

const addFaixa = async (req, res) => {
    try {
        const { titulo, discoId } = req.body;
        await Faixa.create({ titulo, discoId });
        res.redirect('/faixas');
    } catch (error) {
        res.status(500).send('Erro ao adicionar faixa');
    }
};

const renderEditFaixaForm = async (req, res) => {
    try {
        const faixa = await Faixa.findByPk(req.params.id);
        if (faixa) {
            res.render('faixasEdit', { faixa });
        } else {
            res.status(404).send('Faixa não encontrado');
        }
    } catch (error) {
        res.status(500).send('Erro ao carregar formulário de edição');
    }
};

const updateFaixa = async (req, res) => {
    const method = req.body._method;

    if (method === 'PUT') {
        try {
            const { titulo } = req.body;

            const faixa = await Faixa.findByPk(req.params.id);

            if (!faixa) {
                return res.status(404).send('Faixa não encontrada');
            }

            await faixa.update({ titulo });

            return res.redirect('/faixas');
        } catch (error) {
            console.error('Erro ao atualizar faixa:', error);
            return res.status(500).send('Erro ao atualizar a faixa');
        }
    }

    return res.status(405).send('Método não permitido');
};

const deleteFaixa = async (req, res) => {
    const method = req.body._method;

    if (method === 'DELETE') {
        try {
            const faixaId = req.params.id;
            const faixa = await Faixa.findByPk(faixaId);

            if (!faixa) {
                return res.status(404).send('Faixa não encontrada');
            }

            await faixa.destroy();
            return res.redirect('/faixas');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Erro ao excluir a faixa');
        }
    }

    return res.status(405).send('Método não permitido');
};

module.exports = {
    getAllFaixas,
    getFaixaById,
    renderAddFaixaForm,
    addFaixa,
    renderEditFaixaForm,
    updateFaixa,
    deleteFaixa,
};