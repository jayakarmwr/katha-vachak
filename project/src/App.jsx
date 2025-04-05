import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CreateStory from "./components/CreateStory";
import MyStories from "./components/MyStories";
import StoryHistory from "./components/StoryHistory";
import Profile from "./components/Profile";
import Confirm from "./components/Confirm";
import Forgot from "./components/Forgot";
import StoryDisplay from "./components/StoryDisplay";

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/login"
              element={
                !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
              }
            />
            <Route
              path="/register"
              element={
                !isAuthenticated ? <Register /> : <Navigate to="/dashboard" />
              }
            />
            <Route path="/confirm-email/:token" element={<Confirm />} />
            <Route path="/change-password" element={<Forgot />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/create-story" element={<CreateStory />} />
            <Route
              path="/my-stories"
              element={
                <ProtectedRoute>
                  <MyStories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/story-history"
              element={
                <ProtectedRoute>
                  <StoryHistory />
                </ProtectedRoute>
              }
            />
            <Route path="/story-display/:id" element={<StoryDisplay />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
