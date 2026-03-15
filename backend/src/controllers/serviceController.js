const { Service } = require('../models');
const { success } = require('../utils/apiResponse');

/**
 * GET /api/services
 */
async function listServices(req, res, next) {
  try {
    const services = await Service.findAll({
      where: { active: true },
      order: [['name', 'ASC']],
    });
    return success(res, { services }, 'Serviços listados com sucesso');
  } catch (err) {
    next(err);
  }
}

module.exports = { listServices };
