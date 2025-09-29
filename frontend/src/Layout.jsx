import React from 'react';
import { Outlet } from 'react-router-dom'
import Header from './header/header.jsx';

const Layout = () => {
  return (
  
    <div className="min-h-screen w-full bg-gray-950 text-gray-100">
      <Header />
        <Outlet /> 
    </div>
  );
};

export default Layout;