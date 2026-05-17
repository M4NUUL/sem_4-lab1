import { Navigate } from 'react-router-dom';

const getRole = () => localStorage.getItem('role') || 'guest';

export default function ProtectedRoute({ children, allowedRoles = ['guest', 'operator', 'admin'] }) {
  const role = getRole();

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
