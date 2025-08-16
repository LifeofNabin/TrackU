import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        name,
        email,
        password,
      });

      if (res.data.success) {
        setError(""); // clear any previous errors
        alert(res.data.message); // success message popup
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token); // save token if backend sends it
        navigate("/dashboard"); // go to dashboard
      } else {
        setError(res.data.message); // show backend error
      }
    } catch (err) {
      console.error(err);
      setError("Registration failed. Try again."); // fallback error
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
    >
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
        Register
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
      >
        Register
      </button>

      <p className="mt-4 text-center text-gray-500">
        Already have an account?{" "}
        <span
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </form>
  );
};

export default RegisterForm;
