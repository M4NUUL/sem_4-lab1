import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import IncidentsPage from './pages/IncidentsPage';
import IncidentDetailPage from './pages/IncidentDetailPage';
import IncidentFormPage from './pages/IncidentFormPage';
import UsersPage from './pages/UsersPage';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app-layout">
        <Navbar />
        <main className="app-content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<IncidentsPage />} />
            <Route path="/detail/:id" element={<IncidentDetailPage />} />
            <Route
              path="/add"
              element={(
                <ProtectedRoute allowedRoles={['admin']}>
                  <IncidentFormPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/edit/:id"
              element={(
                <ProtectedRoute allowedRoles={['admin']}>
                  <IncidentFormPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/admin/users"
              element={(
                <ProtectedRoute allowedRoles={['admin']}>
                  <UsersPage />
                </ProtectedRoute>
              )}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
