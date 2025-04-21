'use strict';

module.exports = (sequelize, DataTypes) => {
  const BlogComment = sequelize.define('BlogComment', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'blog_posts',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    }
  }, {
    tableName: 'blog_comments',
    timestamps: true
  });

  BlogComment.associate = (models) => {
    if (models.BlogPost) {
      BlogComment.belongsTo(models.BlogPost, {
        foreignKey: 'postId',
        as: 'post'
      });
    }

    if (models.User) {
      BlogComment.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  };

  return BlogComment;
};
