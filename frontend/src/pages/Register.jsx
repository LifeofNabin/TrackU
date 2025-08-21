import React from 'react';
import Layout from '../components/Layout';
import RegisterForm from '../components/Auth/RegisterForm';

const Register = () => {
  return (
    <Layout navbarStyle="register" showNavbar={true}>
      <RegisterForm />
    </Layout>
  );
};

export default Register;