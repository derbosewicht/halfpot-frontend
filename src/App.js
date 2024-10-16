import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Component from './Component';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Component />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
