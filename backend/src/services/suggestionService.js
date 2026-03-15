const { Op } = require('sequelize');
const { Appointment } = require('../models');
const { getWeekBounds, formatDatePtBR } = require('../utils/dateUtils');
const { getOccupiedSlots } = require('./appointmentService');

/**
 * Retorna sugestão de data para o cliente com base nos agendamentos da semana
 */
async function getSuggestion(clientId, targetDate, excludeId = null) {
  const { startOfWeek, endOfWeek } = getWeekBounds(targetDate);

  const where = {
    client_id: clientId,
    appointment_date: { [Op.between]: [startOfWeek, endOfWeek] },
    status: { [Op.ne]: 'cancelled' },
  };

  if (excludeId) {
    where.id = { [Op.ne]: excludeId };
  }

  const existing = await Appointment.findOne({
    where,
    order: [['appointment_date', 'ASC']],
  });

  if (!existing) {
    return { hasSuggestion: false };
  }

  const occupiedSlots = await getOccupiedSlots(existing.appointment_date);

  return {
    hasSuggestion: true,
    suggestedDate: existing.appointment_date,
    occupiedSlots,
    message: `Você já tem um agendamento em ${formatDatePtBR(existing.appointment_date)}. Sugerimos agendar na mesma data para sua conveniência.`,
  };
}

module.exports = { getSuggestion };
