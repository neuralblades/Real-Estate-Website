'use strict';

module.exports = (sequelize, DataTypes) => {
  const Property = sequelize.define('Property', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    propertyType: {
      type: DataTypes.ENUM('house', 'apartment', 'condo', 'townhouse', 'land', 'commercial', 'other'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('for-sale', 'for-rent', 'sold', 'rented'),
      allowNull: false,
      defaultValue: 'for-sale',
    },
    isOffplan: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    developerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'developers',
        key: 'id',
      },
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bathrooms: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
    },
    area: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    yearBuilt: {
      type: DataTypes.INTEGER,
    },
    features: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    mainImage: {
      type: DataTypes.STRING,
    },
    headerImage: {
      type: DataTypes.STRING,
    },
    paymentPlan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    agentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Property.associate = (models) => {
    Property.belongsTo(models.User, {
      foreignKey: 'agentId',
      as: 'agent',
    });
    Property.belongsTo(models.Developer, {
      foreignKey: 'developerId',
      as: 'developer',
    });
    Property.hasMany(models.Inquiry, {
      foreignKey: 'propertyId',
      as: 'inquiries',
    });
    Property.belongsToMany(models.User, {
      through: 'SavedProperties',
      foreignKey: 'propertyId',
      as: 'savedByUsers',
    });
  };

  return Property;
};
