import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import LoadingScreen from './components/common/LoadingScreen';
import AuthGuard from './components/auth/AuthGuard';
import RoleGuard from './components/auth/RoleGuard';
import DashboardLayout from './layouts/DashboardLayout';

// Lazy-loaded pages for better performance
const LoginPage = lazy(() => import('./pages/auth/Login'));
const SignupPage = lazy(() => import('./pages/auth/Signup'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const InventoryPage = lazy(() => import('./pages/inventory/Inventory'));
const ProductDetailPage = lazy(() => import('./pages/inventory/ProductDetail'));
const POSPage = lazy(() => import('./pages/pos/POS'));
const SettingsPage = lazy(() => import('./pages/dashboard/Settings'));
const ReportsPage = lazy(() => import('./pages/dashboard/Reports'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

function App() {
  const location = useLocation();
  const { initialized } = useAuth();

  useEffect(() => {
    document.title = 'InvenPOS - Inventory & POS System';
  }, []);

  if (!initialized) {
    return <LoadingScreen />;
  }

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingScreen />}>
        <Routes location={location} key={location.pathname}>
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected routes */}
          <Route element={<AuthGuard />}>
            <Route element={<DashboardLayout />}>
              {/* Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Inventory - Admin only */}
              <Route element={<RoleGuard allowedRoles={['admin']} />}>
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/inventory/:id" element={<ProductDetailPage />} />
              </Route>
              
              {/* POS - Both admin and cashier */}
              <Route path="/pos" element={<POSPage />} />
              
              {/* Reports - Admin only */}
              <Route element={<RoleGuard allowedRoles={['admin']} />}>
                <Route path="/reports" element={<ReportsPage />} />
              </Route>
              
              {/* Settings - Admin only */}
              <Route element={<RoleGuard allowedRoles={['admin']} />}>
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Route>
          
          {/* Redirect / to dashboard if logged in, otherwise to login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default App;