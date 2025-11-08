const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SOSAlert = sequelize.define('SOSAlert', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  rideId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'ride_id',
    references: {
      model: 'rides',
      key: 'id'
    }
  },
  location: {
    type: DataTypes.STRING(255)
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8)
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8)
  },
  message: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('active', 'resolved', 'false_alarm'),
    defaultValue: 'active'
  },
  resolvedAt: {
    type: DataTypes.DATE,
    field: 'resolved_at'
  }
}, {
  tableName: 'sos_alerts',
  timestamps: true,
  underscored: true
});

module.exports = SOSAlert;
