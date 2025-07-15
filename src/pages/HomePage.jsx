import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Auth/Login';

const HomePage = ({ onLogin }) => {
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token') ? true : false
    if (isLoggedIn) {
      // Redirect to admin page if already logged in
      navigate('/admin');
    }
  }, [navigate]);
  
  return <Login onLogin={onLogin} />;
};

export default HomePage;