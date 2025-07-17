// src/components/Sidebar.jsx
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaUser, FaHome, FaPlus, FaBuilding, FaSignOutAlt
} from 'react-icons/fa';
import './Navbar.css';

const API_ME = 'http://localhost:4000/api/data/user';

const Sidebar = ({ onLogout }) => {
  const [me, setMe] = useState(null);
  const navigate   = useNavigate();

  /* fetch user once */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { onLogout(); return; }

    axios.get(API_ME, { headers:{ Authorization:`Bearer ${token}` } })
      .then(({ data }) => setMe(data))
      .catch(() => { onLogout(); navigate('/'); });
  }, [onLogout, navigate]);

  if (!me) return null;

  const handleLogout = () => { onLogout(); navigate('/'); };

  return (
    <aside className="sidebar">
      {/* ── profile ── */}
      <div className="sidebar-top">
        <div className="sidebar-profile">
          <button className="sidebar-profile-btn" style={{
            background:'none',border:'none',padding:0,cursor:'pointer',
            display:'flex',flexDirection:'column',alignItems:'center'
          }}>
            <div className="sidebar-profile-icon"><FaUser/></div>
            <div className="sidebar-profile-name">{me.username}</div>
            <small>{me.deptLong} ({me.deptShort})</small>
          </button>
        </div>
      </div>

      {/* ── core links ── */}
      <NavLink to="/admin"
        className={({isActive})=>'sidebar-link'+(isActive?' active':'')}>
        <FaHome/> Home
      </NavLink>

      {/* Show Manage Accounts only for FULL_ADMIN_1 with full access */}
      {me.username === 'FULL_ADMIN_1' && me.access === 'full' && (
        <NavLink to="/accounts"
          className={({isActive})=>'sidebar-link'+(isActive?' active':'')}>
          <FaUser/> Manage Accounts
        </NavLink>
      )}

      {me.access === 'full' ? (
        <NavLink to="/departments"
          className={({isActive})=>'sidebar-link'+(isActive?' active':'')}>
          <FaBuilding/> Departments
        </NavLink>
      ) : (
        <NavLink to="/post"
          className={({isActive})=>'sidebar-link'+(isActive?' active':'')}>
          <FaPlus/> Post a News
        </NavLink>
      )}

      {/* ── logout ── */}
      <div className="sidebar-bottom">
        <button className="sidebar-logout" onClick={handleLogout}>
          <FaSignOutAlt/> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
