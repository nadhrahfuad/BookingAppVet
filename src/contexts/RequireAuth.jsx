// RequireAuth.jsx

import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useAuth from './useAuth';

const RequireAuth = ({ allowedAccess }) => {
  const { auth } = useAuth();
  const location = useLocation();

  // console.log("auth", auth);
  console.log("Role", auth.role)
  console.log("Access", allowedAccess);

  if (!auth || !auth.isAuthenticated) {
    // LANDING PAGE
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check access role
  const hasAccess = allowedAccess.includes(auth.role);

  if (!hasAccess) {
    return <Navigate to="/error" state={{ from: location }} replace />;
  }

  // Render nested routes
  return <Outlet />;
};

export default RequireAuth;
