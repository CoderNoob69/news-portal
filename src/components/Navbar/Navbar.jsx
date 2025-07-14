import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';
// Use a placeholder image until we can properly fix the logo issue
import reactLogo from '../../assets/react.svg';

const Navbar = () => {
  return (
    <nav className="navbar header-navbar">
      <div className="header-content">
        <img src={reactLogo} alt="NIT Raipur Logo" className="header-logo" />
        <span className="header-title">National Institute of Technology Raipur</span>
      </div>
    </nav>
  );
};

export default Navbar;