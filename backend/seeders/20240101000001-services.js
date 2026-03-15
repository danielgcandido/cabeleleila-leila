'use strict';

module.exports = {
  up: async (queryInterface) => {
    const [existing] = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM services'
    );
    if (existing[0].count > 0) return;

    const now = new Date();
    await queryInterface.bulkInsert('services', [
      { name: 'Corte Feminino',  description: 'Corte com lavagem e finalização',  duration_minutes: 45,  price: 60.00,  active: true, created_at: now },
      { name: 'Corte Masculino', description: 'Corte social ou moderno',           duration_minutes: 30,  price: 35.00,  active: true, created_at: now },
      { name: 'Escova',          description: 'Escova modeladora',                  duration_minutes: 40,  price: 50.00,  active: true, created_at: now },
      { name: 'Coloração',       description: 'Coloração completa',                 duration_minutes: 90,  price: 120.00, active: true, created_at: now },
      { name: 'Hidratação',      description: 'Hidratação profunda',                duration_minutes: 60,  price: 80.00,  active: true, created_at: now },
      { name: 'Manicure',        description: 'Manicure com esmaltação',            duration_minutes: 40,  price: 35.00,  active: true, created_at: now },
      { name: 'Pedicure',        description: 'Pedicure completa',                  duration_minutes: 50,  price: 45.00,  active: true, created_at: now },
      { name: 'Progressiva',     description: 'Escova progressiva',                 duration_minutes: 120, price: 200.00, active: true, created_at: now },
      { name: 'Sobrancelha',     description: 'Design de sobrancelha',              duration_minutes: 20,  price: 25.00,  active: true, created_at: now },
      { name: 'Penteado',        description: 'Penteado para eventos',              duration_minutes: 60,  price: 90.00,  active: true, created_at: now },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('services', null, {});
  },
};
