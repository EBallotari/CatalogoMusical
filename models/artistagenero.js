'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ArtistaGenero extends Model {
    static associate(models) {
      ArtistaGenero.belongsTo(models.Artista, {
        foreignKey: 'artistaId',
        as: 'artista',
      });

      ArtistaGenero.belongsTo(models.Genero, {
        foreignKey: 'generoId',
        as: 'genero',
      });
    }
  }

  ArtistaGenero.init(
    {
      artistaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Artistas', 
          key: 'id',
        },
      },
      generoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Generos', 
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'ArtistaGenero',
      timestamps: true, 
      tableName: 'ArtistaGeneros', 

    }
  );

  return ArtistaGenero;
};