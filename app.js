const express = require('express');
const path = require('path');
const app = express();
const { sequelize } = require('./models');
const methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

const inicioRoutes = require('./routes/inicioRoutes');
const artistaRoutes = require('./routes/artistaRoutes');
const discoArtistaRoutes = require('./routes/discoArtistaRoutes');
const faixaRoutes = require('./routes/faixaRoutes');
const generoRoutes = require('./routes/generoRoutes');
const discoRoutes = require('./routes/discoRoutes')

sequelize.sync({ force: false }).then(() => {
    console.log('Banco de dados conectado!');
    app.listen(PORT = 3000, () => {
      console.log(`Servidor rodando na porta http://localhost:${PORT}`);
    });
  });

app.use('/', inicioRoutes);
app.use('/artistas', artistaRoutes);
app.use('/discos', discoRoutes);
app.use('/faixas', faixaRoutes);
app.use('/generos', generoRoutes);
app.use('/disco-artista', discoArtistaRoutes)

app.use(express.static(path.join(__dirname, 'public')));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.status(404).send('Página não encontrada!');
});
