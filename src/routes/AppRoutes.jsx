// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import MainNavbar from '../components/MainNavbar';
// import Dashboard from '../features/dashboard/Dashboard';
// import AdminUsers from './features/dashboard/AdminUsers';
// import ManagerProjects from './features/dashboard/ManagerProjects';
// import EmployeeTasks from './features/dashboard/EmployeeTasks';
// import EmployeeNotifications from './features/dashboard/EmployeeNotifications';
// import Profile from './features/dashboard/Profile';


// const ProtectedRoute = ({ children }) => {
//   const { user } = useContext(AuthContext);
//   return user ? children : <Navigate to="/login" />;
// };

// function AppRoutes() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/login" element={<Login />} />
//         <Route path="/" element={<Navigate to="/dashboard" replace />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/users" element={<AdminUsers />} />
//         <Route path="/projects" element={<ManagerProjects />} />
//         <Route path="/tasks" element={<EmployeeTasks />} />
//         <Route path="/notifications" element={<EmployeeNotifications />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="*" element={<div>404 Page Not Found</div>} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default AppRoutes;
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainNavbar from '../components/MainNavbar';
import Dashboard from '../features/dashboard/Dashboard';
import AdminUsers from '../features/dashboard/AdminUsers';
import ManagerProjects from '../features/dashboard/ManagerProjects';
import EmployeeTasks from '../features/dashboard/EmployeeTasks';
import EmployeeNotifications from '../features/dashboard/EmployeeNotifications';
import Profile from '../features/dashboard/Profile';
import Login from '../features/auth/Login'; // adjust this import if needed
import { AuthContext } from '../context/AuthContext'; // adjust as needed
import ReportsDashboard from '../features/dashboard/ReportsDashboard';
import RecentActivityFeed from '../features/dashboard/RecentActivityFeed';
// Protected route wrapper for authentication
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <>
      <MainNavbar />
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes for authenticated users */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ManagerProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <EmployeeTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <EmployeeNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
  path="/reports"
  element={
    <ProtectedRoute>
      <ReportsDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/activity"
  element={
    <ProtectedRoute>
      <RecentActivityFeed />
    </ProtectedRoute>
  }
/>
        {/* Catch-all for undefined routes */}
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </>
  );
}

export default AppRoutes;
