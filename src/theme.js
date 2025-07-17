import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#8e24aa', // Purple 700
      dark: '#5c007a', // Purple 900
      light: '#e1bee7', // Purple 100
      contrastText: '#fff',
    },
    secondary: {
      main: '#1976d2', // Blue 700
      dark: '#143a6d', // Blue dark
      light: '#e3f0ff', // Blue light
      contrastText: '#fff',
    },
    background: {
      default: '#f5f6fa',
      paper: '#fff',
    },
    error: {
      main: '#d32f2f',
    },
    success: {
      main: '#2e7d32',
    },
    warning: {
      main: '#ed6c02',
    },
    info: {
      main: '#0288d1',
    },
    text: {
      primary: '#2d235a', // Deep neutral for contrast
      secondary: '#5c007a', // Purple dark for accents
      disabled: '#90caf9',
    },
  },
  typography: {
    fontFamily: 'Public Sans, Roboto, Helvetica, Arial, sans-serif',
    h1: { fontWeight: 800, fontSize: '2.2rem', letterSpacing: 0.5 },
    h2: { fontWeight: 700, fontSize: '1.7rem', letterSpacing: 0.2 },
    h3: { fontWeight: 700, fontSize: '1.3rem' },
    h4: { fontWeight: 600, fontSize: '1.1rem' },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.95rem' },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme; 