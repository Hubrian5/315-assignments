import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import OrderPage from './components/OrderPage';
import OrdersList from './components/OrdersList';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/order/:id" element={<OrderPage />} />
        <Route path="/orders" element={<OrdersList />} />
      </Routes>
    </Router>
  );
};

export default App;