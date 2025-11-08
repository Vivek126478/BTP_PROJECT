const sequelize = require('../config/database');
const User = require('./User');
const Ride = require('./Ride');
const RideParticipant = require('./RideParticipant');
const Rating = require('./Rating');
const Complaint = require('./Complaint');
const SOSAlert = require('./SOSAlert');
const EmailVerification = require('./EmailVerification');

// Define associations
User.hasMany(Ride, { foreignKey: 'driverId', as: 'drivenRides' });
Ride.belongsTo(User, { foreignKey: 'driverId', as: 'driver' });

User.hasMany(RideParticipant, { foreignKey: 'riderId', as: 'participations' });
RideParticipant.belongsTo(User, { foreignKey: 'riderId', as: 'rider' });

Ride.hasMany(RideParticipant, { foreignKey: 'rideId', as: 'participants' });
RideParticipant.belongsTo(Ride, { foreignKey: 'rideId', as: 'ride' });

User.hasMany(Rating, { foreignKey: 'raterId', as: 'ratingsGiven' });
User.hasMany(Rating, { foreignKey: 'rateeId', as: 'ratingsReceived' });
Rating.belongsTo(User, { foreignKey: 'raterId', as: 'rater' });
Rating.belongsTo(User, { foreignKey: 'rateeId', as: 'ratee' });
Rating.belongsTo(Ride, { foreignKey: 'rideId', as: 'ride' });

User.hasMany(Complaint, { foreignKey: 'complainantId', as: 'complaintsFiled' });
User.hasMany(Complaint, { foreignKey: 'accusedId', as: 'complaintsReceived' });
Complaint.belongsTo(User, { foreignKey: 'complainantId', as: 'complainant' });
Complaint.belongsTo(User, { foreignKey: 'accusedId', as: 'accused' });
Complaint.belongsTo(Ride, { foreignKey: 'rideId', as: 'ride' });

User.hasMany(SOSAlert, { foreignKey: 'userId', as: 'sosAlerts' });
SOSAlert.belongsTo(User, { foreignKey: 'userId', as: 'user' });
SOSAlert.belongsTo(Ride, { foreignKey: 'rideId', as: 'ride' });

module.exports = {
  sequelize,
  User,
  Ride,
  RideParticipant,
  Rating,
  Complaint,
  SOSAlert,
  EmailVerification
};
