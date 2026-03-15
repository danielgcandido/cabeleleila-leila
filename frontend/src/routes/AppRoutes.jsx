import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

import LoginPage from '../pages/client/LoginPage';
import RegisterPage from '../pages/client/RegisterPage';
import NewAppointmentPage from '../pages/client/NewAppointmentPage';
import MyAppointmentsPage from '../pages/client/MyAppointmentsPage';
import AppointmentDetailPage from '../pages/client/AppointmentDetailPage';
import EditAppointmentPage from '../pages/client/EditAppointmentPage';

import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminAppointmentsPage from '../pages/admin/AdminAppointmentsPage';
import AdminEditAppointmentPage from '../pages/admin/AdminEditAppointmentPage';
import DashboardPage from '../pages/admin/DashboardPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Rotas do cliente */}
      <Route element={<PrivateRoute />}>
        <Route path="/agendamentos" element={<MyAppointmentsPage />} />
        <Route path="/agendamentos/novo" element={<NewAppointmentPage />} />
        <Route path="/agendamentos/:id" element={<AppointmentDetailPage />} />
        <Route path="/agendamentos/:id/editar" element={<EditAppointmentPage />} />
      </Route>

      {/* Rotas admin */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/agendamentos" element={<AdminAppointmentsPage />} />
        <Route path="/admin/agendamentos/:id/editar" element={<AdminEditAppointmentPage />} />
        <Route path="/admin/dashboard" element={<DashboardPage />} />
      </Route>

      {/* Redirect */}
      <Route path="/" element={<Navigate to="/agendamentos" replace />} />
      <Route path="*" element={<Navigate to="/agendamentos" replace />} />
    </Routes>
  );
}
