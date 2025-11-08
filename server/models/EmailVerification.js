const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmailVerification = sequelize.define('EmailVerification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  otp: {
    type: DataTypes.STRING(6),
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expires_at'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_verified'
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'email_verifications',
  timestamps: true,
  underscored: true
});

module.exports = EmailVerification;
