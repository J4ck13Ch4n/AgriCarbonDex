import React from 'react';
import Trade from './pages/Trade';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import { Routes, Route } from 'react-router-dom';

const AppRoutes = () => (
  <Routes>
    <Route path="/trade" element={<Trade />} />
    <Route path="/buy" element={<Buy />} />
    <Route path="/sell" element={<Sell />} />
  </Routes>
);

export default AppRoutes;
