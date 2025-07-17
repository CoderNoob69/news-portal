import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, TextField, Button, InputAdornment, IconButton, Alert, Stack, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const departments = [
  'Computer Science and Engineering (CSE)',
  'Information Technology (IT)',
  'Electronics and Communication Engineering (ECE)',
  'Electrical Engineering (Elec)',
  'Mechanical Engineering (Mech)',
  'Chemical Engineering (Chem)',
  'Mineral and Metallurgical Engineering (Meta)',
  'Civil Engineering (Civil)',
  'Biotech Engineering (BTE)',
  'Biomed Engineering (BME)',
  'Architecture (Arch)'
];

const SignUp = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    designation: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (Object.values(formData).some(value => !value)) {
      setError('All fields are required');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // Simulate registration
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', formData.email);
    localStorage.setItem('userName', formData.name);
    localStorage.setItem('userBranch', formData.branch);
    localStorage.setItem('userDesignation', formData.designation);
    if (onLogin) onLogin(formData.name);
    navigate('/admin');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, maxWidth: 500, width: '100%', borderRadius: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h5" fontWeight={700} color="primary.main" align="center">
            Sign Up for NIT Raipur News Portal
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl fullWidth required>
                <InputLabel id="branch-label">Department</InputLabel>
                <Select
                  labelId="branch-label"
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  label="Department"
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <ApartmentIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value=""><em>Select your department</em></MenuItem>
                  {departments.map((dept, index) => (
                    <MenuItem key={index} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
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
                type={showPassword ? 'text' : 'password'}
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
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
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
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ mt: 1, fontWeight: 600 }}>
                Sign Up
              </Button>
            </Stack>
          </form>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link to="/" style={{ color: '#1976d2', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default SignUp;