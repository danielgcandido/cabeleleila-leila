const { Op } = require('sequelize');
const { Appointment, Service, AppointmentService, Client } = require('../models');
const { canModifyOnline, timeToMinutes } = require('../utils/dateUtils');

/**
 * Verifica conflito de horário em uma data
 */
async function hasTimeConflict(appointmentDate, appointmentTime, totalDuration, excludeId = null) {
  const requestedStart = timeToMinutes(appointmentTime);
  const requestedEnd = requestedStart + totalDuration;

  const where = {
    appointment_date: appointmentDate,
    status: { [Op.notIn]: ['cancelled'] },
  };
  if (excludeId) where.id = { [Op.ne]: excludeId };

  const existingAppointments = await Appointment.findAll({ where });

  return existingAppointments.some((appt) => {
    const existStart = timeToMinutes(appt.appointment_time);
    const existEnd = existStart + appt.total_duration_minutes;
    return requestedStart < existEnd && requestedEnd > existStart;
  });
}

/**
 * Busca slots ocupados em uma data
 */
async function getOccupiedSlots(date) {
  const appointments = await Appointment.findAll({
    where: {
      appointment_date: date,
      status: { [Op.notIn]: ['cancelled'] },
    },
    attributes: ['appointment_time', 'total_duration_minutes'],
  });

  return appointments.map((a) => ({
    start: a.appointment_time.substring(0, 5),
    end: (() => {
      const startMin = timeToMinutes(a.appointment_time);
      const endMin = startMin + a.total_duration_minutes;
      const h = Math.floor(endMin / 60).toString().padStart(2, '0');
      const m = (endMin % 60).toString().padStart(2, '0');
      return `${h}:${m}`;
    })(),
  }));
}

/**
 * Cria um novo agendamento
 */
async function createAppointment(clientId, data) {
  const { appointment_date, appointment_time, services: serviceIds, notes } = data;

  // Buscar serviços e calcular duração total
  const services = await Service.findAll({
    where: { id: serviceIds, active: true },
  });

  if (services.length !== serviceIds.length) {
    throw Object.assign(new Error('Um ou mais serviços não encontrados ou inativos'), { statusCode: 400 });
  }

  const totalDuration = services.reduce((sum, s) => sum + s.duration_minutes, 0);

  // Verificar conflito
  const conflict = await hasTimeConflict(appointment_date, appointment_time, totalDuration);
  if (conflict) {
    const occupied = await getOccupiedSlots(appointment_date);
    throw Object.assign(new Error('Conflito de horário. O horário escolhido já está ocupado.'), {
      statusCode: 409,
      data: { occupiedSlots: occupied },
    });
  }

  // Criar agendamento
  const appointment = await Appointment.create({
    client_id: clientId,
    appointment_date,
    appointment_time,
    total_duration_minutes: totalDuration,
    notes: notes || null,
    status: 'pending',
  });

  // Criar associações appointment_services
  await AppointmentService.bulkCreate(
    serviceIds.map((sid) => ({ appointment_id: appointment.id, service_id: sid }))
  );

  return getAppointmentWithDetails(appointment.id);
}

/**
 * Busca agendamento com detalhes (cliente + serviços)
 */
async function getAppointmentWithDetails(appointmentId, clientId = null) {
  const where = { id: appointmentId };
  if (clientId) where.client_id = clientId;

  const appointment = await Appointment.findOne({
    where,
    include: [
      { model: Client, as: 'client', attributes: ['id', 'name', 'email', 'phone'] },
      {
        model: AppointmentService,
        as: 'appointmentServices',
        include: [{ model: Service, as: 'service' }],
      },
    ],
  });

  return appointment;
}

/**
 * Lista agendamentos do cliente com filtros de período
 */
async function getClientAppointments(clientId, filters = {}) {
  const where = { client_id: clientId };

  if (filters.startDate && filters.endDate) {
    where.appointment_date = { [Op.between]: [filters.startDate, filters.endDate] };
  } else if (filters.startDate) {
    where.appointment_date = { [Op.gte]: filters.startDate };
  } else if (filters.endDate) {
    where.appointment_date = { [Op.lte]: filters.endDate };
  }

  if (filters.status) where.status = filters.status;

  return Appointment.findAll({
    where,
    include: [
      {
        model: AppointmentService,
        as: 'appointmentServices',
        include: [{ model: Service, as: 'service' }],
      },
    ],
    order: [['appointment_date', 'DESC'], ['appointment_time', 'DESC']],
  });
}

/**
 * Atualiza um agendamento (com verificação de regra 2 dias para clientes)
 */
async function updateAppointment(appointmentId, clientId, data, isAdmin = false) {
  const where = { id: appointmentId };
  if (!isAdmin) where.client_id = clientId;

  const appointment = await Appointment.findOne({ where });
  if (!appointment) {
    throw Object.assign(new Error('Agendamento não encontrado'), { statusCode: 404 });
  }

  if (['completed', 'cancelled'].includes(appointment.status)) {
    throw Object.assign(new Error('Não é possível alterar um agendamento concluído ou cancelado'), { statusCode: 400 });
  }

  // Regra dos 2 dias (apenas para clientes)
  if (!isAdmin && !canModifyOnline(appointment.appointment_date)) {
    throw Object.assign(
      new Error('Alteração disponível apenas por telefone: (14) 3451-4098'),
      { statusCode: 403, canModifyOnline: false }
    );
  }

  const updateData = {};

  if (data.appointment_date || data.appointment_time) {
    const newDate = data.appointment_date || appointment.appointment_date;
    const newTime = data.appointment_time || appointment.appointment_time;
    let newDuration = appointment.total_duration_minutes;

    if (data.services) {
      const services = await Service.findAll({ where: { id: data.services, active: true } });
      if (services.length !== data.services.length) {
        throw Object.assign(new Error('Um ou mais serviços inválidos'), { statusCode: 400 });
      }
      newDuration = services.reduce((sum, s) => sum + s.duration_minutes, 0);
    }

    const conflict = await hasTimeConflict(newDate, newTime, newDuration, appointmentId);
    if (conflict) {
      const occupied = await getOccupiedSlots(newDate);
      throw Object.assign(new Error('Conflito de horário. O horário escolhido já está ocupado.'), {
        statusCode: 409,
        data: { occupiedSlots: occupied },
      });
    }

    updateData.appointment_date = newDate;
    updateData.appointment_time = newTime;
    updateData.total_duration_minutes = newDuration;
  }

  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.status && isAdmin) updateData.status = data.status;

  await appointment.update(updateData);

  if (data.services) {
    await AppointmentService.destroy({ where: { appointment_id: appointmentId } });
    await AppointmentService.bulkCreate(
      data.services.map((sid) => ({ appointment_id: appointmentId, service_id: sid }))
    );
  }

  return getAppointmentWithDetails(appointmentId);
}

/**
 * Cancela um agendamento
 */
async function cancelAppointment(appointmentId, clientId, isAdmin = false) {
  const where = { id: appointmentId };
  if (!isAdmin) where.client_id = clientId;

  const appointment = await Appointment.findOne({ where });
  if (!appointment) {
    throw Object.assign(new Error('Agendamento não encontrado'), { statusCode: 404 });
  }

  if (appointment.status === 'cancelled') {
    throw Object.assign(new Error('Agendamento já está cancelado'), { statusCode: 400 });
  }

  if (!isAdmin && !canModifyOnline(appointment.appointment_date)) {
    throw Object.assign(
      new Error('Cancelamento disponível apenas por telefone: (14) 3451-4098'),
      { statusCode: 403, canModifyOnline: false }
    );
  }

  await appointment.update({ status: 'cancelled' });
  return appointment;
}

module.exports = {
  createAppointment,
  getAppointmentWithDetails,
  getClientAppointments,
  updateAppointment,
  cancelAppointment,
  hasTimeConflict,
  getOccupiedSlots,
};
