import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    // In a real app, this would be an API call to authenticate
    // For demo purposes, we'll just simulate a successful login
    console.log('Login attempt with:', formData);
    
    // Mock successful login
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', formData.email);
    
    // Set a default user name based on the email
    const userName = formData.email.split('@')[0];
    localStorage.setItem('userName', userName);
    localStorage.setItem('userDepartment', 'Computer Science');
    
    // Call onLogin to update App state
    if (onLogin) onLogin(userName);
    
    // Redirect to admin page after login
    navigate('/admin');
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Login to NIT Raipur News Portal</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <span className="input-icon"><FaEnvelope /></span>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <span className="input-icon"><FaLock /></span>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="password-input"
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          <button type="submit" className="auth-button">Login</button>
        </form>
        
        <div className="auth-links">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;