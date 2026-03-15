import api from './axios';

export const getMyAppointments = (params) => api.get('/appointments', { params });
export const getAppointment = (id) => api.get(`/appointments/${id}`);
export const createAppointment = (data) => api.post('/appointments', data);
export const updateAppointment = (id, data) => api.put(`/appointments/${id}`, data);
export const cancelAppointment = (id) => api.delete(`/appointments/${id}`);
export const getSuggestion = (date, excludeId = null) => api.get('/appointments/suggestion', { params: { date, excludeId } });

// Admin
export const getAdminAppointment = (id) => api.get(`/admin/appointments/${id}`);
export const getAdminAppointments = (params) => api.get('/admin/appointments', { params });
export const adminUpdateAppointment = (id, data) => api.put(`/admin/appointments/${id}`, data);
export const confirmAppointment = (id) => api.patch(`/admin/appointments/${id}/confirm`);
export const updateServiceStatus = (appointmentId, serviceId, service_status) =>
  api.patch(`/admin/appointments/${appointmentId}/services/${serviceId}/status`, { service_status });
export const getWeeklyDashboard = (date) => api.get('/admin/dashboard/weekly', { params: { date } });
