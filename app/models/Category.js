const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    CotegoryId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    CategoryName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  });
  Category.associate = (models) => {
    Category.hasMany(models.BlogPost, {
      foreignKey: 'CategoryId', 
      onDelete: "cascade",
    });
  };
return Category;
};


