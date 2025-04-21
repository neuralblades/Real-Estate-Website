'use strict';

module.exports = (sequelize, DataTypes) => {
  const OffplanInquiry = sequelize.define('OffplanInquiry', {
    name: {
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
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    preferredLanguage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'english'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    interestedInMortgage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    propertyTitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('new', 'in-progress', 'resolved'),
      defaultValue: 'new'
    }
  }, {
    timestamps: true
  });

  OffplanInquiry.associate = (models) => {
    OffplanInquiry.belongsTo(models.Property, {
      foreignKey: 'propertyId',
      as: 'property'
    });
  };

  return OffplanInquiry;
};
