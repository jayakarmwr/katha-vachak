import React, { useState } from 'react';
import { Link,useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock } from 'lucide-react';

const Confirm = () => {
  const { token } = useParams(); 
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }
    
    try {
      const response = await axios.post("http://localhost:3000/en/confirm", { password, confirm, token });
      const data = response.data.msg; 
      if (data === 'ok' || data=='Email confirmed and password set successfully.') {
        alert("Password updated successfully");
        navigate("/login");
      } else {
        alert("Failed to update password: " + data);
      }
    } catch (error) {
      console.error("There was an error updating the password", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center auth-background">
      <div className="auth-card">
        <div className="flex flex-col items-center mb-8">
          <div className="floating-animation">
            <Lock className="h-16 w-16 text-indigo-600 mb-4" />
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Set Your Password
          </h1>
          <p className="text-gray-600 mt-2">Please enter your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 gradient-button py-3 px-6 rounded-lg"
          >
            <span>Submit</span>
          </button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Login here
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

export default Confirm;
