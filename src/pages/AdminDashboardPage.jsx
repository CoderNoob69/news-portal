import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPage from '../components/Admin/AdminPage';
import Sidebar from '../components/Navbar/Sidebar';

const AdminDashboardPage = ({ isLoggedIn, userName, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('news');

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token') ? true : false
    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      navigate('/');
    }
  }, [navigate]);

  return <AdminPage activeTab={activeTab} setActiveTab={setActiveTab} />;
};

export default AdminDashboardPage;