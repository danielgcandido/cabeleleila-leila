'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    const [existing] = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM clients WHERE email = 'admin@cabeleleila.com'"
    );
    if (existing[0].count > 0) return;

    const now = new Date();
    await queryInterface.bulkInsert('clients', [
      {
        name: 'Leila (Admin)',
        email: 'admin@cabeleleila.com',
        phone: '(14) 3451-4098',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin',
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('clients', { email: 'admin@cabeleleila.com' }, {});
  },
};
