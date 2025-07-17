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
import { AdminNewsDetail } from './components/News';
import { CreateAccountForm, CurrentUsersTable, ChangePasswordForm } from './pages/AccountManagerPage';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

import './App.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

/* ── helper wrapper so we can access `useLocation` outside Routes ── */
function AppShell() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const location = useLocation();                    /* ← NEW */
  const isMobile = useMediaQuery('(max-width:900px)');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <Sidebar
          isLoggedIn={isLoggedIn}
          userName={userName}
          onLogout={handleLogout}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isMobile={isMobile}
        />
      )}

      <Box
        className="main-content-with-sidebar"
        sx={{
          marginLeft: isLoggedIn && location.pathname !== '/' && !isMobile ? '260px' : 0,
          transition: 'margin-left 0.3s',
          minHeight: '100vh',
          background: theme => theme.palette.background.default,
        }}
      >
        {location.pathname !== '/' && (
          <Navbar
            showSidebarToggle={isMobile && isLoggedIn}
            onSidebarToggle={() => setSidebarOpen(true)}
          />
        )}
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
            <Route path="/accounts/create" element={<CreateAccountPage />} />
            <Route path="/accounts/users" element={<CurrentUsersPage />} />
            <Route path="/accounts/manage" element={<ManageAccountPage />} />
            {/* Admin news detail route */}
            <Route path="/admin/news/:date/:department" element={<AdminNewsDetail />} />

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </Box>
    </div>
  );
}

function CreateAccountPage() {
  const [users, setUsers] = useState([
    { username: 'FULL_ADMIN_1', deptShort: 'ADMIN', deptLong: 'Admin', access: 'full' },
    { username: 'user1', deptShort: 'CSE', deptLong: 'Computer Science', access: 'limited' },
    { username: 'user2', deptShort: 'IT', deptLong: 'Information Technology', access: 'limited' },
  ]);
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: { xs: 1, md: 3 } }}>
      <Typography variant="h2" color="primary" sx={{ mb: 3, fontWeight: 800, fontSize: { xs: '1.3rem', md: '2rem' } }}>
        Create Account
      </Typography>
      <CreateAccountForm users={users} setUsers={setUsers} />
    </Box>
  );
}

function CurrentUsersPage() {
  const [users] = useState([
    { username: 'FULL_ADMIN_1', deptShort: 'ADMIN', deptLong: 'Admin', access: 'full' },
    { username: 'user1', deptShort: 'CSE', deptLong: 'Computer Science', access: 'limited' },
    { username: 'user2', deptShort: 'IT', deptLong: 'Information Technology', access: 'limited' },
  ]);
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: { xs: 1, md: 3 } }}>
      <Typography variant="h2" color="primary" sx={{ mb: 3, fontWeight: 800, fontSize: { xs: '1.3rem', md: '2rem' } }}>
        Current Users
      </Typography>
      <CurrentUsersTable users={users} />
    </Box>
  );
}

function ManageAccountPage() {
  const [users, setUsers] = useState([
    { username: 'FULL_ADMIN_1', deptShort: 'ADMIN', deptLong: 'Admin', access: 'full' },
    { username: 'user1', deptShort: 'CSE', deptLong: 'Computer Science', access: 'limited' },
    { username: 'user2', deptShort: 'IT', deptLong: 'Information Technology', access: 'limited' },
  ]);
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: { xs: 1, md: 3 } }}>
      <Typography variant="h2" color="primary" sx={{ mb: 3, fontWeight: 800, fontSize: { xs: '1.3rem', md: '2rem' } }}>
        Manage Account
      </Typography>
      <ChangePasswordForm users={users} setUsers={setUsers} />
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppShell />
      </Router>
    </ThemeProvider>
  );
}
