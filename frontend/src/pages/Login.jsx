import React from 'react';
import Layout from '../components/Layout';
import LoginForm from '../components/Auth/LoginForm';

const Login = () => {
  return (
    <Layout navbarStyle="login" showNavbar={true}>
      <LoginForm />
    </Layout>
  );
};

export default Login;