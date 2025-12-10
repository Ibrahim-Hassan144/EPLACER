import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import PlacementsCS from './pages/PlacementsCS';
import PlacementsInternships from './pages/PlacementsInternships';
import MyApplications from './pages/MyApplications';
import Login from './pages/Login';

import RequireAdmin from "./components/RequireAdmin";
import RequireStudent from "./components/RequireStudent";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminPlacements from "./pages/admin/AdminPlacements";
import AdminUsers from "./pages/admin/AdminUsers";

import InternshipApply from './pages/InternshipApply';

import { AuthProvider, useAuth } from './context/auth';

// WRAPPER: Must be logged in (any role)
function Protected({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to='/login' replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <div className='min-h-screen'>
        <Navbar />
        <div className='container mx-auto px-4 py-8'>

          <Routes>

            {/* -------------------- PUBLIC ROUTES -------------------- */}
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />

            {/* -------------------- STUDENT-ONLY ROUTES -------------------- */}
            <Route
              path='/placements/cs'
              element={
                <Protected>
                  <RequireStudent>
                    <PlacementsCS />
                  </RequireStudent>
                </Protected>
              }
            />

            <Route
              path='/placements/internships'
              element={
                <Protected>
                  <RequireStudent>
                    <PlacementsInternships />
                  </RequireStudent>
                </Protected>
              }
            />

            <Route
              path='/applications'
              element={
                <Protected>
                  <RequireStudent>
                    <MyApplications />
                  </RequireStudent>
                </Protected>
              }
            />

            <Route
              path='/internships/apply/:id'
              element={
                <Protected>
                  <RequireStudent>
                    <InternshipApply />
                  </RequireStudent>
                </Protected>
              }
            />

            {/* -------------------- ADMIN-ONLY ROUTES -------------------- */}
            <Route
              path="/admin"
              element={
                <Protected>
                  <RequireAdmin>
                    <AdminDashboard />
                  </RequireAdmin>
                </Protected>
              }
            />

            <Route
              path="/admin/applications"
              element={
                <Protected>
                  <RequireAdmin>
                    <AdminApplications />
                  </RequireAdmin>
                </Protected>
              }
            />

            <Route
              path="/admin/placements"
              element={
                <Protected>
                  <RequireAdmin>
                    <AdminPlacements />
                  </RequireAdmin>
                </Protected>
              }
            />

            <Route
              path="/admin/users"
              element={
                <Protected>
                  <RequireAdmin>
                    <AdminUsers />
                  </RequireAdmin>
                </Protected>
              }
            />

            {/* -------------------- CATCH ALL -------------------- */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}
