const appointmentService = require('../services/appointmentService');
const { getSuggestion } = require('../services/suggestionService');
const { success, error } = require('../utils/apiResponse');

/**
 * POST /api/appointments
 */
async function createAppointment(req, res, next) {
  try {
    const appointment = await appointmentService.createAppointment(req.user.id, req.body);
    return success(res, { appointment }, 'Agendamento criado com sucesso', 201);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        ...(err.data || {}),
        ...(err.canModifyOnline !== undefined ? { canModifyOnline: err.canModifyOnline } : {}),
      });
    }
    next(err);
  }
}

/**
 * GET /api/appointments
 */
async function getMyAppointments(req, res, next) {
  try {
    const { startDate, endDate, status } = req.query;
    const appointments = await appointmentService.getClientAppointments(req.user.id, { startDate, endDate, status });
    return success(res, { appointments }, 'Agendamentos listados com sucesso');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/appointments/suggestion
 */
async function getSuggestionEndpoint(req, res, next) {
  try {
    const { date, excludeId } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const suggestion = await getSuggestion(req.user.id, targetDate, excludeId ? parseInt(excludeId) : null);
    return success(res, suggestion, 'Sugestão obtida com sucesso');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/appointments/:id
 */
async function getAppointment(req, res, next) {
  try {
    const appointment = await appointmentService.getAppointmentWithDetails(
      parseInt(req.params.id),
      req.user.id
    );
    if (!appointment) return error(res, 'Agendamento não encontrado', 404);
    return success(res, { appointment }, 'Agendamento obtido com sucesso');
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/appointments/:id
 */
async function updateAppointment(req, res, next) {
  try {
    const appointment = await appointmentService.updateAppointment(
      parseInt(req.params.id),
      req.user.id,
      req.body,
      false
    );
    return success(res, { appointment }, 'Agendamento atualizado com sucesso');
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        ...(err.data || {}),
        ...(err.canModifyOnline !== undefined ? { canModifyOnline: err.canModifyOnline } : {}),
      });
    }
    next(err);
  }
}

/**
 * DELETE /api/appointments/:id
 */
async function cancelAppointment(req, res, next) {
  try {
    await appointmentService.cancelAppointment(parseInt(req.params.id), req.user.id, false);
    return success(res, null, 'Agendamento cancelado com sucesso');
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        ...(err.canModifyOnline !== undefined ? { canModifyOnline: err.canModifyOnline } : {}),
      });
    }
    next(err);
  }
}

module.exports = {
  createAppointment,
  getMyAppointments,
  getSuggestionEndpoint,
  getAppointment,
  updateAppointment,
  cancelAppointment,
};
