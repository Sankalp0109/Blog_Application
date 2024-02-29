const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define("Admin", {
    AdminId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
  Admin.associate = (models) => {
    Admin.hasMany(models.BlogPost, {
      onDelete: "cascade",
    });
    // Admin.hasMany(models.AuditLog, { 
    //   foreignKey: 'UserId', as: 'Logs' 
    // });
  };

  return Admin;
};


