'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Artista extends Model {
    static associate(models) {
      Artista.belongsToMany(models.Genero, {
        through: 'ArtistaGenero', 
        as: 'generos', 
        foreignKey: 'artistaId',
        otherKey: 'generoId'
      });

      Artista.hasMany(models.Disco, {
        foreignKey: 'artistaId',
        as: 'discos'
      });
    }
  }

  Artista.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nacionalidade: DataTypes.STRING,
    foto: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Artista',
    tableName: 'Artista',
  });

  return Artista;
};