import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUp from '../components/Auth/SignUp';

const SignUpPage = ({ onLogin }) => {
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      // Redirect to admin page if already logged in
      navigate('/admin');
    }
  }, [navigate]);
  
  return <SignUp onLogin={onLogin} />;
};

export default SignUpPage;