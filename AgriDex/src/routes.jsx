import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Import Link
import Layout from './components/Layout';
import Home from './pages/Home';
import Trade from './pages/Trade';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import List from './pages/List';
import Dashboard from './pages/Dashboard';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />

      <Route path="trade" element={<Trade />} />
      <Route path="buy" element={<Buy />} />
      <Route path="sell" element={<Sell />} />
      <Route path="list" element={<List />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="*" element={
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.20))] text-center">
          <h1 className="text-5xl font-bold text-red-500 mb-4">404</h1>
          <p className="text-xl text-gray-300 mb-8">Page not found.</p>
          <Link to="/" className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors duration-300">
            Go to Home
          </Link>
        </div>
      } />
    </Route>
  </Routes>
);

export default AppRoutes;