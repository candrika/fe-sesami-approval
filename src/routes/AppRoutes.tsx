import { Routes, Route } from "react-router-dom";


import MainLayout from "@/layouts/MainLayout";

import Login from '../pages/Login';
import Logout from '../pages/Logout';
import Register from '../pages/Register';
import LeaveForm from '../pages/LeaveForm';
import LeaveList from '../pages/LeaveList';
import LeaveEdit from '@/pages/LeaveEdit'
import UserManager from '../pages/UserManager';
import UserForm from '../pages/UserForm';
import Unauthorized from '../pages/Unauthorized';

import PrivateRoutes from './PrivateRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Route Publik */}
      <Route path="/logout" element={<Logout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Route Private untuk user biasa */}
      <Route element={<PrivateRoutes roles={['User']} />}>
        <Route element={<MainLayout />}>
          <Route path="/izin/tambah" element={<LeaveForm />} />
          <Route path="/izin/edit/:id" element={<LeaveEdit />} /> 
        </Route>
      </Route>

      {/* Route Private untuk user biasa */}
      <Route element={<PrivateRoutes roles={['Admin','Verifikator', 'User']} />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LeaveList />} />
        </Route>
      </Route>

      {/* Route Private untuk Admin */}
      <Route element={<PrivateRoutes roles={['Admin','Verifikator']} />}>
        <Route element={<MainLayout />}>
          <Route path="/users" element={<UserManager />} />
        </Route>
      </Route>

      {/* Route Private untuk Admin */}
      <Route element={<PrivateRoutes roles={['Admin']} />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LeaveList />} />
          <Route path="/users" element={<UserManager />} />
          <Route path="/user/form" element={<UserForm />} />
          {/* <Route path="/user/form" element={<UserForm />} /> */}
        </Route>
      </Route>

      {/* Route Exception */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<div className="flex flex-col seft-center items-center justify-center min-h-screen">404 - Halaman tidak ditemukan</div>}></Route>
    </Routes>
  );
}

export default AppRoutes;
