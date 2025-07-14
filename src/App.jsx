import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Navbar/Sidebar';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DepartmentNewsPage from './pages/DepartmentNewsPage';
import NewsPage from './pages/NewsPage';
import NewsUploadPage from './pages/NewsUploadPage';
import UserNewsPage from './pages/UserNewsPage';
import ProfilePage from './pages/ProfilePage';
import DepartmentList from './components/Department/DepartmentList';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // Check login status and userName on component mount
  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);
    setUserName(localStorage.getItem('userName') || '');

    // Add event listener for storage changes (for multi-tab support)
    const handleStorageChange = () => {
      const updatedLoginStatus = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(updatedLoginStatus);
      setUserName(localStorage.getItem('userName') || '');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handler to update login state and userName
  const handleLogin = (name) => {
    setIsLoggedIn(true);
    setUserName(name);
  };

  // Handler to logout
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
  };

  // Handler to update userName from profile changes
  const handleUserNameChange = (newName) => {
    setUserName(newName);
  };

  return (
    <Router>
      <div className="app-layout">
        {isLoggedIn && (
          <Sidebar isLoggedIn={isLoggedIn} userName={userName} onLogout={handleLogout} />
        )}
        <div className="main-content-with-sidebar">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage onLogin={handleLogin} />} />
              <Route path="/signup" element={<SignUpPage onLogin={handleLogin} />} />
              {/* Protected routes */}
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/departments" element={<DepartmentList />} />
              <Route path="/department" element={<DepartmentNewsPage />} />
              <Route path="/department/:department" element={<DepartmentNewsPage />} />
              <Route path="/news/:id" element={<NewsPage />} />
              <Route path="/post" element={<NewsUploadPage />} />
              <Route path="/my-posts" element={<UserNewsPage />} />
              <Route path="/profile" element={<ProfilePage onUserNameChange={handleUserNameChange} />} />
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
