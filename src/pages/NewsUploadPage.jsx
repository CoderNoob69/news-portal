import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsUpload from '../components/News/NewsUpload';

const NewsUploadPage = () => {
  const navigate = useNavigate();
  
  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      navigate('/');
    }
  }, [navigate]);
  
  return <NewsUpload />;
};

export default NewsUploadPage;