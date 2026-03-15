module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id',
      },
    },
    appointment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    appointment_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    total_duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'appointments',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['client_id', 'appointment_date'], name: 'idx_client_date' },
      { fields: ['appointment_date', 'appointment_time'], name: 'idx_date_time' },
    ],
  });

  return Appointment;
};
