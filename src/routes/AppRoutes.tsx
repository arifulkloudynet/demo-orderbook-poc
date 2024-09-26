import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OrderBook from '../containers/OrderBook';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<OrderBook />} />
    </Routes>
  );
};

export default AppRoutes;
