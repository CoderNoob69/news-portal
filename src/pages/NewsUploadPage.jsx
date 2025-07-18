import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsUpload from '../components/News/NewsUpload';

const NewsUploadPage = () => {
  const navigate = useNavigate();

  // auth check
  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) navigate('/');
  }, [navigate]);

  // NewsUpload renders its own layout (gradient, padding, etc.)
  return <NewsUpload />;
};

export default NewsUploadPage;
