'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Disco extends Model {
    static associate(models) {

      Disco.belongsTo(models.Artista, { 
        foreignKey: 'artistaId',
        as: 'artista'
      });

      Disco.hasMany(models.Faixa, { 
        foreignKey: 'discoId',  
        as: 'faixas'  
      });
    }
  }

  Disco.init({
    titulo: DataTypes.STRING,
    ano_lancamento: DataTypes.INTEGER,
    capa: DataTypes.STRING,
    artistaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Disco',
  });
  return Disco;
};