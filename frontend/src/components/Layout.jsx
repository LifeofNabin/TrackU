import React from 'react';
import NavBar from './NavBar';

const Layout = ({ children, navbarStyle = "default" }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <NavBar style={navbarStyle} />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;