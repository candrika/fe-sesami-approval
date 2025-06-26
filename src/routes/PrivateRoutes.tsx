import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../app/store';

const PrivateRoutes = ({ roles } : { roles: string[] }) => {
  
  const { token, user } = useSelector((state: RootState) => state.auth);
  const aksesToken = token ? token:  localStorage.getItem('token')
  
  // Jika belum login
  if (!aksesToken) return <Navigate to="/login" replace />;
  
  // return false;
  const userRole = user?.role || localStorage.getItem('role');
  
  console.log(userRole)
  
  // Jika role tidak diizinkan
  if (!roles.includes(userRole || '')) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Jika lolos semua
  return <Outlet />;
};

export default PrivateRoutes;