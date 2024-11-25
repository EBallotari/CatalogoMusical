'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FaixaGenero extends Model {
    static associate(models) {
      FaixaGenero.belongsTo(models.Faixa, { foreignKey: 'faixaId', as: 'faixa' });

      FaixaGenero.belongsTo(models.Genero, { foreignKey: 'generoId', as: 'genero' });
    }
  }

  FaixaGenero.init({
    faixaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Faixas',
        key: 'id'
      }
    },
    generoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Generos', 
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'FaixaGenero',
  });

  return FaixaGenero;
};