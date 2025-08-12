// src/App.js
import { useAuthenticationStatus } from '@nhost/react';
import Auth from './components/Auth';
import Chat from './components/Chat';
import './App.css'; // Basic styling ke liye

function App() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();

  // Jab Nhost check kar raha ho, tab loading dikhayein
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  // Agar user logged in nahi hai, toh use Auth component dikhayein
  if (!isAuthenticated) {
    return <Auth />;
  }

  // Agar user logged in hai, toh use Chat component dikhayein
  return <Chat />;
}

export default App;