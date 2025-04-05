import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import { PenTool, Library, History, Sparkles } from 'lucide-react';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [user,setUser]=useState("");
  useEffect(() => {
    const storedData = sessionStorage.getItem('user');
    if (storedData) {
      const userdata = JSON.parse(storedData);
      setUser(userdata.username);
    }
  }, []); // Dependency array ensures useEffect runs only once.
  

  return (
    <div className="max-w-6xl mx-auto">
      <div className="dashboard-welcome">
        <h1 className="text-4xl font-bold mb-4">Welcome back, {user.toLowerCase()}!</h1>
        <p className="text-lg text-indigo-100">Ready to craft your next masterpiece?</p>
      </div>

      <div className="dashboard-grid">
        <Link to="/create-story" className="dashboard-card">
          <div className="p-6">
            <PenTool className="card-icon" />
            <h2 className="card-title">Create New Story</h2>
            <p className="card-description">Start crafting your next creative story with our guided tools.</p>
          </div>
        </Link>

        <Link to="/my-stories" className="dashboard-card">
          <div className="p-6">
            <Library className="card-icon" />
            <h2 className="card-title">My Stories</h2>
            <p className="card-description">Access your collection of saved stories and drafts.</p>
          </div>
        </Link>

        <Link to="/story-history" className="dashboard-card">
          <div className="p-6">
            <History className="card-icon" />
            <h2 className="card-title">Story History</h2>
            <p className="card-description">Review your past story sessions and writing journey.</p>
          </div>
        </Link>
      </div>

      <div className="inspiration-card">
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          <h2 className="text-xl font-bold text-gray-800">Writing Inspiration</h2>
        </div>
        <p className="text-gray-600">
          "The first draft is just you telling yourself the story." - Terry Pratchett
        </p>
      </div>
    </div>
  );
}