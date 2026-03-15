'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      appointment_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      appointment_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      total_duration_minutes: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        defaultValue: 'pending',
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('appointments', ['client_id', 'appointment_date'], {
      name: 'idx_client_date',
    });
    await queryInterface.addIndex('appointments', ['appointment_date', 'appointment_time'], {
      name: 'idx_date_time',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('appointments');
  },
};
