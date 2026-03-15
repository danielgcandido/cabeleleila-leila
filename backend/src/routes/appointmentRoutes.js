const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getMyAppointments,
  getSuggestionEndpoint,
  getAppointment,
  updateAppointment,
  cancelAppointment,
} = require('../controllers/appointmentController');
const auth = require('../middlewares/auth');
const { appointmentValidators } = require('../middlewares/validators/appointmentValidator');

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Agendamentos do cliente
 */

/**
 * @swagger
 * /appointments/suggestion:
 *   get:
 *     summary: Sugestão de data para novo agendamento (mesma semana)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *         description: Data de referência (YYYY-MM-DD)
 *     responses:
 *       200: { description: Sugestão retornada }
 */
router.get('/suggestion', auth, getSuggestionEndpoint);

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Criar agendamento (1+ serviços)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [appointment_date, appointment_time, services]
 *             properties:
 *               appointment_date: { type: string, format: date }
 *               appointment_time: { type: string, example: "09:00" }
 *               services: { type: array, items: { type: integer }, example: [1, 3] }
 *               notes: { type: string }
 *     responses:
 *       201: { description: Agendamento criado }
 *       409: { description: Conflito de horário }
 */
router.post('/', auth, appointmentValidators, createAppointment);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Meus agendamentos (com filtro de período)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, confirmed, completed, cancelled] }
 *     responses:
 *       200: { description: Lista de agendamentos }
 */
router.get('/', auth, getMyAppointments);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Detalhes de um agendamento
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Agendamento encontrado }
 *       404: { description: Não encontrado }
 */
router.get('/:id', auth, getAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Alterar agendamento (regra 2 dias)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Agendamento atualizado }
 *       403: { description: Fora da janela de 2 dias }
 */
router.put('/:id', auth, updateAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Cancelar agendamento (regra 2 dias)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Agendamento cancelado }
 *       403: { description: Fora da janela de 2 dias }
 */
router.delete('/:id', auth, cancelAppointment);

module.exports = router;
