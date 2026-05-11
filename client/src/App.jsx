import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/seller/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import Topup from './pages/seller/Topup';
import Wallet from './pages/seller/Wallet';
import Transactions from './pages/seller/Transactions';
import Withdrawals from './pages/admin/Withdrawals';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute role="seller" />}>
            <Route path="/dashboard" element={<SellerDashboard />} />
            <Route path="/topup" element={<Topup />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/transactions" element={<Transactions />} />
          </Route>
          <Route element={<RoleRoute role="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/withdrawals" element={<Withdrawals />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}