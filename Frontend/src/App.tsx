import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/workspace';
import CreateExercise from './pages/CreateExercise';
import SubmissionsHistory from './pages/SubmissionsHistory';

const ProtectedRoute = ({ children, requireTeacher }: { children: ReactNode, requireTeacher?: boolean }) => {
  const { isAuthenticated, isTeacher } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireTeacher && !isTeacher()) return <Navigate to="/dashboard" replace />;
  
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        
        <Route path="/exercise/:id" element={
          <ProtectedRoute><Workspace /></ProtectedRoute>
        } />

        <Route path="/submissions" element={
          <ProtectedRoute><SubmissionsHistory /></ProtectedRoute>
        } />

        {/* Ruta protegida por RBAC: Exclusiva para Profesores */}
        <Route path="/exercise/create" element={
          <ProtectedRoute requireTeacher><CreateExercise /></ProtectedRoute>
        } />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}