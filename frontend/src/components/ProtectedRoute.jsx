import { Navigate } from 'react-router-dom';

const getRole = () => localStorage.getItem('role') || 'guest';
const getToken = () => localStorage.getItem('token') || '';

export default function ProtectedRoute({ children, allowedRoles = ['guest', 'operator', 'admin'] }) {
  const role = getRole();
  const token = getToken();
  const requiresAuth = allowedRoles.some((allowedRole) => allowedRole !== 'guest');

  if ((requiresAuth && !token) || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
