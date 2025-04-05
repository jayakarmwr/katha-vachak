import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { BookOpen, History, Library, PenTool, User, LogOut } from 'lucide-react';
import '../styles/Navbar.css';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    logout();
  
    if (window.location.pathname !== '/login') {
      navigate('/login');
    }
  };
  


  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-indigo-300" />
            <span className="text-2xl font-bold text-white">Kathavaachak</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/create-story" className="nav-link">
              <PenTool className="h-5 w-5" />
              <span>Create Story</span>
            </Link>
            <Link to="/my-stories" className="nav-link">
              <Library className="h-5 w-5" />
              <span>My Stories</span>
            </Link>
            <Link to="/story-history" className="nav-link">
              <History className="h-5 w-5" />
              <span>History</span>
            </Link>
            <Link to="/profile" className="nav-link">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="logout-button"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}