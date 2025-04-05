import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, UserPlus, Mail, Lock, User } from 'lucide-react';
import axios from 'axios';

const Register=() =>{
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/en/signup", {
        username,
        email
      });
      const data=response.data.msg;
      if(data==='User created successfully. Check your email to confirm')
      {
        alert("Signup successful: " + response.data.msg);

      }
      
    } catch (error) {
      console.error("There was an error signing up:", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center auth-background">
      <div className="auth-card">
        <div className="flex flex-col items-center mb-8">
          <div className="floating-animation">
            <BookOpen className="h-16 w-16 text-indigo-600 mb-4" />
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Join Kathavaachak
          </h1>
          <p className="text-gray-600 mt-2">Begin your storytelling journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

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

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 gradient-button py-3 px-6 rounded-lg"
          >
            <UserPlus className="h-5 w-5" />
            <span>Create Account</span>
          </button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Sign in
            </Link>
          </p>
          <div className="flex items-center justify-center space-x-4">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse delay-75"></span>
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse delay-150"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;