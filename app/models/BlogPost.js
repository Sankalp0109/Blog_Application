const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
module.exports = (sequelize, DataTypes) => {
    const BlogPost = sequelize.define("BlogPost", {
        postId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
          },
          title: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          content: {
            type: DataTypes.TEXT,
            allowNull: false,
          },
          tags: {
            type: DataTypes.STRING,
            defaultValue: "",
          },
          CategoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          image: {
            type: DataTypes.STRING, 
            allowNull: true, 
          },
          
    });
    BlogPost.associate = (models) => {
      BlogPost.belongsTo(models.Category, {
        foreignKey: 'CategoryId', 
      });
    };
    
    return BlogPost;
};