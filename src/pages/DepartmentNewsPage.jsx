import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DepartmentPage from '../components/Department/DepartmentPage';

const DepartmentNewsPage = () => {
  const navigate = useNavigate();
  
  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token') ? true : false
    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      navigate('/');
    }
  }, [navigate]);
  
  return <DepartmentPage />;
};

export default DepartmentNewsPage;