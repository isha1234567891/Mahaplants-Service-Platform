import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';

// Lazy loaded components
const Navbar = React.lazy(() => import('./Components/common/Navbar'));
const Footer = React.lazy(() => import('./Components/common/Footer'));
const ProtectedRoute = React.lazy(() => import('./Components/auth/ProtectedRoute'));
const AdminLayout = React.lazy(() => import('./Components/admin/AdminLayout'));

// Pages
const Home = React.lazy(() => import('./pages/Home'));
const Packages = React.lazy(() => import('./pages/Packages'));
const Services = React.lazy(() => import('./pages/Services'));
const Benefits = React.lazy(() => import('./pages/Benefits'));
const Offers = React.lazy(() => import('./pages/Offers'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Cart = React.lazy(() => import('./pages/Cart'));

// Auth pages (components folder)
const Login = React.lazy(() => import('./Components/auth/Login'));
const Signup = React.lazy(() => import('./Components/auth/Signup'));
const ForgotPassword = React.lazy(() => import('./Components/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./Components/auth/ResetPassword'));

// User pages
const Profile = React.lazy(() => import('./pages/user/Profile'));
const MySubscriptions = React.lazy(() => import('./pages/user/MySubscriptions'));
const OrderHistory = React.lazy(() => import('./pages/user/OrderHistory'));
const OrderServices = React.lazy(() => import('./pages/user/OrderServices'));
const ServiceConfirmation = React.lazy(() => import('./pages/user/ServiceConfirmation'));
const Settings = React.lazy(() => import('./pages/user/Settings'));

// Admin pages
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const UserManagement = React.lazy(() => import('./pages/admin/UserManagement'));
const InventoryManagement = React.lazy(() => import('./pages/admin/InventoryManagement'));
const OrderManagement = React.lazy(() => import('./pages/admin/OrderManagement'));
const ServiceManagement = React.lazy(() => import('./pages/admin/ServiceManagement'));
const Analytics = React.lazy(() => import('./pages/admin/Analytics'));

const WorkerDashboard = React.lazy(() => import('./pages/worker/WorkerDashboard'));

// Error Pages
const NotFound = React.lazy(() => import('./pages/error/NotFound'));
const ServerError = React.lazy(() => import('./pages/error/ServerError'));

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      errorInfo: errorInfo
    });
    // You can also log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <ServerError />
          </Suspense>
          <div style={{ color: 'red', padding: '1rem' }}>
            <h2>Something went wrong.</h2>
            {this.state.errorInfo && (
              <details style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.errorInfo.componentStack}
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Loading Fallback Component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Suspense fallback={<LoadingFallback />}>
                  <Navbar />
                  
                  <main className="flex-grow">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/packages" element={<Packages />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/benefits" element={<Benefits />} />
                      <Route path="/offers" element={<Offers />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/cart" element={<Cart />} />

                      {/* Auth Routes */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />

                      {/* Protected User Routes */}
                      <Route path="/user/*" element={
                        <ProtectedRoute>
                          <Routes>
                            <Route path="profile" element={<Profile />} />
                            <Route path="subscriptions" element={<MySubscriptions />} />
                            <Route path="orders" element={<OrderHistory />} />
                            <Route path="orders/:orderId" element={<OrderServices />} />
                            <Route path="services/:subscriptionId" element={<OrderServices />} />
                            <Route path="service-confirmations" element={<ServiceConfirmation />} />
                            <Route path="settings" element={<Settings />} />
                          </Routes>
                        </ProtectedRoute>
                      } />

                      {/* Protected Admin Routes */}
                      <Route path="/admin/*" element={
                        <ProtectedRoute requireAdmin>
                          <AdminLayout>
                            <Routes>
                              <Route path="dashboard" element={<AdminDashboard />} />
                              <Route path="users" element={<UserManagement />} />
                              <Route path="inventory" element={<InventoryManagement />} />
                              <Route path="orders" element={<OrderManagement />} />
                              <Route path="services" element={<ServiceManagement />} />
                              <Route path="analytics" element={<Analytics />} />
                            </Routes>
                          </AdminLayout>
                        </ProtectedRoute>
                      } />

                      {/* Protected Worker Routes */}
                      <Route path="/worker/*" element={
                        <ProtectedRoute requireWorker>
                          <Routes>
                            <Route path="dashboard" element={<WorkerDashboard />} />
                          </Routes>
                        </ProtectedRoute>
                      } />

                      {/* Error Routes */}
                      <Route path="/500" element={<ServerError />} />
                      <Route path="/404" element={<NotFound />} />
                      <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                  </main>

                  <Footer />
                </Suspense>

                {/* Toast Container for notifications */}
                <ToastContainer
                  position="bottom-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                />
              </div>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;