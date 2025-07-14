import { FaUser, FaHome, FaNewspaper, FaPlus, FaList, FaSignOutAlt, FaBuilding } from 'react-icons/fa';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

const Sidebar = ({ isLoggedIn, userName, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  if (!isLoggedIn) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-profile">
          <button className="sidebar-profile-btn" onClick={() => navigate('/profile')} style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div className="sidebar-profile-icon">
              <FaUser />
            </div>
            <div className="sidebar-profile-name">{userName || 'User'}</div>
          </button>
        </div>
      </div>
      <div className="sidebar-middle">
        <NavLink to="/admin" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
          <FaHome /> Home
        </NavLink>
        <NavLink to="/departments" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
          <FaBuilding /> Departments
        </NavLink>
        <NavLink to="/department" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
          <FaNewspaper /> News
        </NavLink>
        <NavLink to="/post" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
          <FaPlus /> Post a News
        </NavLink>
        <NavLink to="/my-posts" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
          <FaList /> My Posts
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
          <FaUser /> Profile
        </NavLink>
      </div>
      <div className="sidebar-bottom">
        <button className="sidebar-logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 