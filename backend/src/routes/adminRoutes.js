const express = require('express');
const router = express.Router();
const {
  listAllAppointments,
  getAppointment,
  adminUpdateAppointment,
  confirmAppointment,
  updateServiceStatus,
  getWeeklyDashboardEndpoint,
} = require('../controllers/adminController');
const auth = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');

const adminOnly = [auth, roleGuard('admin')];

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Painel administrativo
 */

/**
 * @swagger
 * /admin/appointments:
 *   get:
 *     summary: Listar todos os agendamentos (com filtros)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: clientName
 *         schema: { type: string }
 *     responses:
 *       200: { description: Lista de todos os agendamentos }
 */
router.get('/appointments', adminOnly, listAllAppointments);
router.get('/appointments/:id', adminOnly, getAppointment);

/**
 * @swagger
 * /admin/appointments/{id}:
 *   put:
 *     summary: Alterar agendamento de cliente (sem regra 2 dias)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Agendamento atualizado }
 */
router.put('/appointments/:id', adminOnly, adminUpdateAppointment);

/**
 * @swagger
 * /admin/appointments/{id}/confirm:
 *   patch:
 *     summary: Confirmar agendamento
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Agendamento confirmado }
 */
router.patch('/appointments/:id/confirm', adminOnly, confirmAppointment);

/**
 * @swagger
 * /admin/appointments/{id}/services/{sid}/status:
 *   patch:
 *     summary: Atualizar status individual de serviço
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: sid
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *     responses:
 *       200: { description: Status atualizado }
 */
router.patch('/appointments/:id/services/:sid/status', adminOnly, updateServiceStatus);

/**
 * @swagger
 * /admin/dashboard/weekly:
 *   get:
 *     summary: Métricas semanais de desempenho
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *     responses:
 *       200: { description: Dados do dashboard semanal }
 */
router.get('/dashboard/weekly', adminOnly, getWeeklyDashboardEndpoint);

module.exports = router;
