'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Genero extends Model {
    static associate(models) {
      Genero.belongsToMany(models.Artista, {
        through: models.ArtistaGenero,
        foreignKey: 'generoId',
        otherKey: 'artistaId'
      });

      Genero.belongsToMany(models.Faixa, {
        through: models.FaixaGenero,
        foreignKey: 'generoId',
        otherKey: 'faixaId'
      });
    }
  }

  Genero.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Genero',
  });

  return Genero;
};