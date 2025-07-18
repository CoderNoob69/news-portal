// src/components/Department/DepartmentPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NewsList from '../News/NewsList';
import NewsUpload from '../News/NewsUpload';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import axios from 'axios';

const API_DEPTS = 'http://localhost:4000/api/data/dept';

/*
 * Responsive width tokens
 * -----------------------
 * We centralize the widths used by both the heading Card and the content wrapper
 * so they stay visually aligned. Adjust these numbers if you want a wider or
 * narrower layout; they’re intentionally generous on desktop but still readable
 * on large monitors.
 */
const WIDTHS = {
  xs: '100%',   // phones: full width (with padding via px on wrapper)
  sm: 540,      // ~small tablets
  md: 800,      // laptops
  lg: 1000,     // large desktop
  xl: 1200      // huge screens
};

export default function DepartmentPage() {
  const [activeTab, setActiveTab] = useState('news');
  const { department } = useParams();
  const navigate = useNavigate();

  /* user dept comes from login bootstrap (localStorage) ------------------- */
  const userDepartment = localStorage.getItem('userBranch');

  /* If no department slug in URL, redirect to user dept ------------------- */
  useEffect(() => {
    if (!department && userDepartment) {
      navigate(`/department/${encodeURIComponent(userDepartment)}`);
    }
  }, [department, userDepartment, navigate]);

  /* If neither provided, show error --------------------------------------- */
  if (!department && !userDepartment) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #8e24aa 0%, #1976d2 100%)',
          px: 2
        }}
      >
        <Card
          elevation={8}
          sx={{ p: 4, borderRadius: 3, width: '100%', maxWidth: 500, mx: 'auto' }}
        >
          <Typography
            variant="h5"
            color="error"
            sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}
          >
            No department selected. Please select a department from the admin page.
          </Typography>
          <Button fullWidth variant="contained" onClick={() => navigate('/admin')}>
            Go to Admin
          </Button>
        </Card>
      </Box>
    );
  }

  const activeDepartment = department || userDepartment;

  /* map deptShort -> deptLong ------------------------------------------------ */
  const [deptMap, setDeptMap] = useState({});
  useEffect(() => {
    axios
      .get(API_DEPTS)
      .then(({ data }) => {
        const map = {};
        data.forEach((d) => {
          map[d.deptShort] = d.deptLong;
        });
        setDeptMap(map);
      })
      .catch(console.error);
  }, []);

  const isUserDepartment = department === userDepartment;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #8e24aa 0%, #1976d2 100%)',
        py: { xs: 4, sm: 6, md: 8 },
        px: 2, // global horizontal padding so 100% width boxes don't touch edges on mobile
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* Department heading -------------------------------------------------- */}
      <Card
        elevation={8}
        sx={{
          width: '100%',
          maxWidth: WIDTHS,
          mb: { xs: 3, sm: 4 },
          borderRadius: 3,
          boxShadow: 8,
          textAlign: 'center'
        }}
      >
        <CardContent sx={{ py: { xs: 2.5, sm: 3.5 } }}>
          <Typography
            variant="h2"
            color="primary"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.8rem', sm: '2.4rem', md: '2.8rem' },
              letterSpacing: 0.5,
              lineHeight: 1.2,
              wordBreak: 'break-word' // long dept names wrap gracefully
            }}
          >
            {deptMap[activeDepartment] || activeDepartment}
          </Typography>
        </CardContent>
      </Card>

      {/* Content wrapper ---------------------------------------------------- */}
      <Box
        sx={{
          width: '100%',
          maxWidth: WIDTHS,
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: 6,
          p: { xs: 2, sm: 4, md: 5 }
        }}
      >
        {/* Upload button is only shown if viewing *your* department ---------- */}
        <ButtonGroup
          fullWidth
          variant="outlined"
          sx={{ mb: 3, borderRadius: 2, boxShadow: 1 }}
        >
          {/* Always show "News" button (selected by default) */}
          <Button
            variant={activeTab === 'news' ? 'contained' : 'outlined'}
            color={activeTab === 'news' ? 'primary' : 'inherit'}
            sx={{ fontWeight: 700, borderRadius: 2, fontSize: '1.05rem' }}
            onClick={() => setActiveTab('news')}
          >
            News
          </Button>

          {isUserDepartment && (
            <Button
              variant={activeTab === 'upload' ? 'contained' : 'outlined'}
              color={activeTab === 'upload' ? 'primary' : 'inherit'}
              sx={{ fontWeight: 700, borderRadius: 2, fontSize: '1.05rem' }}
              onClick={() => setActiveTab('upload')}
            >
              Upload News
            </Button>
          )}
        </ButtonGroup>

        {activeTab === 'news' ? (
          <NewsList departmentFilter={activeDepartment} />
        ) : (
          <NewsUpload />
        )}
      </Box>
    </Box>
  );
}
