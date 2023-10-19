import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../Screens/Dashboard/Layout';
import Login from '../Screens/Auth/Login';
import Register from '../Screens/Auth/Register';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
