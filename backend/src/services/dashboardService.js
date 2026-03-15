const { Op } = require('sequelize');
const { Appointment, AppointmentService, Service, sequelize } = require('../models');
const { getWeekBounds } = require('../utils/dateUtils');
const { format, addDays, parseISO } = require('date-fns');
const { ptBR } = require('date-fns/locale');

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

/**
 * Retorna métricas semanais para o dashboard admin
 */
async function getWeeklyDashboard(targetDate = new Date()) {
  const { startOfWeek, endOfWeek } = getWeekBounds(targetDate);

  const appointments = await Appointment.findAll({
    where: {
      appointment_date: { [Op.between]: [startOfWeek, endOfWeek] },
    },
    include: [
      {
        model: AppointmentService,
        as: 'appointmentServices',
        include: [{ model: Service, as: 'service', attributes: ['id', 'name', 'price'] }],
      },
    ],
  });

  const total = appointments.length;
  const completed = appointments.filter((a) => a.status === 'completed').length;
  const cancelled = appointments.filter((a) => a.status === 'cancelled').length;
  const pending = appointments.filter((a) => a.status === 'pending').length;
  const confirmed = appointments.filter((a) => a.status === 'confirmed').length;

  // Receita (apenas agendamentos concluídos)
  let revenue = 0;
  const serviceCount = {};

  for (const appt of appointments) {
    if (appt.status === 'completed') {
      for (const as of appt.appointmentServices) {
        const price = parseFloat(as.service.price);
        revenue += price;
        if (!serviceCount[as.service.name]) {
          serviceCount[as.service.name] = { count: 0, revenue: 0 };
        }
        serviceCount[as.service.name].count++;
        serviceCount[as.service.name].revenue += price;
      }
    }
  }

  const topServices = Object.entries(serviceCount)
    .map(([name, data]) => ({ name, ...data, revenue: parseFloat(data.revenue.toFixed(2)) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Breakdown diário
  const dailyBreakdown = [];
  let cursor = parseISO(startOfWeek);
  const end = parseISO(endOfWeek);

  while (cursor <= end) {
    const dateStr = format(cursor, 'yyyy-MM-dd');
    const dayAppts = appointments.filter((a) => a.appointment_date === dateStr);
    const dayRevenue = dayAppts
      .filter((a) => a.status === 'completed')
      .reduce((sum, a) => {
        return sum + a.appointmentServices.reduce((s, as) => s + parseFloat(as.service.price), 0);
      }, 0);

    dailyBreakdown.push({
      day: DAY_NAMES[cursor.getDay()],
      date: dateStr,
      count: dayAppts.length,
      revenue: parseFloat(dayRevenue.toFixed(2)),
    });

    cursor = addDays(cursor, 1);
  }

  return {
    period: { start: startOfWeek, end: endOfWeek },
    totalAppointments: total,
    completedAppointments: completed,
    cancelledAppointments: cancelled,
    pendingAppointments: pending,
    confirmedAppointments: confirmed,
    revenue: parseFloat(revenue.toFixed(2)),
    topServices,
    dailyBreakdown,
  };
}

module.exports = { getWeeklyDashboard };
