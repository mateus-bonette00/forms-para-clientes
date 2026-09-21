import React, { useEffect, useState } from 'react';
import { ClientFormPage } from './pages/ClientFormPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export const App: React.FC = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Simple Hash-based Router
  if (currentHash.startsWith('#/admin/dashboard')) {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.hash = '#/admin/login';
      return <AdminLoginPage />;
    }
    return <AdminDashboardPage />;
  }

  if (currentHash.startsWith('#/admin/login')) {
    const token = localStorage.getItem('admin_token');
    if (token) {
      window.location.hash = '#/admin/dashboard';
      return <AdminDashboardPage />;
    }
    return <AdminLoginPage />;
  }

  // Default to Client Form
  return <ClientFormPage />;
};

export default App;

