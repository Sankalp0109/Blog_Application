const { DataTypes } = require('sequelize');
const { sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
    const AuditLog = sequelize.define('AuditLog', {
        LogId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        UserEmail: {
            type: DataTypes.STRING,
        },
        Action: {
            type: DataTypes.STRING,
        },
        PostId: {
            type: DataTypes.INTEGER,
        },
    });
    // AuditLog.associate = (models) => {
    //     AuditLog.belongsTo(models.Admin, { foreignKey: 'UserId', as: 'User' });
    // };
    return AuditLog;
}