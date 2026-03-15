const { Op } = require('sequelize');
const { Appointment, Client, Service, AppointmentService } = require('../models');
const appointmentService = require('../services/appointmentService');
const { getWeeklyDashboard } = require('../services/dashboardService');
const { success, error } = require('../utils/apiResponse');

/**
 * GET /api/admin/appointments
 */
async function listAllAppointments(req, res, next) {
  try {
    const { status, date, clientName, startDate, endDate } = req.query;
    const where = {};

    if (status) where.status = status;
    if (date) where.appointment_date = date;
    if (startDate && endDate) where.appointment_date = { [Op.between]: [startDate, endDate] };

    const clientWhere = {};
    if (clientName) clientWhere.name = { [Op.like]: `%${clientName}%` };

    const appointments = await Appointment.findAll({
      where,
      include: [
        { model: Client, as: 'client', where: Object.keys(clientWhere).length ? clientWhere : undefined, attributes: ['id', 'name', 'email', 'phone'] },
        {
          model: AppointmentService,
          as: 'appointmentServices',
          include: [{ model: Service, as: 'service' }],
        },
      ],
      order: [['appointment_date', 'DESC'], ['appointment_time', 'ASC']],
    });

    return success(res, { appointments }, 'Agendamentos listados com sucesso');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/appointments/:id
 */
async function getAppointment(req, res, next) {
  try {
    const appointment = await appointmentService.getAppointmentWithDetails(parseInt(req.params.id));
    if (!appointment) return error(res, 'Agendamento não encontrado', 404);
    return success(res, { appointment }, 'Agendamento obtido com sucesso');
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/appointments/:id
 */
async function adminUpdateAppointment(req, res, next) {
  try {
    const appointment = await appointmentService.updateAppointment(
      parseInt(req.params.id),
      null,
      req.body,
      true
    );
    return success(res, { appointment }, 'Agendamento atualizado com sucesso');
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message, ...(err.data || {}) });
    }
    next(err);
  }
}

/**
 * PATCH /api/admin/appointments/:id/confirm
 */
async function confirmAppointment(req, res, next) {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return error(res, 'Agendamento não encontrado', 404);

    await appointment.update({ status: 'confirmed' });
    return success(res, { appointment }, 'Agendamento confirmado com sucesso');
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/admin/appointments/:id/services/:sid/status
 */
async function updateServiceStatus(req, res, next) {
  try {
    const { id, sid } = req.params;
    const { service_status } = req.body;

    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (!validStatuses.includes(service_status)) {
      return error(res, 'Status inválido', 400);
    }

    const as = await AppointmentService.findOne({
      where: { appointment_id: id, service_id: sid },
    });

    if (!as) return error(res, 'Serviço do agendamento não encontrado', 404);

    await as.update({ service_status });

    // Auto-completar agendamento quando todos os serviços forem concluídos
    if (service_status === 'completed') {
      const allServices = await AppointmentService.findAll({
        where: { appointment_id: id },
      });
      const allCompleted = allServices.every((s) => s.service_status === 'completed');
      if (allCompleted) {
        await Appointment.update({ status: 'completed' }, { where: { id } });
      }
    }

    return success(res, { appointmentService: as }, 'Status do serviço atualizado com sucesso');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/dashboard/weekly
 */
async function getWeeklyDashboardEndpoint(req, res, next) {
  try {
    const { date } = req.query;
    const dashboard = await getWeeklyDashboard(date ? new Date(date) : new Date());
    return success(res, dashboard, 'Dashboard semanal obtido com sucesso');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listAllAppointments,
  getAppointment,
  adminUpdateAppointment,
  confirmAppointment,
  updateServiceStatus,
  getWeeklyDashboardEndpoint,
};
