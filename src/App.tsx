import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Toaster } from 'sonner';

// Pages
import Landing from '@/pages/Landing';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UploadNewspaper from '@/pages/admin/UploadNewspaper';
import MapNewspaper from '@/pages/admin/MapNewspaper';
import ReadNewspaper from '@/pages/user/ReadNewspaper';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  
  if (!user || user.role !== 'admin') return <Navigate to="/admin/login" />;

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/upload" element={
            <AdminRoute>
              <UploadNewspaper />
            </AdminRoute>
          } />
          <Route path="/admin/map/:id" element={
            <AdminRoute>
              <MapNewspaper />
            </AdminRoute>
          } />

          {/* Public User Routes */}
          <Route path="/read/:id" element={<ReadNewspaper />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-center" />
      </Router>
    </AuthProvider>
  );
}
