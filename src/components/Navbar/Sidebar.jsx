// src/components/Sidebar.jsx
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BusinessIcon from '@mui/icons-material/Business';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const API_ME = 'http://localhost:4000/api/data/user';
const API_DEPTS = 'http://localhost:4000/api/data/dept';
const drawerWidth = 260;

const Sidebar = ({ onLogout, open, onClose, isMobile }) => {
  const [me, setMe] = useState(null);
  const navigate = useNavigate();
  const [accountsOpen, setAccountsOpen] = useState(false);
  const [departmentsOpen, setDepartmentsOpen] = useState(false);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { onLogout(); return; }
    axios.get(API_ME, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setMe(data))
      .catch(() => { onLogout(); navigate('/'); });
    // Fetch departments
    axios.get(API_DEPTS)
      .then(({ data }) => setDepartments(data))
      .catch(console.error);
  }, [onLogout, navigate]);

  if (!me) return null;

  const handleLogout = () => { onLogout(); navigate('/'); };

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : true}
      onClose={isMobile ? onClose : undefined}
      ModalProps={isMobile ? { keepMounted: true } : undefined}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: '#fff',
          borderRight: '4px solid',
          borderImage: 'linear-gradient(to bottom, #42a5f5, #7e57c2) 1',
          boxShadow: '0 2px 8px 0 rgba(142,36,170,0.04)',
          borderRadius: 0,
          pt: 0,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Berry-style logo and app name removed as requested */}
      <Divider sx={{ mb: 2, mt: 0, bgcolor: '#e3e3e3' }} />
      {/* User info */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ width: 48, height: 48, bgcolor: 'secondary.main', fontSize: 28, mb: 1 }}>
          <AccountCircleIcon fontSize="large" />
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{me.username}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
          {me.deptLong} ({me.deptShort})
        </Typography>
      </Box>
      <Divider sx={{ mb: 2, bgcolor: '#e3e3e3' }} />
      {/* Navigation */}
      <List sx={{ flex: 1 }}>
        <ListItem
          button
          component={NavLink}
          to="/admin"
          sx={({ isActive }) => ({
            my: 1,
            borderRadius: 2,
            bgcolor: isActive ? 'primary.light' : 'transparent',
            color: isActive ? 'primary.main' : 'text.primary',
            '&:hover': { bgcolor: 'primary.light', color: 'primary.main', borderRadius: 0.5 },
            fontWeight: 700,
          })}
        >
          <ListItemIcon sx={{ color: 'inherit' }}><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        {me.username === 'FULL_ADMIN_1' && me.access === 'full' && (
          <>
            <ListItem
              button
              onClick={() => setAccountsOpen(o => !o)}
              sx={{
                my: 1,
                borderRadius: 2,
                bgcolor: accountsOpen ? 'primary.light' : 'transparent',
                color: accountsOpen ? 'primary.main' : 'text.primary',
                '&:hover': { bgcolor: 'primary.light', color: 'primary.main', borderRadius: 0.5 },
                fontWeight: 700,
                transition: 'background 0.2s',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Accounts" />
              {accountsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={accountsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 3 }}>
                <ListItem button component={NavLink} to="/accounts/create" sx={{ borderRadius: 1, pl: 4, py: 1, '&:hover': { bgcolor: 'primary.light', color: 'primary.main' } }}>
                  <ListItemText primary="Create Account" />
                </ListItem>
                <ListItem button component={NavLink} to="/accounts/manage" sx={{ borderRadius: 1, pl: 4, py: 1, '&:hover': { bgcolor: 'primary.light', color: 'primary.main' } }}>
                  <ListItemText primary="Manage Account" />
                </ListItem>
                <ListItem button component={NavLink} to="/accounts/users" sx={{ borderRadius: 1, pl: 4, py: 1, '&:hover': { bgcolor: 'primary.light', color: 'primary.main' } }}>
                  <ListItemText primary="Current Users" />
                </ListItem>
              </List>
            </Collapse>
          </>
        )}
        {me.access === 'full' ? (
          <>
            <ListItem
              button
              onClick={() => setDepartmentsOpen(o => !o)}
              sx={{
                my: 1,
                borderRadius: 2,
                bgcolor: departmentsOpen ? 'primary.light' : 'transparent',
                color: departmentsOpen ? 'primary.main' : 'text.primary',
                '&:hover': { bgcolor: 'primary.light', color: 'primary.main', borderRadius: 0.5 },
                fontWeight: 700,
                transition: 'background 0.2s',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}><BusinessIcon /></ListItemIcon>
              <ListItemText primary="Departments" />
              {departmentsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={departmentsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 3 }}>
                {departments.map(dept => (
                  <ListItem
                    button
                    key={dept.deptShort}
                    component={NavLink}
                    to={`/department/${encodeURIComponent(dept.deptShort)}`}
                    sx={{ borderRadius: 1, pl: 4, py: 1, '&:hover': { bgcolor: 'primary.light', color: 'primary.main' } }}
                  >
                    <ListItemText primary={dept.deptLong || dept.deptShort} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        ) : (
          <ListItem
            button
            component={NavLink}
            to="/post"
            sx={({ isActive }) => ({
              my: 1,
              borderRadius: 2,
              bgcolor: isActive ? 'primary.light' : 'transparent',
              color: isActive ? 'primary.main' : 'text.primary',
              '&:hover': { bgcolor: 'primary.light', color: 'primary.main', borderRadius: 0.5 },
              fontWeight: 700,
            })}
          >
            <ListItemIcon sx={{ color: 'inherit' }}><AddCircleIcon /></ListItemIcon>
            <ListItemText primary="Post a News" />
          </ListItem>
        )}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          sx={{
            fontWeight: 700,
            borderRadius: 2,
            bgcolor: 'error.main',
            color: '#fff',
            '&:hover': { bgcolor: 'error.dark' },
          }}
          startIcon={<LogoutIcon />}
          fullWidth
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
