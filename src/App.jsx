import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorManagement from './pages/admin/DoctorManagement';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import Appointments from './pages/doctor/Appointments';
import Patients from './pages/doctor/Patients';
import AIChecker from './pages/doctor/AIChecker';
import Prescriptions from './pages/doctor/Prescriptions';
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import PatientRegistration from './pages/receptionist/PatientRegistration';
import AppointmentBooking from './pages/receptionist/AppointmentBooking';
import PatientDashboard from './pages/patient/PatientDashboard';
import MedicalHistory from './pages/patient/MedicalHistory';

// Public Route (redirects to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return null;

  if (isAuthenticated) {
    const roleRoutes = {
      admin: '/admin/dashboard',
      doctor: '/doctor/dashboard',
      receptionist: '/receptionist/dashboard',
      patient: '/patient/dashboard',
    };
    return <Navigate to={roleRoutes[user.role] || '/'} replace />;
  }

  return children;
};

// Root Redirect (sends user to right dashboard)
const RootRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const roleRoutes = {
    admin: '/admin/dashboard',
    doctor: '/doctor/dashboard',
    receptionist: '/receptionist/dashboard',
    patient: '/patient/dashboard',
  };

  return <Navigate to={roleRoutes[user.role] || '/login'} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<RootRedirect />} />

          {/* Protected Routes inside Layout */}
          <Route element={<DashboardLayout />}>

            {/* Admin Routes */}
            <Route path="/admin">
              <Route path="dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="doctors" element={<ProtectedRoute allowedRoles={['admin']}><DoctorManagement /></ProtectedRoute>} />
              {/* Shared with other roles but nested under admin conceptually */}
              <Route path="patients" element={<ProtectedRoute allowedRoles={['admin']}><Patients /></ProtectedRoute>} />
              <Route path="appointments" element={<ProtectedRoute allowedRoles={['admin']}><Appointments /></ProtectedRoute>} />
            </Route>

            {/* Doctor Routes */}
            <Route path="/doctor">
              <Route path="dashboard" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
              <Route path="appointments" element={<ProtectedRoute allowedRoles={['doctor']}><Appointments /></ProtectedRoute>} />
              <Route path="patients" element={<ProtectedRoute allowedRoles={['doctor']}><Patients /></ProtectedRoute>} />
              <Route path="prescriptions" element={<ProtectedRoute allowedRoles={['doctor']}><Prescriptions /></ProtectedRoute>} />
              <Route path="ai-checker" element={<ProtectedRoute allowedRoles={['doctor']}><AIChecker /></ProtectedRoute>} />
            </Route>

            {/* Receptionist Routes */}
            <Route path="/receptionist">
              <Route path="dashboard" element={<ProtectedRoute allowedRoles={['receptionist']}><ReceptionistDashboard /></ProtectedRoute>} />
              <Route path="register-patient" element={<ProtectedRoute allowedRoles={['receptionist']}><PatientRegistration /></ProtectedRoute>} />
              <Route path="book-appointment" element={<ProtectedRoute allowedRoles={['receptionist']}><AppointmentBooking /></ProtectedRoute>} />
              <Route path="patients" element={<ProtectedRoute allowedRoles={['receptionist']}><Patients /></ProtectedRoute>} />
            </Route>

            {/* Patient Routes */}
            <Route path="/patient">
              <Route path="dashboard" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>} />
              <Route path="history" element={<ProtectedRoute allowedRoles={['patient']}><MedicalHistory /></ProtectedRoute>} />
            </Route>

          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
