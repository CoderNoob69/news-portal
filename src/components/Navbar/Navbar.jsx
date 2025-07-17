import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import reactLogo from '../../assets/react.svg';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({ showSidebarToggle, onSidebarToggle }) => {
  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          zIndex: 1201,
          background: '#fff',
          borderRadius: 0,
          boxShadow: '0 2px 8px 0 rgba(142,36,170,0.04)',
        }}
      >
        <Toolbar sx={{ minHeight: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 1, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {showSidebarToggle && (
              <IconButton edge="start" color="primary" aria-label="open sidebar" onClick={onSidebarToggle} sx={{ mr: 1 }}>
                <MenuIcon sx={{ color: '#1976d2' }} />
              </IconButton>
            )}
            <Box component="img" src={reactLogo} alt="NIT Raipur Logo" sx={{ height: 36, mr: 1, filter: 'drop-shadow(0 2px 8px #42a5f5)' }} />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.5, color: '#222' }}>
              NIT Raipur News Portal
            </Typography>
          </Box>
          {/* Right side intentionally left empty */}
        </Toolbar>
        <Divider sx={{ bgcolor: '#e3e3e3', height: 2 }} />
      </AppBar>
    </>
  );
};

export default Navbar;