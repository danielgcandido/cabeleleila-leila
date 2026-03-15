const express = require('express');
const router = express.Router();
const { listServices } = require('../controllers/serviceController');

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Serviços disponíveis
 */

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Lista serviços ativos
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Lista de serviços
 */
router.get('/', listServices);

module.exports = router;
