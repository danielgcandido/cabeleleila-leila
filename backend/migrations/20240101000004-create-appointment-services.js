'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('appointment_services', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      appointment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'appointments',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      service_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'services',
          key: 'id',
        },
      },
      service_status: {
        type: Sequelize.ENUM('pending', 'in_progress', 'completed'),
        defaultValue: 'pending',
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('appointment_services');
  },
};
