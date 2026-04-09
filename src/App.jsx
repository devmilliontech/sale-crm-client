import React from 'react'
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from "./pages/Login"
import OTPPage from './pages/OTPPage'

import NotFound from './pages/NotFound'
import AdminDashboard from './pages/admin/Dashboard'
import Dashboard from './pages/Dashboard'
import ClientBoard from './components/specific/ClientBoard'
import ClientList from './components/admin/ClientList '
import AgreementPage from './pages/AgreementPage'
import ManageSales from './components/admin/ManageSales';
import { useSelector } from 'react-redux';
import AgreementReview from './pages/AgreementReview';
import PrivateRoute from './components/common/ProtectRoute';
import Agreements from './components/admin/Agreements';

import AssignAdminPage from './pages/admin/AssignAdminPage';
import {ResetPassword, SendResetLink} from './pages/ForgetPassword';


const App = () => {
  const { loginData } = useSelector(state => state.auth)
  const role = loginData?.role
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<OTPPage />} />
        <Route path="/user-agreement/:id" element={<AgreementReview />} />
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              {role === "admin" ? <AdminDashboard /> : <Dashboard />}
            </PrivateRoute>
          }
        />

        <Route
          path="/send-agreement/:id"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AgreementPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/list-view"
          element={
            <PrivateRoute allowedRoles={["admin", "sales"]}>
              <ClientList />
            </PrivateRoute>
          }
        />

        <Route
          path="/manage-executive"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <ManageSales />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-prospects"
          element={
            <PrivateRoute allowedRoles={["sales", "admin"]}>
              <ClientBoard role={role} />
            </PrivateRoute>
          }
        />

        <Route
          path="/agreements"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Agreements role={role} />
            </PrivateRoute>
          }
        />

        <Route
          path="/assign-admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AssignAdminPage role={role} />
            </PrivateRoute>
          }
        />


        <Route path='/reset-link' element={<SendResetLink/>} />
        <Route path='/reset-password/:token' element={<ResetPassword/>} />
        <Route path="*" element={<NotFound role={role} />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App