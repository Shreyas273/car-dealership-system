import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminRoute } from '../components/AdminRoute';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { MainLayout } from '../layouts/MainLayout';
import { AddVehicle } from '../pages/AddVehicle';
import { AdminDashboard } from '../pages/AdminDashboard';
import { Dashboard } from '../pages/Dashboard';
import { EditVehicle } from '../pages/EditVehicle';
import { Login } from '../pages/Login';
import { NotFound } from '../pages/NotFound';
import { Register } from '../pages/Register';
import { Search } from '../pages/Search';
import { VehicleDetails } from '../pages/VehicleDetails';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="search" element={<Search />} />
            <Route path="vehicles/:id" element={<VehicleDetails />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/vehicles/new" element={<AddVehicle />} />
            <Route path="admin/vehicles/:id/edit" element={<EditVehicle />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
