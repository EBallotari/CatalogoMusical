const { Genero } = require('../models');

const getAllGeneros = async (req, res) => {
    try {
        const generos = await Genero.findAll({
            order: [['nome', 'ASC']] 
        });
        res.render('generos', { generos });
    } catch (error) {
        res.status(500).send('Erro ao listar generos');
    }
};

const getGeneroById = async (req, res) => {
    try {
        const genero = await Genero.findByPk(req.params.id);
        if (genero) {
            res.render('generos/show', { genero });
        } else {
            res.status(404).send('Genero não encontrado');
        }
    } catch (error) {
        res.status(500).send('Erro ao exibir genero');
    }
};

const renderAddGeneroForm = (req, res) => {
    res.render('generosAdd');
};

const addGenero = async (req, res) => {
    try {
        const { nome } = req.body;
        await Genero.create({ nome });
        res.redirect('/generos');
    } catch (error) {
        res.status(500).send('Erro ao adicionar genero');
    }
};

const renderEditGeneroForm = async (req, res) => {
    try {
        const genero = await Genero.findByPk(req.params.id);
        if (genero) {
            res.render('generosEdit', { genero });
        } else {
            res.status(404).send('Genero não encontrado');
        }
    } catch (error) {
        res.status(500).send('Erro ao carregar formulário de edição');
    }
};

const updateGenero = async (req, res) => {
    const method = req.body._method;

    if (method === 'PUT') {
        try {
            const generoId = req.params.id;
            const novoNome = req.body.nome;

            const genero = await Genero.findByPk(generoId);

            if (!genero) {
                return res.status(404).send('Gênero não encontrado');
            }

            genero.nome = novoNome;
            await genero.save();

            return res.redirect('/generos');
        } catch (error) {
            console.error('Erro ao atualizar gênero:', error);
            return res.status(500).send('Erro ao atualizar o gênero');
        }
    }

    return res.status(405).send('Método não permitido');
};

const deleteGenero = async (req, res) => {
    const method = req.body._method;

    if (method === 'DELETE') {
        try {
            const generoId = req.params.id;

            const genero = await Genero.findByPk(generoId);

            if (!genero) {
                return res.status(404).send('Gênero não encontrado');
            }

            await genero.destroy();

            return res.redirect('/generos');
        } catch (error) {
            console.error('Erro ao excluir gênero:', error);
            return res.status(500).send('Erro ao excluir o gênero');
        }
    }

    return res.status(405).send('Método não permitido');
};


module.exports = {
    getAllGeneros,
    getGeneroById,
    renderAddGeneroForm,
    addGenero,
    renderEditGeneroForm,
    updateGenero,
    deleteGenero
};