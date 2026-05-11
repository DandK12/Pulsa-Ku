import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function RoleRoute({ role }) {
  const user = useAuthStore((s) => s.user);
  return user?.role === role ? <Outlet /> : <Navigate to="/login" />;
}