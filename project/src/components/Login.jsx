import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { BookOpen, LogIn, Mail, Lock } from 'lucide-react';
import '../styles/Login.css';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate();

  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.post("http://localhost:3000/en/getdata", { email, password });
          const {id,username,msg}=response.data; 
          if (msg === 'ok') {
              alert("Successfully logged in");
              const userData = { id, username, email };
              sessionStorage.setItem("user", JSON.stringify(userData));

    // Pass the full user data to the login method
    login(userData);

          }
          else if(data==='User not found'){
            alert("User not found. Please register to login");
            navigate("/register");
          }
          else if (data === 'Incorrect password') {
            alert("Incorrect password. Please try again.");
          }
      } catch (error) {
          console.error("There was an error logging in", error);
          alert("An error occurred. Please try again.");
      }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="floating-animation">
            <BookOpen className="h-16 w-16 text-indigo-600 mb-4" />
          </div>
          <h1 className="login-title">Kathavaachak</h1>
          <p className="login-subtitle">Welcome back to your story world</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="forgot text-right mt-2">
            <Link to="/change-password" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="login-button">
            <LogIn className="h-5 w-5" />
            <span>Sign In</span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;