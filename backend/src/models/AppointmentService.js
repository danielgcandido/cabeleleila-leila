module.exports = (sequelize, DataTypes) => {
  const AppointmentService = sequelize.define('AppointmentService', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'appointments',
        key: 'id',
      },
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id',
      },
    },
    service_status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
      defaultValue: 'pending',
    },
  }, {
    tableName: 'appointment_services',
    timestamps: false,
    underscored: true,
  });

  return AppointmentService;
};
