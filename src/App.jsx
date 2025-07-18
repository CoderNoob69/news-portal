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
import AccountManagerPage, {
  CreateAccountForm,
  CurrentUsersTable,
  ChangePasswordForm
} from './pages/AccountManagerPage';
import { AdminNewsDetail } from './components/News';

import { Typography, ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import useMediaQuery from '@mui/material/useMediaQuery';

import './App.css';
import axios from 'axios';

const API_ACCOUNT = 'http://localhost:4000/api/account';
const API_ME      = 'http://localhost:4000/api/data/user';

/* ════════════════════════════════════════════════════════════════════════
 * helper wrapper so we can access `useLocation` outside Routes
 * ════════════════════════════════════════════════════════════════════════ */
function AppShell() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName,   setUserName]   = useState('');
  const location                     = useLocation();
  const isMobile                     = useMediaQuery('(max-width:900px)');
  const [sidebarOpen, setSidebarOpen]= useState(false);

  /* global account data used by the 3 account sub‑routes ---------------- */
  const [accountUsers, setAccountUsers] = useState([]);  // [{id,...}]
  const [accountLoadErr, setAccountLoadErr] = useState('');
  const [me, setMe] = useState(null); // current logged in user (for auth gating)

  /* fetch account users + me AFTER login -------------------------------- */
  useEffect(() => {
    if (!isLoggedIn) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get(API_ME,      { headers }),
      axios.get(`${API_ACCOUNT}/users`, { headers })
    ])
      .then(([meRes, usersRes]) => {
        setMe(meRes.data);
        setAccountUsers(usersRes.data); // already array; shape {id,...}
      })
      .catch(err => {
        console.error('Load account users error:', err);
        setAccountLoadErr(err?.response?.data?.message || 'Error loading users.');
      });
  }, [isLoggedIn]);

  /* create / delete / password helpers shared by account pages ---------- */
  const createAccount = async ({ username, password, deptShort, deptLong }) => {
    const token = localStorage.getItem('token');
    const { data } = await axios.post(
      API_ACCOUNT,
      { username, password, deptShort, deptLong },
      { headers: { Authorization:`Bearer ${token}` } }
    );
    // backend returns new user object
    setAccountUsers(prev => [...prev, data]);
    return data;
  };

  const deleteAccount = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_ACCOUNT}/${id}`, {
      headers: { Authorization:`Bearer ${token}` }
    });
    setAccountUsers(prev => prev.filter(u => u.id !== id));
  };

  const changePassword = async (id, password) => {
    const token = localStorage.getItem('token');
    await axios.patch(`${API_ACCOUNT}/${id}/password`,
      { password },
      { headers:{ Authorization:`Bearer ${token}` } }
    );
  };

  /* check login on mount + cross‑tab sync -------------------------------- */
  useEffect(() => {
    const update = () => {
      const hasToken = !!localStorage.getItem('token');
      setIsLoggedIn(hasToken);
      if (hasToken) {
        const storedName = localStorage.getItem('userName') || '';
        setUserName(storedName);
      } else {
        setMe(null);
        setAccountUsers([]);
      }
    };
    update();
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, []);

  /* handlers ------------------------------------------------------------- */
  const handleLogin  = name => { setIsLoggedIn(true);  setUserName(name);  };
  const handleLogout = ()   => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setMe(null);
    setAccountUsers([]);
  };

  /* tiny wrappers used by the 3 “Account” routes ------------------------ */
  function CreateAccountPage() {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: { xs: 1, md: 3 } }}>
        <Typography variant="h2" color="primary" sx={{ mb: 3, fontWeight: 800, fontSize: { xs:'1.3rem', md:'2rem' } }}>
          Create Account
        </Typography>
        <CreateAccountForm users={accountUsers} setUsers={setAccountUsers} createAccount={createAccount} />
      </Box>
    );
  }

  function CurrentUsersPage() {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: { xs: 1, md: 3 } }}>
        <Typography variant="h2" color="primary" sx={{ mb: 3, fontWeight: 800, fontSize: { xs:'1.3rem', md:'2rem' } }}>
          Current Users
        </Typography>
        <CurrentUsersTable users={accountUsers} onDelete={u => deleteAccount(u.id)} />
      </Box>
    );
  }

  function ManageAccountPage() {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: { xs: 1, md: 3 } }}>
        <Typography variant="h2" color="primary" sx={{ mb: 3, fontWeight: 800, fontSize: { xs:'1.3rem', md:'2rem' } }}>
          Manage Account
        </Typography>
        <ChangePasswordForm
          users={accountUsers}
          onChangePassword={(user, newPw) => changePassword(user.id, newPw)}
        />
      </Box>
    );
  }

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
          background: (theme) => theme.palette.background.default,
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
            <Route path="/accounts/users"  element={<CurrentUsersPage />} />
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

/* root component wrapper -------------------------------------------------- */
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
