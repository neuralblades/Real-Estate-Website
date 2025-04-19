'use strict';

module.exports = (sequelize, DataTypes) => {
  const SavedProperty = sequelize.define('SavedProperty', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Properties',
        key: 'id',
      },
    },
  }, {
    tableName: 'SavedProperties',
  });

  return SavedProperty;
};
