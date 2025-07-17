import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsUpload from '../components/News/NewsUpload';
import Box from '@mui/material/Box';

const NewsUploadPage = () => {
  const navigate = useNavigate();
  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token') ? true : false
    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      navigate('/');
    }
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        background: 'linear-gradient(135deg, #8e24aa 0%, #1976d2 100%)',
        p: 0,
        m: 0,
      }}
    >
      <NewsUpload />
    </Box>
  );
};

export default NewsUploadPage;