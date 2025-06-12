import React from 'react';
import Trade from './pages/Trade';
import { Routes, Route } from 'react-router-dom';

const AppRoutes = () => (
  <Routes>
    <Route path="/trade" element={<Trade />} />
  </Routes>
);

export default AppRoutes;
