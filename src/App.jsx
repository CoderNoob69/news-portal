// src/App.jsx
import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Navbar/Sidebar';
import HomePage from './pages/HomePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DepartmentNewsPage from './pages/DepartmentNewsPage';
import NewsPage from './pages/NewsPage';
import NewsUploadPage from './pages/NewsUploadPage';
import UserNewsPage from './pages/UserNewsPage';
import DepartmentList from './components/Department/DepartmentList';
import AccountManagerPage from './pages/AccountManagerPage';

import './App.css';

/* ── helper wrapper so we can access `useLocation` outside Routes ── */
function AppShell() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const location = useLocation();                    /* ← NEW */

  /* check login on mount + cross‑tab sync */
  useEffect(() => {
    const update = () =>
      setIsLoggedIn(!!localStorage.getItem('token'));
    update();
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, []);

  /* handlers */
  const handleLogin = name => { setIsLoggedIn(true); setUserName(name); };
  const handleLogout = () => { localStorage.removeItem('token'); setIsLoggedIn(false); };

  /* ── render ── */
  return (
    <div className="app-layout">
      {/* show sidebar IF logged in AND not on the login page ("/") */}
      {isLoggedIn && location.pathname !== '/' && (
        <Sidebar isLoggedIn={isLoggedIn} userName={userName} onLogout={handleLogout} />
      )}

      <div
        className="main-content-with-sidebar"
        style={{
          /* 0 px on the login page, otherwise fall back to whatever the
             stylesheet gives (e.g. space for the sidebar) */
          marginLeft: location.pathname === '/' ? 0 : undefined
        }}
      >
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public route */}
            <Route path="/" element={<HomePage onLogin={handleLogin} />} />

            {/* Protected routes (assume auth check is inside each page component) */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/departments" element={<DepartmentList />} />
            <Route path="/department" element={<DepartmentNewsPage />} />
            <Route path="/department/:department" element={<DepartmentNewsPage />} />
            <Route path="/news/:deptShort/:id" element={<NewsPage />} />
            <Route path="/post" element={<NewsUploadPage />} />
            <Route path="/my-posts" element={<UserNewsPage />} />

            {/* Admin-only account management */}
            <Route path="/accounts" element={<AccountManagerPage />} />

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}
