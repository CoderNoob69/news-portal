import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { FaUser, FaBuilding, FaIdBadge, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

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
    if (Object.values(formData).some(value => !value)) {
      setError('All fields are required');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // In a real app, this would be an API call to register the user
    // For demo purposes, we'll just simulate a successful registration
    console.log('Registration with:', formData);
    
    // Mock successful registration and login
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', formData.email);
    localStorage.setItem('userName', formData.name);
    localStorage.setItem('userBranch', formData.branch);
    localStorage.setItem('userDesignation', formData.designation);
    // Call onLogin to update App state
    if (onLogin) onLogin(formData.name);
    // Redirect to admin page after registration
    navigate('/admin');
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Sign Up for NIT Raipur News Portal</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <span className="input-icon"><FaUser /></span>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="branch">Department</label>
            <span className="input-icon"><FaBuilding /></span>
            <select
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              style={{ paddingLeft: '2.5rem' }}
            >
              <option value="">Select your department</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="designation">Designation</label>
            <span className="input-icon"><FaIdBadge /></span>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Enter your designation"
              required
            />
          </div>
          
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
              placeholder="Create a password"
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <span className="input-icon"><FaLock /></span>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              className="password-input"
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          <button type="submit" className="auth-button">Sign Up</button>
        </form>
        
        <div className="auth-links">
          <p>Already have an account? <Link to="/">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;