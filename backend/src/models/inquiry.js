'use strict';

module.exports = (sequelize, DataTypes) => {
  const Inquiry = sequelize.define('Inquiry', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('new', 'in-progress', 'resolved'),
      defaultValue: 'new',
    },
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
  });

  Inquiry.associate = (models) => {
    Inquiry.belongsTo(models.Property, {
      foreignKey: 'propertyId',
      as: 'property',
    });
    Inquiry.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Inquiry;
};
