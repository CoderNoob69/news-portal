import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Paper, Typography, TextField, Button, InputAdornment, IconButton, Alert, Stack, Divider, Link } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const API_LOGIN = 'http://localhost:4000/api/login';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();

  const handleChange = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!formData.username || !formData.password) {
      setError('All fields are required');
      return;
    }
    try {
      const { data } = await axios.post(API_LOGIN, formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', formData.username);
      if (onLogin) onLogin(formData.username);
      navigate('/admin');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', height: '100vh', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, bgcolor: 'background.default', p: 0, m: 0 }}>
      {/* Left side: Welcome gradient */}
      <Box
        sx={{
          flex: { xs: 'none', md: '0 0 40%' },
          width: { xs: '100%', md: '40%' },
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #8e24aa 0%, #1976d2 100%)',
          color: '#fff',
          height: '100vh',
          p: 0, m: 0,
        }}
      >
        <Box sx={{ p: 8, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={800} sx={{ mb: 2, letterSpacing: 1 }}>
            Welcome Back!
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
            Sign in to your account to access the NIT Raipur News Portal.
          </Typography>
        </Box>
      </Box>
      {/* Right side: Login form */}
      <Box sx={{ flex: { xs: 'none', md: '0 0 60%' }, width: { xs: '100%', md: '60%' }, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0, m: 0, height: '100vh' }}>
        <Paper elevation={4} sx={{ p: { xs: 4, sm: 7 }, maxWidth: 520, width: '100%', borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 480 }}>
          <Stack spacing={3}>
            <Typography variant="h4" fontWeight={800} color="primary.main" align="center" sx={{ letterSpacing: 1 }}>
              Sign in
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 1 }}>
              Enter your credentials to continue
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Password"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPwd ? 'Hide password' : 'Show password'}
                          onClick={() => setShowPwd(p => !p)}
                          edge="end"
                          size="small"
                        >
                          {showPwd ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: -1 }}>
                  <Link href="#" underline="hover" color="secondary.main" fontWeight={600} fontSize={14}>
                    Forgot password?
                  </Link>
                </Box>
                <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ mt: 1, fontWeight: 700, borderRadius: 2, py: 1.2, fontSize: 18 }}>
                  Sign in
                </Button>
              </Stack>
            </form>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" align="center" color="text.secondary">
              Access is restricted to authorized users only. Contact the admin for access.
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
