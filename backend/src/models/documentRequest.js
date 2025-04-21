'use strict';

module.exports = (sequelize, DataTypes) => {
  const DocumentRequest = sequelize.define('DocumentRequest', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    propertyTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    requestType: {
      type: DataTypes.ENUM('brochure', 'floorplan'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'sent', 'completed'),
      defaultValue: 'pending'
    }
  }, {
    timestamps: true
  });

  DocumentRequest.associate = (models) => {
    // Associate with Property model
    DocumentRequest.belongsTo(models.Property, {
      foreignKey: 'propertyId',
      as: 'property'
    });
  };

  return DocumentRequest;
};
