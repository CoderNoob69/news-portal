import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../components/Profile/UserProfile';

const ProfilePage = ({ onUserNameChange }) => {
  const navigate = useNavigate();
  
  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      navigate('/');
    }
  }, [navigate]);
  
  return <UserProfile onUserNameChange={onUserNameChange} />;
};

export default ProfilePage;