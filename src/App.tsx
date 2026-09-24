import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { AppProvider } from './context/AppContext';

// Layouts
import { VendorLayout } from './components/layout/VendorLayout';

// Public & Auth Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';

// Vendor Pages
import { VendorDashboard } from './pages/vendor/VendorDashboard';
import { VendorMenuPage } from './pages/vendor/VendorMenuPage';
import { VendorOrdersPage } from './pages/vendor/VendorOrdersPage';
import { VendorQueuePage } from './pages/vendor/VendorQueuePage';
import { VendorAnalyticsPage } from './pages/vendor/VendorAnalyticsPage';
import { VendorQrPage } from './pages/vendor/VendorQrPage';

// Customer Pages
import { CustomerStorePage } from './pages/customer/CustomerStorePage';
import { CustomerMenuPage } from './pages/customer/CustomerMenuPage';
import { CustomerOrderTrackingPage } from './pages/customer/CustomerOrderTrackingPage';

export function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing & Marketing */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Vendor Management Console Routes */}
            <Route path="/vendor" element={<VendorLayout />}>
              <Route index element={<VendorDashboard />} />
              <Route path="menu" element={<VendorMenuPage />} />
              <Route path="orders" element={<VendorOrdersPage />} />
              <Route path="queue" element={<VendorQueuePage />} />
              <Route path="analytics" element={<VendorAnalyticsPage />} />
              <Route path="qr" element={<VendorQrPage />} />
            </Route>

            {/* Customer Storefront & Live Tracker Routes */}
            <Route path="/customer/:vendorId" element={<CustomerStorePage />} />
            <Route path="/customer/:vendorId/menu" element={<CustomerMenuPage />} />
            <Route path="/customer/:vendorId/order/:orderId" element={<CustomerOrderTrackingPage />} />

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ToastProvider>
  );
}

export default App;
