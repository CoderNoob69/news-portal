import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const API_LOGIN = 'http://localhost:4000/api/login';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error,    setError]    = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const navigate = useNavigate();

  /* ---------------------- input change ---------------------- */
  const handleChange = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  /* ---------------------- submit ---------------------------- */
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('All fields are required');
      return;
    }

    try {
      const { data } = await axios.post(API_LOGIN, formData);
      localStorage.setItem('token', data.token);          // <— save JWT
      /* optional: decode token here to grab dept / access */

      if (onLogin) onLogin(formData.username);
      navigate('/admin');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Login to NIT Raipur News Portal</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* -------- username -------- */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <span className="input-icon"><FaEnvelope /></span>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

          {/* -------- password -------- */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <span className="input-icon"><FaLock /></span>
            <input
              type={showPwd ? 'text' : 'password'}
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
              onClick={() => setShowPwd(p => !p)}
              tabIndex={-1}
              aria-label={showPwd ? 'Hide password' : 'Show password'}
            >
              {showPwd ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit" className="auth-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
