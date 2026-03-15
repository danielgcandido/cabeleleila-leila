const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const Client = require('./Client')(sequelize, Sequelize.DataTypes);
const Service = require('./Service')(sequelize, Sequelize.DataTypes);
const Appointment = require('./Appointment')(sequelize, Sequelize.DataTypes);
const AppointmentService = require('./AppointmentService')(sequelize, Sequelize.DataTypes);

// Associations
Client.hasMany(Appointment, { foreignKey: 'client_id', as: 'appointments' });
Appointment.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

Appointment.belongsToMany(Service, {
  through: AppointmentService,
  foreignKey: 'appointment_id',
  otherKey: 'service_id',
  as: 'services',
});
Service.belongsToMany(Appointment, {
  through: AppointmentService,
  foreignKey: 'service_id',
  otherKey: 'appointment_id',
  as: 'appointments',
});

Appointment.hasMany(AppointmentService, { foreignKey: 'appointment_id', as: 'appointmentServices' });
AppointmentService.belongsTo(Appointment, { foreignKey: 'appointment_id' });
AppointmentService.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

module.exports = {
  sequelize,
  Sequelize,
  Client,
  Service,
  Appointment,
  AppointmentService,
};
